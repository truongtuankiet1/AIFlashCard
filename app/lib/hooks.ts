import { useCallback, useState } from 'react';

interface FetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export function useApi<T>(
  url: string,
  options?: FetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, loading, error, fetch: fetch_ };
}

export function useDeck(deckId: string) {
  return useApi(`/api/decks/${deckId}`);
}

export function useDecks() {
  return useApi('/api/decks');
}

export function useReviewCards(deckId: string) {
  return useApi(`/api/review/${deckId}`);
}
