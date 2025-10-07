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

/**
 * Generate a single quiz question with specific difficulty for dynamic quiz
 * @param {Object} config - Question configuration
 * @param {string} config.subject - Subject of the quiz
 * @param {string} config.topic - Specific topic
 * @param {string} config.difficulty - Difficulty level (Easy, Medium, Hard)
 * @param {Array} config.previousQuestions - Array of previously asked questions to avoid duplicates
 * @returns {Promise<Object>} Question object
 */
export const generateSingleQuestion = async ({ subject, topic, difficulty, previousQuestions = [] }) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context about previous questions to avoid duplicates
    const previousContext = previousQuestions.length > 0
      ? `\n\nPreviously asked questions (DO NOT repeat these):\n${previousQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}`
      : '';

    const prompt = `Generate 1 multiple choice question about ${topic} in ${subject} at ${difficulty} difficulty level.

Requirements:
- The question must have exactly 4 options (A, B, C, D)
- Only one correct answer
- Include a brief explanation for the correct answer
- Question should be clear and unambiguous
- Make it DIFFERENT from any previously asked questions${previousContext}

Difficulty Guidelines:
- Easy: Basic concepts, straightforward questions
- Medium: Requires understanding and application of concepts
- Hard: Complex scenarios, critical thinking, advanced concepts

JSON Format:
{
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Brief explanation why this is correct",
  "difficulty": "${difficulty}"
}

Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse JSON
    const question = JSON.parse(jsonText);

    // Validate the structure
    if (!question.question || !Array.isArray(question.options) || question.options.length !== 4 || 
        typeof question.correctAnswer !== 'number' || !question.explanation) {
      throw new Error('Invalid question format');
    }

    return question;
  } catch (error) {
    console.error('Error generating single question:', error);
    
    // Retry once if parsing failed
    if (error.message.includes('JSON') || error.message.includes('format')) {
      try {
        console.log('Retrying question generation...');
        return await generateSingleQuestion({ subject, topic, difficulty, previousQuestions });
      } catch (retryError) {
        throw new Error('Failed to generate valid question after retry. Please try again.');
      }
    }
    
    throw new Error('Failed to generate question. Please try again.');
  }
};

/**
 * Generate a hint for a quiz question using Gemini
 * @param {Object} params - Hint generation parameters
 * @param {string} params.question - The question text
 * @param {Array<string>} params.options - The answer options
 * @param {number} params.correctAnswer - Index of the correct answer
 * @param {number} params.hintNumber - Which hint this is (1-3)
 * @param {Array<string>} params.previousHints - Previously generated hints
 * @returns {Promise<string>} Hint text
 */
export const generateHint = async ({ question, options, correctAnswer, hintNumber, previousHints = [] }) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const previousHintsContext = previousHints.length > 0
      ? `\n\nPreviously given hints (provide a NEW hint):\n${previousHints.map((h, i) => `Hint ${i + 1}: ${h}`).join('\n')}`
      : '';

    const hintLevel = hintNumber === 1 ? 'subtle' : hintNumber === 2 ? 'moderate' : 'strong';

    const prompt = `Provide a ${hintLevel} hint for this multiple choice question without revealing the answer directly.

Question: ${question}

Options:
${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}

The correct answer is: ${options[correctAnswer]}

Guidelines for hint level:
- Hint 1 (subtle): Give a general direction or concept to consider
- Hint 2 (moderate): Eliminate one wrong option or provide more specific context
- Hint 3 (strong): Narrow it down significantly, but still don't give the exact answer${previousHintsContext}

IMPORTANT: 
- DO NOT directly state which option is correct
- DO NOT say "the answer is..." or "option X is correct"
- Guide the user's thinking process
- Keep it concise (1-2 sentences)
- Make it progressively more helpful based on hint number

Return ONLY the hint text, no additional formatting or labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hint = response.text().trim();

    // Remove any quote marks that might wrap the hint
    return hint.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error generating hint:', error);
    throw new Error('Failed to generate hint. Please try again.');
  }
};

