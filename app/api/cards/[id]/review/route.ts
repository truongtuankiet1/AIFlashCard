import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { calculateNextReview } from '@/app/lib/srs';
import { z } from 'zod';

const ReviewSchema = z.object({
  quality: z.number().int().min(0).max(5),
});

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
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

    const body = await request.json();
    const { quality } = ReviewSchema.parse(body);

    // Get current progress
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: params.id,
        },
      },
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    // Calculate next review using SM-2
    const nextReview = calculateNextReview(
      {
        easinessFactor: progress.easinessFactor,
        interval: progress.interval,
        repetitions: progress.repetitions,
        nextReviewDate: progress.nextReviewDate,
      },
      quality
    );

    // Update progress
    const updatedProgress = await prisma.userProgress.update({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: params.id,
        },
      },
      data: {
        ...nextReview,
        isKnown: quality >= 3,
        reviewCount: progress.reviewCount + 1,
        lastReviewDate: new Date(),
      },
    });

    return NextResponse.json({ progress: updatedProgress });
  } catch (error) {
    console.error('Review card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
