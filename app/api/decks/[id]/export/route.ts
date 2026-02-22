import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db';
import { cardsToCSV } from '@/app/lib/export';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const deck = await prisma.deck.findUnique({
      where: { id: id },
      include: { cards: true },
    });

    if (!deck || deck.ownerId !== session.user?.id) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    const csv = cardsToCSV(
      deck.cards.map((c: any) => ({
        word: c.word,
        partOfSpeech: c.partOfSpeech,
        definition: c.definition,
        exampleSentence: c.exampleSentence,
        phonetic: c.phonetic,
        vietnamese: c.vietnamese,
      }))
    );

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${deck.title}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
