import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './db';

export interface FlashcardData {
  word: string;
  part_of_speech: string;
  definition: string;
  example_sentence: string;
  phonetic?: string;
  vietnamese?: string; // Kept for backward compatibility if needed, but we should move to translation
  translation?: string;
}

export async function generateFlashcards(
  topic: string,
  count: number = 20,
  difficulty: 'basic' | 'standard' | 'advanced' = 'standard',
  language: string = 'english',
  userApiKey?: string,
  userId?: string
): Promise<FlashcardData[]> {
  // Use user's API key if available, otherwise use system key
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const difficultyGuides = {
    basic: 'Common, everyday words suitable for beginners',
    standard: 'Intermediate vocabulary with moderate difficulty',
    advanced: 'Advanced academic and professional vocabulary',
  };

  const prompt = `Generate ${count} ${language} vocabulary words related to the topic: "${topic}"
  
Difficulty level: ${difficultyGuides[difficulty]}
Definition language: ${language}

For each word, provide:
1. Word
2. Part of speech (noun, verb, adjective, etc.)
3. Definition in ${language}
4. Example sentence in ${language}
5. Phonetic pronunciation (IPA format)
6. Vietnamese translation

Return the response as a valid JSON array with this structure:
[
  {
    "word": "example",
    "part_of_speech": "noun",
    "definition": "...",
    "example_sentence": "...",
    "phonetic": "...",
    "translation": "Vietnamese translation here"
  }
]

Ensure the response is valid JSON only, with no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    console.log('Gemini Raw Response:', content); // Debug log

    if (!content) {
      throw new Error('No response from Gemini');
    }

    // Clean content from markdown code blocks if present
    // Handle various formats: ```json, ``` json, ```JSON, etc.
    let cleanedContent = content
      .replace(/```(?:json|JSON)?\s*/g, '') // Remove opening code blocks
      .replace(/```\s*/g, '') // Remove closing code blocks
      .trim();

    console.log('Cleaned Content:', cleanedContent); // Debug log

    // Parse JSON from response - find the array
    const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('JSON Match Failed. Content:', cleanedContent);
      throw new Error('Invalid response format from Gemini - no JSON array found');
    }

    let cards: FlashcardData[];
    try {
      cards = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0]);
      throw new Error('Failed to parse JSON from Gemini response');
    }


    console.log('Parsed Cards:', cards.length); // Debug log

    // Track API usage if userId is provided
    if (userId) {
      try {
        await prisma.aPIKeyUsage.create({
          data: {
            userId,
            deckId: '', // Will be set after deck creation
            tokensUsed: count * 50, // Estimate
            costEstimated: 0, // Gemini is free for basic usage
          },
        });
      } catch (usageError) {
        console.error('Failed to track API usage:', usageError);
        // Don't fail the generation if tracking fails
      }
    }

    return cards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}

