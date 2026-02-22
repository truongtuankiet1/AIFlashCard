// Simple test script to check Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in .env.local');
        return;
    }

    console.log('API Key found:', apiKey.substring(0, 10) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate 3 french vocabulary words related to "play".

For each word, provide:
1. Word
2. Part of speech
3. Definition in french
4. Example sentence in french
5. Phonetic pronunciation (IPA format)
6. Vietnamese translation

Return as valid JSON array:
[
  {
    "word": "example",
    "part_of_speech": "noun",
    "definition": "...",
    "example_sentence": "...",
    "phonetic": "...",
    "translation": "Vietnamese translation here"
  }
]

Ensure valid JSON only, no additional text.`;

    try {
        console.log('\n🚀 Sending request to Gemini...\n');
        const result = await model.generateContent(prompt);
        const content = result.response.text();

        console.log('✅ Raw Response:');
        console.log('─'.repeat(50));
        console.log(content);
        console.log('─'.repeat(50));

        // Try to parse
        const cleanedContent = content
            .replace(/```(?:json|JSON)?\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        console.log('\n🧹 Cleaned Content:');
        console.log('─'.repeat(50));
        console.log(cleanedContent);
        console.log('─'.repeat(50));

        const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('\n❌ No JSON array found!');
            return;
        }

        console.log('\n📦 Extracted JSON:');
        console.log('─'.repeat(50));
        console.log(jsonMatch[0]);
        console.log('─'.repeat(50));

        const cards = JSON.parse(jsonMatch[0]);
        console.log('\n✅ Successfully parsed', cards.length, 'cards!');
        console.log(JSON.stringify(cards, null, 2));

    } catch (error) {
        console.error('\n❌ Error:', error);
    }
}

testGemini();
