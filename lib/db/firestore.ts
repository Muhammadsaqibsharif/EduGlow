'use server';

import { adminDb } from '@/lib/firebase/admin';
import { QuizAttempt, UserProgress, QuestionHistory, LearningPath } from '@/types';

export async function saveQuizAttempt(attempt: Omit<QuizAttempt, 'id'>) {
  try {
    const docRef = await adminDb.collection('quizAttempts').add({
      ...attempt,
      completedAt: new Date(),
    });

    // Update user progress
    await updateUserProgress(
      attempt.userId,
      attempt.subject,
      attempt.topic,
      attempt.score,
      attempt.totalQuestions,
      attempt.timeSpent
    );

    // Save individual question history
    for (let i = 0; i < attempt.questions.length; i++) {
      const question = attempt.questions[i];
      const userAnswer = attempt.answers[i];
      const isCorrect = userAnswer === question.correctAnswer;

      await saveQuestionHistory({
        userId: attempt.userId,
        questionId: question.id,
        question,
        userAnswer,
        isCorrect,
        timeSpent: attempt.timeSpent / attempt.totalQuestions,
        attemptedAt: new Date(),
      });
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return { success: false, error: 'Failed to save quiz attempt' };
  }
}

export async function updateUserProgress(
  userId: string,
  subject: string,
  topic: string,
  score: number,
  totalQuestions: number,
  timeSpent: number
) {
  try {
    const progressRef = adminDb.collection('userProgress').doc(`${userId}_${subject}_${topic}`);
    const progressDoc = await progressRef.get();

    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - score;

    if (progressDoc.exists) {
      const currentData = progressDoc.data() as UserProgress;
      const newTotalAttempts = currentData.totalAttempts + 1;
      const newCorrectAnswers = currentData.correctAnswers + correctAnswers;
      const newIncorrectAnswers = currentData.incorrectAnswers + incorrectAnswers;
      const newAverageScore =
        ((currentData.averageScore * currentData.totalAttempts + (score / totalQuestions) * 100) /
          newTotalAttempts);
      const newAverageTime =
        ((currentData.averageTimePerQuestion * currentData.totalAttempts +
          timeSpent / totalQuestions) /
          newTotalAttempts);

      // Determine difficulty based on performance
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
      if (newAverageScore >= 80) {
        difficulty = 'hard';
      } else if (newAverageScore < 60) {
        difficulty = 'easy';
      }

      await progressRef.update({
        totalAttempts: newTotalAttempts,
        correctAnswers: newCorrectAnswers,
        incorrectAnswers: newIncorrectAnswers,
        averageScore: newAverageScore,
        averageTimePerQuestion: newAverageTime,
        lastAttemptDate: new Date(),
        difficulty,
      });
    } else {
      const averageScore = (score / totalQuestions) * 100;
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (averageScore >= 80) {
        difficulty = 'medium';
      }

      await progressRef.set({
        userId,
        subject,
        topic,
        totalAttempts: 1,
        correctAnswers,
        incorrectAnswers,
        averageScore,
        averageTimePerQuestion: timeSpent / totalQuestions,
        weakAreas: [],
        lastAttemptDate: new Date(),
        difficulty,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function saveQuestionHistory(
  history: Omit<QuestionHistory, 'id'>
) {
  try {
    await adminDb.collection('questionHistory').add(history);
    return { success: true };
  } catch (error) {
    console.error('Error saving question history:', error);
    return { success: false, error: 'Failed to save question history' };
  }
}

export async function getUserProgress(userId: string) {
  try {
    const snapshot = await adminDb
      .collection('userProgress')
      .where('userId', '==', userId)
      .get();

    const progress: UserProgress[] = [];
    snapshot.forEach((doc) => {
      progress.push({ ...doc.data() } as UserProgress);
    });

    return { success: true, progress };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { success: false, error: 'Failed to get progress', progress: [] };
  }
}

export async function getQuizHistory(userId: string, limit: number = 10) {
  try {
    const snapshot = await adminDb
      .collection('quizAttempts')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .limit(limit)
      .get();

    const history: QuizAttempt[] = [];
    snapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as QuizAttempt);
    });

    return { success: true, history };
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return { success: false, error: 'Failed to get history', history: [] };
  }
}

export async function getQuestionHistory(userId: string, limit: number = 20) {
  try {
    const snapshot = await adminDb
      .collection('questionHistory')
      .where('userId', '==', userId)
      .orderBy('attemptedAt', 'desc')
      .limit(limit)
      .get();

    const history: QuestionHistory[] = [];
    snapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as QuestionHistory);
    });

    return { success: true, history };
  } catch (error) {
    console.error('Error getting question history:', error);
    return { success: false, error: 'Failed to get question history', history: [] };
  }
}

export async function saveLearningPath(learningPath: LearningPath) {
  try {
    const pathRef = adminDb.collection('learningPaths').doc(`${learningPath.userId}_${learningPath.subject}`);
    await pathRef.set({
      ...learningPath,
      lastUpdated: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving learning path:', error);
    return { success: false, error: 'Failed to save learning path' };
  }
}

export async function getLearningPath(userId: string, subject: string) {
  try {
    const pathDoc = await adminDb
      .collection('learningPaths')
      .doc(`${userId}_${subject}`)
      .get();

    if (pathDoc.exists) {
      return {
        success: true,
        learningPath: pathDoc.data() as LearningPath,
      };
    }

    return { success: false, error: 'Learning path not found', learningPath: null };
  } catch (error) {
    console.error('Error getting learning path:', error);
    return { success: false, error: 'Failed to get learning path', learningPath: null };
  }
}
