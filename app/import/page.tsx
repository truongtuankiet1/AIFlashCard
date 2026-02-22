'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setCSVFile(files[0]);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!csvFile) {
      setError('Please select a CSV file');
      setLoading(false);
      return;
    }

    try {
      const csvContent = await csvFile.text();

      const response = await fetch('/api/decks/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic,
          csvContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/study/${data.deck.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to import deck');
      }
    } catch (err) {
      setError('Error reading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-gray-900">VocabCards</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-700 font-semibold hover:text-purple-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📥 Import Deck</h2>
          <p className="text-gray-600 mb-8">
            Import vocabulary from a CSV file. The CSV should have the following columns:
            <br />
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              word, part_of_speech, definition, example_sentence, [phonetic], [vietnamese]
            </code>
          </p>

          <form onSubmit={handleImport} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Deck Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., My Business Vocabulary"
                required
              />
            </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Business English"
                required
              />
            </div>

            {/* CSV File */}
            <div>
              <label htmlFor="csv" className="block text-sm font-semibold text-gray-700 mb-2">
                CSV File
              </label>
              <input
                id="csv"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {csvFile ? `Selected: ${csvFile.name}` : 'Choose a CSV file'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !title || !topic || !csvFile}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Importing...' : 'Import Deck 📥'}
            </button>
          </form>

          {/* Example CSV */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example CSV Format</h3>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm text-gray-700">
{`word,part_of_speech,definition,example_sentence,phonetic,vietnamese
apple,noun,a round fruit that grows on trees,"She ate an apple for breakfast",/ˈæpəl/,quả táo
beautiful,adjective,pretty and attractive,"She is a beautiful woman",/ˈbjuːtɪfl/,đẹp
run,verb,to move quickly on foot,"The children run in the park",/rʌn/,chạy`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
