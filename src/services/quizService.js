import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Save a completed quiz to Firestore
 * @param {Object} quizData - Quiz data to save
 * @returns {Promise<string>} Quiz document ID
 */
export const saveQuiz = async (quizData) => {
  try {
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      completedAt: serverTimestamp()
    });

    // Update user statistics - use setDoc with merge to create if doesn't exist
    const userRef = doc(db, 'users', quizData.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User document exists, update it
      await updateDoc(userRef, {
        totalQuizzes: increment(1),
        totalScore: increment(quizData.score)
      });
    } else {
      // User document doesn't exist, create it
      await setDoc(userRef, {
        userId: quizData.userId,
        totalQuizzes: 1,
        totalScore: quizData.score,
        createdAt: serverTimestamp()
      });
    }

    return quizRef.id;
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw new Error('Failed to save quiz. Please try again.');
  }
};

/**
 * Get user's quiz history
 * @param {string} userId - User ID
 * @param {number} limitCount - Maximum number of quizzes to fetch
 * @returns {Promise<Array>} Array of quiz objects
 */
export const getUserQuizzes = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const quizzes = [];
    
    querySnapshot.forEach((doc) => {
      quizzes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return quizzes;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw new Error('Failed to load quiz history.');
  }
};

/**
 * Get a specific quiz by ID
 * @param {string} quizId - Quiz document ID
 * @returns {Promise<Object>} Quiz object
 */
export const getQuizById = async (quizId) => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizSnap = await getDoc(quizRef);

    if (quizSnap.exists()) {
      return {
        id: quizSnap.id,
        ...quizSnap.data()
      };
    } else {
      throw new Error('Quiz not found');
    }
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw new Error('Failed to load quiz details.');
  }
};

/**
 * Create or update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        totalQuizzes: 0,
        totalScore: 0
      });
    }
  } catch (error) {
    // If document doesn't exist, create it
    try {
      await addDoc(collection(db, 'users'), {
        userId,
        ...userData,
        createdAt: serverTimestamp(),
        totalQuizzes: 0,
        totalScore: 0
      });
    } catch (createError) {
      console.error('Error creating user profile:', createError);
    }
  }
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
export const getUserStats = async (userId) => {
  try {
    const quizzes = await getUserQuizzes(userId, 100); // Get more for accurate stats
    
    if (quizzes.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0
      };
    }

    const totalScore = quizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions * 100), 0);
    const scores = quizzes.map(quiz => (quiz.score / quiz.totalQuestions * 100));
    
    return {
      totalQuizzes: quizzes.length,
      averageScore: Math.round(totalScore / quizzes.length),
      bestScore: Math.round(Math.max(...scores))
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0
    };
  }
};
