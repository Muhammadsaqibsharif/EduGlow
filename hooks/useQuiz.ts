'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizState, QuizSettings, QuizResult, Question } from '@/types';
import { generateQuestions } from '@/lib/ai/gemini';
import { saveQuizAttempt } from '@/lib/db/firestore';
import { auth } from '@/lib/firebase/config';

export function useQuiz(settings: QuizSettings) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    isComplete: false,
    timeRemaining: (settings.timeLimit || 15) * 60, // Convert to seconds
    startTime: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize quiz
  const initializeQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateQuestions(
        settings.subject,
        settings.topic,
        settings.difficulty,
        settings.questionCount
      );

      if (result.success && result.questions.length > 0) {
        setState(prev => ({
          ...prev,
          questions: result.questions,
          selectedAnswers: new Array(result.questions.length).fill(null),
          startTime: Date.now(),
        }));
      } else {
        throw new Error(result.error || 'Failed to generate questions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Timer effect
  useEffect(() => {
    if (!loading && state.questions.length > 0 && !state.isComplete && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
          if (newTimeRemaining <= 0) {
            return { ...prev, timeRemaining: 0, isComplete: true };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, state.questions.length, state.isComplete, state.timeRemaining]);

  // Select answer
  const selectAnswer = useCallback((answerIndex: number) => {
    if (state.isComplete) return;

    setState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  }, [state.isComplete]);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  }, [state.currentQuestionIndex, state.questions.length]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  }, [state.currentQuestionIndex]);

  // Go to specific question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < state.questions.length) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  }, [state.questions.length]);

  // Submit quiz
  const submitQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, isComplete: true }));

    // Calculate results
    const questionsWithAnswers = state.questions.map((question, index) => ({
      question,
      userAnswer: state.selectedAnswers[index],
      isCorrect: state.selectedAnswers[index] === question.correctAnswer,
    }));

    const score = questionsWithAnswers.filter(qa => qa.isCorrect).length;
    const timeSpent = Math.floor((Date.now() - state.startTime) / 1000);

    const result: QuizResult = {
      score,
      totalQuestions: state.questions.length,
      percentage: Math.round((score / state.questions.length) * 100),
      timeSpent,
      questionsWithAnswers,
    };

    // Save to database if user is authenticated
    if (auth.currentUser) {
      try {
        await saveQuizAttempt({
          userId: auth.currentUser.uid,
          quizId: `quiz_${Date.now()}`,
          questions: state.questions,
          answers: state.selectedAnswers.map(ans => ans ?? -1),
          score,
          totalQuestions: state.questions.length,
          timeSpent,
          subject: settings.subject,
          topic: settings.topic,
          completedAt: new Date(),
        });
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
      }
    }

    return result;
  }, [state, settings]);

  // Get current question
  const currentQuestion = state.questions[state.currentQuestionIndex] || null;

  // Get progress info
  const progress = {
    current: state.currentQuestionIndex + 1,
    total: state.questions.length,
    percentage: state.questions.length > 0 ? 
      Math.round(((state.currentQuestionIndex + 1) / state.questions.length) * 100) : 0,
    answeredCount: state.selectedAnswers.filter(answer => answer !== null).length,
  };

  // Check if can proceed to next
  const canProceed = state.selectedAnswers[state.currentQuestionIndex] !== null;

  // Check if is last question
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;

  return {
    state,
    loading,
    error,
    currentQuestion,
    progress,
    canProceed,
    isLastQuestion,
    initializeQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
  };
}