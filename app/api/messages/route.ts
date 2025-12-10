import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const uniqueId = searchParams.get('uniqueId');

  if (!uniqueId) {
    return NextResponse.json({ error: 'uniqueId required' }, { status: 400 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { uniqueId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { groupId: group.id },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  const body = await request.json();
  const { text, uniqueId } = body;

  if (!text || !uniqueId) {
    return NextResponse.json({ error: 'text and uniqueId required' }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { uniqueId },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content: text,
        userId: parseInt(userId),
        groupId: group.id,
      },
      include: { user: true },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};