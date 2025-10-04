import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generate quiz questions using Google Gemini API
 * @param {Object} config - Quiz configuration
 * @param {string} config.subject - Subject of the quiz
 * @param {string} config.topic - Specific topic
 * @param {number} config.numberOfQuestions - Number of questions to generate
 * @param {string} config.difficulty - Difficulty level (Easy, Medium, Hard)
 * @returns {Promise<Array>} Array of question objects
 */
export const generateQuizQuestions = async ({ subject, topic, numberOfQuestions, difficulty }) => {
  try {
    // Using gemini-2.5-flash - latest fast model available
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate ${numberOfQuestions} multiple choice questions about ${topic} in ${subject} at ${difficulty} difficulty level.

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for the correct answer
- Questions should be clear and unambiguous
- Format as JSON array

JSON Format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Return ONLY the JSON array, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle cases where model adds markdown formatting)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse JSON
    const questions = JSON.parse(jsonText);

    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array');
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || !q.explanation) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Retry once if parsing failed
    if (error.message.includes('JSON') || error.message.includes('format')) {
      try {
        console.log('Retrying question generation...');
        return await generateQuizQuestions({ subject, topic, numberOfQuestions, difficulty });
      } catch (retryError) {
        throw new Error('Failed to generate valid questions after retry. Please try again.');
      }
    }
    
    throw new Error('Failed to generate questions. Please check your API key and try again.');
  }
};
