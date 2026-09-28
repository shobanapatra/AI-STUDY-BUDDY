const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateWithFallback = async (contents) => {
  const models = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite'
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents
      });

      console.log(`Success with Gemini model: ${model}`);
      console.log('GEMINI RESPONSE TEXT:', response.text);

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error.message
      );

      // Try the next model for temporary errors
      // and quota/rate-limit errors.
      if (
        error.status !== 503 &&
        error.status !== 429
      ) {
        throw error;
      }

      console.log(
        `Trying fallback model after ${model} failure...`
      );
    }
  }

  throw lastError;
};

const generateSummary = async (text) => {
  return generateWithFallback(
    `Summarize the following study material clearly and concisely:

${text}`
  );
};

const generateFlashcards = async (text) => {
  return generateWithFallback(
    `Create key study flashcards (Question and Answer pairs) based on this content:

${text}`
  );
};

const generateQuiz = async (text) => {
  return generateWithFallback(
    `Create a multiple-choice quiz with answers based on the following text:

${text}`
  );
};

const generateStudyPlan = async (text) => {
  return generateWithFallback(
    `Create a structured step-by-step study schedule/plan for this topic:

${text}`
  );
};

module.exports = {
  generateSummary,
  generateFlashcards,
  generateQuiz,
  generateStudyPlan
};