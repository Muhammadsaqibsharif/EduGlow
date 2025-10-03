import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, topic, difficulty, count = 5 } = body;

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Subject and topic are required' },
        { status: 400 }
      );
    }

    const result = await generateQuestions(subject, topic, difficulty, count);

    if (result.success) {
      return NextResponse.json({
        success: true,
        questions: result.questions,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to generate questions' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Quiz API is working',
    version: '2.0',
    endpoints: {
      POST: 'Generate quiz questions',
    },
  });
}