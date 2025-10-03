'use server';

import { geminiModel } from '@/lib/genkit/config';
import { z } from 'zod';

const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.object({
    english: z.string(),
    urdu: z.string(),
  }),
  hint: z.object({
    english: z.string(),
    urdu: z.string(),
  }),
});

const QuestionResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export async function generateQuestions(
  subject: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 5
) {
  try {
    const prompt = `Generate ${count} multiple-choice questions for the following:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
1. Each question should have exactly 4 options
2. Provide the index (0-3) of the correct answer
3. Provide detailed explanations in both English and Urdu
4. Provide helpful hints in both English and Urdu
5. Make questions appropriate for ${difficulty} difficulty level
6. Ensure questions are educational and test understanding, not just memorization

Return the response in this exact JSON format:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": {
        "english": "Detailed explanation in English",
        "urdu": "تفصیلی وضاحت اردو میں"
      },
      "hint": {
        "english": "Helpful hint in English",
        "urdu": "مددگار اشارہ اردو میں"
      }
    }
  ]
}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean up the response text to ensure it's valid JSON
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const parsedResponse = JSON.parse(jsonText);
    const validatedResponse = QuestionResponseSchema.parse(parsedResponse);

    return {
      success: true,
      questions: validatedResponse.questions.map((q, index) => ({
        id: `${Date.now()}_${index}`,
        subject,
        topic,
        difficulty,
        ...q,
      })),
    };
  } catch (error) {
    console.error('Error generating questions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate questions',
      questions: [],
    };
  }
}

export async function getPersonalizedFeedback(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  try {
    const prompt = `A student answered a question incorrectly. Provide personalized feedback:

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}
Difficulty: ${difficulty}

Provide:
1. A hint to guide the student (in English and Urdu)
2. A step-by-step explanation of why the correct answer is right (in English and Urdu)
3. Common misconceptions about this topic (in English and Urdu)

Return the response in this exact JSON format:
{
  "hint": {
    "english": "Helpful hint in English",
    "urdu": "مددگار اشارہ اردو میں"
  },
  "explanation": {
    "english": "Step-by-step explanation in English",
    "urdu": "قدم بہ قدم وضاحت اردو میں"
  },
  "misconceptions": {
    "english": "Common misconceptions in English",
    "urdu": "عام غلط فہمیاں اردو میں"
  }
}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean up the response text
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const parsedResponse = JSON.parse(jsonText);

    return {
      success: true,
      feedback: parsedResponse,
    };
  } catch (error) {
    console.error('Error getting personalized feedback:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get feedback',
    };
  }
}

export async function analyzeLearningPath(
  userId: string,
  progressData: any[]
) {
  try {
    const prompt = `Analyze this student's learning progress and provide personalized recommendations:

Progress Data: ${JSON.stringify(progressData, null, 2)}

Based on the data:
1. Identify weak areas that need more practice
2. Recommend topics to study next
3. Suggest appropriate difficulty level
4. Provide actionable next steps

Return the response in this exact JSON format:
{
  "weakAreas": ["topic1", "topic2"],
  "recommendedTopics": ["next topic1", "next topic2"],
  "recommendedDifficulty": "easy|medium|hard",
  "nextSteps": ["step1", "step2", "step3"]
}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean up the response text
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const parsedResponse = JSON.parse(jsonText);

    return {
      success: true,
      learningPath: parsedResponse,
    };
  } catch (error) {
    console.error('Error analyzing learning path:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze learning path',
    };
  }
}
