const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyB66kQo_nl-ePCdtUT39ryLwoXpLxsrAdA";

async function testModel() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = 'gemini-2.5-flash';
    console.log(`Testing model: ${modelName} with FULL PROMPT`);

    const model = genAI.getGenerativeModel({ model: modelName });

    const topic = "Environment";
    const count = 5;
    const difficulty = "standard";
    const language = "english";

    const difficultyGuides = {
        basic: 'Common, everyday words suitable for beginners',
        standard: 'Intermediate vocabulary with moderate difficulty',
        advanced: 'Advanced academic and professional vocabulary',
    };

    const prompt = `Generate ${count} English vocabulary words related to the topic: "${topic}"
  
Difficulty level: ${difficultyGuides[difficulty]}
Definition language: ${language}

For each word, provide:
1. Word
2. Part of speech (noun, verb, adjective, etc.)
3. Definition in ${language}
4. Example sentence in English
5. Phonetic pronunciation (IPA format)
6. Vietnamese translation

Return the response as a valid JSON array with this structure:
[
  {
    "word": "example",
    "part_of_speech": "noun",
    "definition": "...",
    "example_sentence": "...",
    "phonetic": "...",
    "vietnamese": "..."
  }
]

Ensure the response is valid JSON only, with no additional text.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("--- RAW RESPONSE START ---");
        console.log(text);
        console.log("--- RAW RESPONSE END ---");

        // Test the parsing logic from the original file (Simulating the bug)
        console.log("\nTesting Original Regex Parsing:");
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error("Original regex FAILED to find JSON array");
        } else {
            console.log("Original regex successfully found JSON candidate.");
            try {
                JSON.parse(jsonMatch[0]);
                console.log("Original parsing SUCCESS.");
            } catch (e) {
                console.error("Original parsing FAILED:", e.message);
            }
        }

    } catch (error) {
        console.error("Error occurred:", error.message);
    }
}

testModel();
