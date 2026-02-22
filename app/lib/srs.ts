/**
 * SM-2 Spaced Repetition Algorithm
 * https://en.wikipedia.org/wiki/SuperMemo
 */

export interface SRSState {
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

export interface ReviewInput {
  quality: number; // 0-5: 0=forgotten, 3=difficult, 5=perfect
}

/**
 * Calculate next review parameters using SM-2 algorithm
 */
export function calculateNextReview(
  currentState: SRSState,
  quality: number
): SRSState {
  let { easinessFactor, interval, repetitions } = currentState;

  // Validate quality (0-5)
  const q = Math.max(0, Math.min(5, quality));

  // New easiness factor
  easinessFactor = Math.max(
    1.3,
    easinessFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
  );

  // New interval and repetitions
  if (q < 3) {
    // Forgotten - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Remembered
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easinessFactor: Math.round(easinessFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Get cards that need review today
 */
export function hasCardsForReview(nextReviewDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextReviewDate <= today;
}

/**
 * Get review statistics
 */
export interface ReviewStats {
  totalCards: number;
  cardsToReviewToday: number;
  newCards: number;
  masteredCards: number;
  learningStreak: number;
}

export function calculateReviewStats(
  allCards: { userProgress: { nextReviewDate: Date; isKnown: boolean; repetitions: number }[] }[],
  lastReviewDate?: Date
): ReviewStats {
  let cardsToReviewToday = 0;
  let masteredCards = 0;
  let newCards = 0;

  allCards.forEach((card) => {
    if (card.userProgress && card.userProgress.length > 0) {
      const progress = card.userProgress[0];
      if (hasCardsForReview(progress.nextReviewDate)) {
        cardsToReviewToday += 1;
      }
      if (progress.isKnown) {
        masteredCards += 1;
      }
      if (progress.repetitions === 0) {
        newCards += 1;
      }
    }
  });

  return {
    totalCards: allCards.length,
    cardsToReviewToday,
    newCards,
    masteredCards,
    learningStreak: 0, // Can be calculated from daily reviews
  };
}
