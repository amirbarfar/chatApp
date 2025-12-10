import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const POST = async (request: Request) => {
  const body = await request.json();
  const { name, groupId } = body;

  if (!name || !groupId) {
    return Response.json({ error: 'Name and groupId required' }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    let userId = cookieStore.get('userId')?.value;

    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (user) {
        user = await prisma.user.update({
          where: { id: parseInt(userId) },
          data: { displayName: name },
        });
      }
    }
    if (!user) {
      user = await prisma.user.create({
        data: { displayName: name },
      });
      cookieStore.set('userId', user.id.toString(), { path: '/', maxAge: 60 * 60 * 24 * 365 }); 
    }

    const group = await prisma.group.findUnique({
      where: { uniqueId: groupId },
    });

    if (!group) {
      return Response.json({ error: 'گروه یافت نشد' }, { status: 404 });
    }

    const existingMember = await prisma.group.findUnique({
      where: { id: group.id },
      include: { members: true },
    });

    const isMember = existingMember?.members.some((m: any) => m.id === user.id);

    if (!isMember) {
      await prisma.group.update({
        where: { id: group.id },
        data: {
          members: {
            connect: { id: user.id },
          },
        },
      });
    }

    return Response.json({ success: true, groupId: group.uniqueId, userId: user.id });
  } catch (error) {
    console.error('Error joining group:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
};