'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FlashcardComponent } from '@/app/ui/flashcard';

interface Card {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  phonetic?: string;
  translation?: string;
  userProgress: { nextReviewDate: string }[];
}

interface Deck {
  id: string;
  topic: string;
  title: string;
  language: string;
  cards: Card[];
}

export default function StudyPage() {
  const router = useRouter();
  const params = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviews, setReviews] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());
  const [gamificationResult, setGamificationResult] = useState<any>(null);
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);


  const deckId = params.id as string;

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(`/api/decks/${deckId}`);
        if (response.ok) {
          const data = await response.json();
          setDeck(data.deck);
        } else {
          setError('Failed to load deck');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [deckId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMark = async (quality: number) => {
    if (!deck) return;

    const card = deck.cards[currentCardIndex];

    // Record review locally
    const newReviews = { ...reviews, [card.id]: quality };
    setReviews(newReviews);

    try {
      const response = await fetch(`/api/cards/${card.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality }),
      });

      if (response.ok) {
        // Move to next card
        if (currentCardIndex < deck.cards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
          setIsFlipped(false);
        } else {
          // Completed deck
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error marking card:', error);
    }
  };

  useEffect(() => {
    const completeSession = async () => {
      if (isCompleted && !isSubmittingSession && !gamificationResult) {
        setIsSubmittingSession(true);
        const durationMinutes = (Date.now() - startTime) / (1000 * 60);
        const cardsStudied = Object.keys(reviews).length;
        const accuracy = cardsStudied > 0
          ? Object.values(reviews).filter(q => q >= 3).length / cardsStudied
          : 0;

        try {
          const res = await fetch('/api/gamification/session-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cardsStudied,
              accuracy,
              durationMinutes
            })
          });
          if (res.ok) {
            const result = await res.json();
            setGamificationResult(result);
          }
        } catch (err) {
          console.error('Failed to submit gamification results', err);
        } finally {
          setIsSubmittingSession(false);
        }
      }
    };
    completeSession();
  }, [isCompleted, isSubmittingSession, gamificationResult, reviews, startTime]);


  const handleNext = () => {
    if (currentCardIndex < deck!.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <p className="text-gray-600">Loading deck...</p>
      </div>
    );
  }

  // Summary View
  if (isCompleted && deck) {
    const totalCards = deck.cards.length;
    const reviewValues = Object.values(reviews);

    const perfectCount = reviewValues.filter(q => q === 5).length;
    const difficultCount = reviewValues.filter(q => q === 3).length;
    const forgotCount = reviewValues.filter(q => q === 1).length;
    const skippedCount = totalCards - reviewValues.length;

    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Deck Completed!</h2>
          <p className="text-gray-600 mb-8">Great job on finishing "{deck.title}"</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">{perfectCount}</div>
              <div className="text-sm text-green-700 font-medium">Perfect</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-600">{difficultCount}</div>
              <div className="text-sm text-yellow-700 font-medium">Difficult</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="text-2xl font-bold text-red-600">{forgotCount}</div>
              <div className="text-sm text-red-700 font-medium">Forgot</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-2xl font-bold text-gray-600">{skippedCount}</div>
              <div className="text-sm text-gray-700 font-medium">Skipped</div>
            </div>
          </div>

          {gamificationResult && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10 flex justify-around">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-black opacity-80 tracking-widest mb-1">Coins Earned</p>
                  <p className="text-3xl font-black">+{gamificationResult.coinsEarned} 🪙</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-black opacity-80 tracking-widest mb-1">EXP Earned</p>
                  <p className="text-3xl font-black">+{gamificationResult.expEarned} ✨</p>
                </div>
              </div>

              {gamificationResult.leveledUp && (
                <div className="mt-4 bg-white/20 backdrop-blur-md rounded-lg py-1 px-3 inline-block animate-bounce border border-white/30 text-sm font-bold">
                  🎊 Pet Leveled Up to {gamificationResult.newLevel}!
                </div>
              )}

              {gamificationResult.completedMissions.length > 0 && (
                <div className="mt-3 space-y-1">
                  {gamificationResult.completedMissions.map((m: string) => (
                    <div key={m} className="text-xs font-bold flex items-center justify-center gap-1">
                      ✅ Mission Accomplished: {m}
                    </div>
                  ))}
                </div>
              )}

              {gamificationResult.petDialogue && (
                <div className="mt-4 pt-4 border-t border-white/20 italic text-sm opacity-90">
                  "{gamificationResult.petDialogue}"
                </div>
              )}
            </div>
          )}


          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/generate')}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition transform hover:scale-[1.02]"
            >
              Generate New Deck ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Deck not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-purple-600 font-semibold hover:underline mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.title}</h1>
            <p className="text-gray-600">{deck.topic}</p>
          </div>
          <button
            onClick={() => setIsCompleted(true)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition"
          >
            🏁 Finish Review
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Card {currentCardIndex + 1} of {deck.cards.length}
            </p>
            <p className="text-sm text-gray-600">{Math.round(progress)}%</p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <FlashcardComponent
          card={{
            word: currentCard.word,
            partOfSpeech: currentCard.partOfSpeech,
            definition: currentCard.definition,
            exampleSentence: currentCard.exampleSentence,
            phonetic: currentCard.phonetic,
            translation: currentCard.translation,
          }}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onMark={handleMark}
          language={deck.language}
        />

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={handlePrev}
            disabled={currentCardIndex === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50"
          >
            ← Previous
          </button>
          <p className="text-gray-600 font-semibold">
            {currentCardIndex + 1} / {deck.cards.length}
          </p>
          <button
            onClick={handleNext}
            disabled={currentCardIndex === deck.cards.length - 1}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
