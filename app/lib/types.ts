// Type definitions for the application

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User & {
    id: string;
  };
}

export interface Deck {
  id: string;
  ownerId: string;
  topic: string;
  title: string;
  description?: string;
  difficulty: 'basic' | 'standard' | 'advanced';
  language: string;
  createdAt: Date;
  cards: Card[];
}

export interface Card {
  id: string;
  deckId: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  phonetic?: string;
  translation?: string;
  userProgress?: UserProgress[];
}

export interface UserProgress {
  id: string;
  userId: string;
  cardId: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  isKnown: boolean;
  reviewCount: number;
  lastReviewDate?: Date;
}

export interface FlashcardDisplayCard {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  phonetic?: string;
  translation?: string;
}

export interface GenerateRequest {
  topic: string;
  count?: number;
  difficulty?: 'basic' | 'standard' | 'advanced';
  language?: string;
}

export interface ReviewRequest {
  quality: number; // 0-5
}

export interface ReviewResponse {
  progress: UserProgress;
}
