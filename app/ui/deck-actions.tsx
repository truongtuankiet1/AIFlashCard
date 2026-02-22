'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ExportButton({ deckId }: { deckId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deck-${deckId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
    >
      📥 Export CSV
    </button>
  );
}

export function ImportButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/import')}
      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
    >
      📤 Import Deck
    </button>
  );
}

export function DeleteButton({ deckId, onDelete }: { deckId: string; onDelete?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
      setConfirmed(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        confirmed
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      } disabled:opacity-50`}
    >
      {confirmed ? '⚠️ Confirm delete' : '🗑️ Delete'}
    </button>
  );
}
