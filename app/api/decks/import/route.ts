import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { csvToCards } from '@/app/lib/export';
import { z } from 'zod';

const ImportSchema = z.object({
  title: z.string().min(1),
  topic: z.string().min(1),
  csvContent: z.string().min(1),
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
    const { title, topic, csvContent } = ImportSchema.parse(body);

    // Parse CSV
    const cards = csvToCards(csvContent);

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'No valid cards found in CSV' },
        { status: 400 }
      );
    }

    // Create deck
    const deck = await prisma.deck.create({
      data: {
        ownerId: session.user.id,
        topic,
        title,
        cards: {
          create: cards.map((card) => ({
            word: card.word,
            partOfSpeech: card.partOfSpeech,
            definition: card.definition,
            exampleSentence: card.exampleSentence,
            phonetic: card.phonetic,
            translation: card.translation,
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    // Initialize user progress
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
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import deck' },
      { status: 500 }
    );
  }
}
