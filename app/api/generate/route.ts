import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { generateFlashcards, FlashcardData } from '@/app/lib/llm';
import { decryptApiKey } from '@/app/lib/crypto';
import { z } from 'zod';

const GenerateSchema = z.object({
  topic: z.string().min(1),
  count: z.number().int().min(5).max(100).default(20),
  difficulty: z.enum(['basic', 'standard', 'advanced']).default('standard'),
  language: z.string().default('english'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { topic, count, difficulty, language } = GenerateSchema.parse(body);

    // Get user's encrypted API key (if available)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { encryptedApiKey: true },
    });

    if (!session.user?.id) {
      return NextResponse.json(
        { error: 'Session user ID missing' },
        { status: 401 }
      );
    }

    let userApiKey: string | undefined;
    if (user?.encryptedApiKey) {
      try {
        userApiKey = decryptApiKey(user.encryptedApiKey);
      } catch (error) {
        console.error('Failed to decrypt user API key:', error);
      }
    }

    // Generate flashcards using LLM
    const cards: FlashcardData[] = await generateFlashcards(
      topic,
      count,
      difficulty,
      language,
      userApiKey,
      session.user.id
    );

    // Create deck
    const deck = await prisma.deck.create({
      data: {
        ownerId: session.user.id,
        topic,
        title: topic,
        difficulty,
        language,
        cards: {
          create: cards.map((card) => ({
            word: card.word,
            partOfSpeech: card.part_of_speech,
            definition: card.definition,
            exampleSentence: card.example_sentence,
            phonetic: card.phonetic,
            translation: card.translation,
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    // Initialize user progress for all cards
    const cardIds = deck.cards.map((c: any) => c.id);
    await prisma.userProgress.createMany({
      data: cardIds.map((cardId: string) => ({
        userId: session.user?.id || '',
        cardId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        deck: {
          id: deck.id,
          topic: deck.topic,
          title: deck.title,
          cardCount: deck.cards.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate flashcards error:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
