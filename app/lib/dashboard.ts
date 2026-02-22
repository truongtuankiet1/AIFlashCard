/**
 * Dashboard analytics and statistics utilities
 */

export interface DeckStats {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  cardsToReviewToday: number;
  lastReviewDate?: Date;
  averageEasiness: number;
}

export function calculateDeckStats(
  cards: any[]
): DeckStats {
  let masteredCards = 0;
  let cardsToReviewToday = 0;
  let totalEasiness = 0;
  let reviewedCards = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  cards.forEach((card) => {
    if (card.userProgress && card.userProgress.length > 0) {
      const progress = card.userProgress[0];

      if (progress.isKnown && progress.repetitions >= 3) {
        masteredCards += 1;
      }

      if (progress.nextReviewDate <= today) {
        cardsToReviewToday += 1;
      }

      if (progress.repetitions > 0) {
        totalEasiness += progress.easinessFactor;
        reviewedCards += 1;
      }
    }
  });

  const averageEasiness =
    reviewedCards > 0 ? totalEasiness / reviewedCards : 2.5;

  return {
    totalCards: cards.length,
    masteredCards,
    learningCards: cards.length - masteredCards,
    newCards: cards.filter(
      (c) => c.userProgress?.[0]?.repetitions === 0
    ).length,
    cardsToReviewToday,
    averageEasiness: Math.round(averageEasiness * 100) / 100,
  };
}

/**
 * Get next review date in human-readable format
 */
export function formatNextReviewDate(date: Date): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === new Date().toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}

/**
 * Calculate learning streak based on review dates
 */
export function calculateStreak(reviewDates: Date[]): number {
  if (reviewDates.length === 0) return 0;

  const sortedDates = reviewDates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const reviewDate of sortedDates) {
    const review = new Date(reviewDate);
    review.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - review.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = review;
    } else {
      break;
    }
  }

  return streak;
}
