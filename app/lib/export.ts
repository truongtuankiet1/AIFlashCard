/**
 * Utility functions for CSV import/export
 */

export interface CSVCard {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  phonetic?: string;
  translation?: string;
}

export function cardsToCSV(cards: CSVCard[]): string {
  const headers = [
    'word',
    'part_of_speech',
    'definition',
    'example_sentence',
    'phonetic',
    'translation',
  ];

  const rows = cards.map((card) =>
    [
      escapeCSV(card.word),
      escapeCSV(card.partOfSpeech),
      escapeCSV(card.definition),
      escapeCSV(card.exampleSentence),
      escapeCSV(card.phonetic || ''),
      escapeCSV(card.translation || ''),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function csvToCards(csvContent: string): CSVCard[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid CSV format');
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  const cards: CSVCard[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 4) {
      cards.push({
        word: values[0],
        partOfSpeech: values[1],
        definition: values[2],
        exampleSentence: values[3],
        phonetic: values[4],
        translation: values[5],
      });
    }
  }

  return cards;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Export to Anki format (apkg)
 * This is a simplified version - full implementation would need additional packages
 */
export function cardsToAnkiJSON(
  cards: CSVCard[],
  deckName: string
): string {
  const ankiCards = cards.map((card, index) => ({
    id: Date.now() + index,
    nid: Date.now() + index,
    did: 1,
    ord: index,
    mod: Math.floor(Date.now() / 1000),
    usn: -1,
    type: 0,
    queue: 0,
    due: 0,
    ivl: 0,
    factor: 0,
    reps: 0,
    lapses: 0,
    left: 0,
    odue: 0,
    odid: 0,
    flags: 0,
    data: '',
    flds: [
      card.word,
      card.partOfSpeech,
      card.definition,
      card.exampleSentence,
      card.phonetic || '',
      card.translation || '',
    ].join('\x1f'),
  }));

  return JSON.stringify({
    ver: 11,
    cards: ankiCards,
    decks: [
      {
        id: 1,
        mod: Math.floor(Date.now() / 1000),
        name: deckName,
        usn: -1,
        lrnToday: [0, 0],
        revToday: [0, 0],
        newToday: [0, 0],
        timeToday: [0, 0],
        collapsed: false,
        browserCollapsed: true,
        lastUniqueName: deckName,
        desc: '',
        dyn: false,
        conf: 1,
        extendNew: 10,
        extendRev: 50,
      },
    ],
  });
}
