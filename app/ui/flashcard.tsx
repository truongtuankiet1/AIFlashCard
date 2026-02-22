'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Flashcard {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  phonetic?: string;
  translation?: string;
}

interface FlashcardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onMark: (quality: number) => void;
  language: string;
}

const LANGUAGE_CODES: Record<string, string> = {
  english: 'en-US',
  russian: 'ru-RU',
  french: 'fr-FR',
  vietnamese: 'vi-VN',
  // Add more as needed
};

export function FlashcardComponent({
  card,
  isFlipped,
  onFlip,
  onMark,
  language,
}: FlashcardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playAudio = async () => {
    setIsPlayingAudio(true);
    try {
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.rate = 0.8; // Slightly slower for better clarity

      // key is 'russian', 'english' etc from DB. value is 'ru-RU'
      const langCode = LANGUAGE_CODES[language.toLowerCase()] || 'en-US';
      utterance.lang = langCode;

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card */}
      <div
        onClick={onFlip}
        className="cursor-pointer h-80 perspective mb-8"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform ${isFlipped ? 'rotate-y-180' : ''
            }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className={`absolute w-full h-full bg-gradient-to-br from-[#A855F7] via-[#6366F1] to-[#3B82F6] rounded-[32px] shadow-2xl p-10 flex flex-col items-center justify-center text-white ${isFlipped ? 'hidden' : ''
              }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-sm font-medium opacity-90 mb-6 tracking-wide">Click to reveal answer</p>
            <h2 className="text-6xl font-bold mb-3 tracking-tight">{card.word}</h2>
            <p className="text-2xl italic font-serif opacity-90 mb-8">{card.partOfSpeech}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              disabled={isPlayingAudio}
              className="flex items-center gap-3 px-8 py-3 bg-white/30 hover:bg-white/40 backdrop-blur-md rounded-2xl font-bold transition-all border border-white/20 shadow-lg active:scale-95"
            >
              <span className="text-xl">🔊</span>
              <span className="text-lg">Pronounce</span>
            </button>
          </div>

          {/* Back */}
          <div
            className={`absolute w-full h-full bg-gradient-to-br from-[#10B981] via-[#059669] to-[#0D9488] rounded-[32px] shadow-2xl p-10 overflow-y-auto text-white border border-white/10 ${isFlipped ? '' : 'hidden'
              }`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full h-full flex flex-col justify-start">
              <div className="mb-8">
                <h3 className="text-sm font-bold opacity-80 mb-2">Definition</h3>
                <p className="text-xl font-medium leading-relaxed">{card.definition}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold opacity-80 mb-2">Example</h3>
                <p className="text-lg italic opacity-95 leading-relaxed font-serif">
                  {card.exampleSentence}
                </p>
              </div>

              {card.translation && (
                <div className="mt-auto pt-4">
                  <h3 className="text-sm font-bold opacity-80 mb-2">Translation</h3>
                  <p className="text-2xl font-bold">{card.translation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-8 justify-center mt-4">
        <button
          onClick={() => onMark(1)}
          className="group flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 bg-white text-red-500 rounded-3xl flex items-center justify-center text-2xl font-bold border-2 border-red-50 group-hover:bg-red-500 group-hover:text-white transition-all shadow-md group-hover:shadow-red-200">❌</div>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Forgot</span>
        </button>
        <button
          onClick={() => onMark(3)}
          className="group flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 bg-white text-yellow-600 rounded-3xl flex items-center justify-center text-2xl font-bold border-2 border-yellow-50 group-hover:bg-yellow-500 group-hover:text-white transition-all shadow-md group-hover:shadow-yellow-200">🤔</div>
          <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Difficult</span>
        </button>
        <button
          onClick={() => onMark(5)}
          className="group flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 bg-white text-green-600 rounded-3xl flex items-center justify-center text-2xl font-bold border-2 border-green-50 group-hover:bg-green-500 group-hover:text-white transition-all shadow-md group-hover:shadow-green-200">✅</div>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Perfect</span>
        </button>
      </div>
    </div>
  );
}
