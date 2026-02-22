/**
 * Configuration constants for the application
 */

export const APP_CONFIG = {
  // App metadata
  APP_NAME: 'VocabCards',
  APP_DESCRIPTION: 'Learn English vocabulary with AI-powered flashcards',

  // API constraints
  MAX_CARDS_PER_DECK: 100,
  MIN_CARDS_PER_DECK: 5,
  DEFAULT_CARDS_PER_DECK: 20,

  // Supported languages
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Vietnamese' },
  ],

  // Difficulty levels
  DIFFICULTY_LEVELS: [
    { value: 'basic', label: 'Basic (Beginner)', description: 'Common, everyday words' },
    {
      value: 'standard',
      label: 'Standard (Intermediate)',
      description: 'Intermediate vocabulary',
    },
    {
      value: 'advanced',
      label: 'Advanced (Professional)',
      description: 'Advanced academic and professional vocabulary',
    },
  ],

  // SRS configuration
  SRS: {
    MIN_EASINESS: 1.3,
    MAX_EASINESS: 2.5,
    DEFAULT_EASINESS: 2.5,
    INITIAL_INTERVAL: 1,
    PERFECT_QUALITY: 5,
    PASS_QUALITY: 3,
  },

  // Review quality ratings
  REVIEW_QUALITY: [
    { value: 1, label: '❌ Forgot', color: 'red' },
    { value: 3, label: '🤔 Difficult', color: 'yellow' },
    { value: 5, label: '✅ Perfect', color: 'green' },
  ],

  // Session configuration
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GENERATE: '/generate',
  IMPORT: '/import',
  STUDY: (id: string) => `/study/${id}`,
  SETTINGS: '/settings',
};
