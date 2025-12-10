import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async () => {
  try {
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const group = await prisma.group.create({
      data: {
        uniqueId,
        name: `Group ${uniqueId}`,
      },
    });
    return NextResponse.json({ groupId: group.uniqueId });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
};