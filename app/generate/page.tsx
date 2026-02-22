'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(20);
  const [difficulty, setDifficulty] = useState('standard');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          count,
          difficulty,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/study/${data.deck.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to generate flashcards');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-cyan/10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-gray-900">VocabCards</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-700 font-semibold hover:text-primary-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">✨ Generate Flashcards</h2>
          <p className="text-gray-600 mb-8">
            Enter a topic and let AI generate vocabulary cards for you
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Business English, Medical Terms, Travel"
                required
              />
            </div>

            {/* Count */}
            <div>
              <label htmlFor="count" className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Cards
              </label>
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={10}>10 cards</option>
                <option value={20}>20 cards</option>
                <option value={30}>30 cards</option>
                <option value={50}>50 cards</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="basic">Basic (Beginner)</option>
                <option value="standard">Standard (Intermediate)</option>
                <option value="advanced">Advanced (Professional)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                Definition Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="english">English</option>
                <option value="russian">Russian</option>
                <option value="french">French</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Generating flashcards...' : 'Generate Flashcards ✨'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
