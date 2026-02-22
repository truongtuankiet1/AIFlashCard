import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ deckId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get cards that need review today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cardsToReview = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
        nextReviewDate: {
          lte: today,
        },
      },
      include: {
        card: true,
      },
      orderBy: { nextReviewDate: 'asc' },
    });

    return NextResponse.json({ cards: cardsToReview });
  } catch (error) {
    console.error('Get review cards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
