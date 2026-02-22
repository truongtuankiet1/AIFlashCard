'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DeckCardProps {
  id: string;
  topic: string;
  title: string;
  cardCount: number;
  createdAt: string;
}

export function DeckCard({ id, topic, title, cardCount, createdAt }: DeckCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 cursor-pointer"
      onClick={() => router.push(`/study/${id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{topic}</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
          {cardCount} cards
        </span>
      </div>

      <p className="text-xs text-gray-500">
        Created {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

interface DeckListProps {
  decks: DeckCardProps[];
}

export function DeckList({ decks }: DeckListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DeckCard key={deck.id} {...deck} />
      ))}
    </div>
  );
}
