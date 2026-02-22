
const { generateFlashcards } = require('./app/lib/llm');
require('dotenv').config({ path: '.env.local' });

async function testGeneration() {
    console.log('Testing flashcard generation...');
    try {
        const cards = await generateFlashcards(
            'Travel',
            5,
            'standard',
            'french'
        );
        console.log('Successfully generated cards:', cards);
    } catch (error) {
        console.error('Generation failed:', error);
    }
}

testGeneration();
