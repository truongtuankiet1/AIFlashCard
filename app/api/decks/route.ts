import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decks = await prisma.deck.findMany({
      where: { ownerId: session.user.id },
      include: {
        _count: {
          select: { cards: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Get decks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
