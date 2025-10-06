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
 * Save a completed dynamic quiz to Firestore
 * @param {Object} quizData - Dynamic quiz data to save
 * @returns {Promise<string>} Quiz document ID
 */
export const saveDynamicQuiz = async (quizData) => {
  try {
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      quizType: 'dynamic',
      completedAt: serverTimestamp()
    });

    // Update user statistics
    const userRef = doc(db, 'users', quizData.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        totalQuizzes: increment(1),
        totalScore: increment(quizData.correctAnswers)
      });
    } else {
      await setDoc(userRef, {
        userId: quizData.userId,
        totalQuizzes: 1,
        totalScore: quizData.correctAnswers,
        createdAt: serverTimestamp()
      });
    }

    return quizRef.id;
  } catch (error) {
    console.error('Error saving dynamic quiz:', error);
    throw new Error('Failed to save quiz. Please try again.');
  }
};

/**
 * Get user statistics separated by quiz type
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics with separate standard and dynamic stats
 */
export const getUserStats = async (userId) => {
  try {
    const quizzes = await getUserQuizzes(userId, 100); // Get more for accurate stats
    
    if (quizzes.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        standardQuizzes: {
          total: 0,
          averageScore: 0,
          bestScore: 0
        },
        dynamicQuizzes: {
          total: 0,
          averageScore: 0,
          bestScore: 0,
          totalWins: 0
        }
      };
    }

    // Separate standard and dynamic quizzes
    const standardQuizzes = quizzes.filter(q => q.quizType !== 'dynamic');
    const dynamicQuizzes = quizzes.filter(q => q.quizType === 'dynamic');

    // Calculate standard quiz stats
    let standardStats = {
      total: 0,
      averageScore: 0,
      bestScore: 0
    };

    if (standardQuizzes.length > 0) {
      const standardScores = standardQuizzes.map(quiz => {
        const score = quiz.score || 0;
        const total = quiz.totalQuestions || 1;
        return (score / total) * 100;
      });
      
      const standardTotalScore = standardScores.reduce((sum, score) => sum + score, 0);
      
      standardStats = {
        total: standardQuizzes.length,
        averageScore: Math.round(standardTotalScore / standardQuizzes.length),
        bestScore: Math.round(Math.max(...standardScores))
      };
    }

    // Calculate dynamic quiz stats
    let dynamicStats = {
      total: 0,
      averageScore: 0,
      bestScore: 0,
      totalWins: 0
    };

    if (dynamicQuizzes.length > 0) {
      const dynamicScores = dynamicQuizzes.map(quiz => {
        const correct = quiz.correctAnswers || 0;
        const total = quiz.totalQuestions || 1;
        return (correct / total) * 100;
      });
      
      const dynamicTotalScore = dynamicScores.reduce((sum, score) => sum + score, 0);
      const totalWins = dynamicQuizzes.filter(q => q.completed === true).length;
      
      dynamicStats = {
        total: dynamicQuizzes.length,
        averageScore: Math.round(dynamicTotalScore / dynamicQuizzes.length),
        bestScore: Math.round(Math.max(...dynamicScores)),
        totalWins: totalWins
      };
    }

    // Calculate overall stats
    const allScores = [
      ...standardQuizzes.map(quiz => ((quiz.score || 0) / (quiz.totalQuestions || 1)) * 100),
      ...dynamicQuizzes.map(quiz => ((quiz.correctAnswers || 0) / (quiz.totalQuestions || 1)) * 100)
    ];
    
    const overallTotalScore = allScores.reduce((sum, score) => sum + score, 0);
    
    return {
      totalQuizzes: quizzes.length,
      averageScore: allScores.length > 0 ? Math.round(overallTotalScore / allScores.length) : 0,
      bestScore: allScores.length > 0 ? Math.round(Math.max(...allScores)) : 0,
      standardQuizzes: standardStats,
      dynamicQuizzes: dynamicStats
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      standardQuizzes: {
        total: 0,
        averageScore: 0,
        bestScore: 0
      },
      dynamicQuizzes: {
        total: 0,
        averageScore: 0,
        bestScore: 0,
        totalWins: 0
      }
    };
  }
};

/**
 * Save a completed endless quiz to Firestore
 * @param {Object} quizData - Endless quiz data to save
 * @returns {Promise<string>} Quiz document ID
 */
export const saveEndlessQuiz = async (quizData) => {
  try {
    const quizRef = await addDoc(collection(db, 'endlessQuizzes'), {
      ...quizData,
      quizType: 'endless',
      completedAt: serverTimestamp()
    });

    return quizRef.id;
  } catch (error) {
    console.error('Error saving endless quiz:', error);
    throw new Error('Failed to save quiz. Please try again.');
  }
};

/**
 * Get endless quiz leaderboard
 * @param {string} subject - Subject filter (null for all)
 * @param {string} topic - Topic filter (null for all)
 * @param {number} limitCount - Maximum number of entries to fetch
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const getEndlessLeaderboard = async (subject = null, topic = null, limitCount = 50) => {
  try {
    let q;
    
    if (subject && topic) {
      // Filter by both subject and topic
      q = query(
        collection(db, 'endlessQuizzes'),
        where('subject', '==', subject),
        where('topic', '==', topic),
        orderBy('correctAnswers', 'desc'),
        orderBy('timeTaken', 'asc'),
        limit(limitCount)
      );
    } else if (subject) {
      // Filter by subject only
      q = query(
        collection(db, 'endlessQuizzes'),
        where('subject', '==', subject),
        orderBy('correctAnswers', 'desc'),
        orderBy('timeTaken', 'asc'),
        limit(limitCount)
      );
    } else {
      // No filter - all entries
      q = query(
        collection(db, 'endlessQuizzes'),
        orderBy('correctAnswers', 'desc'),
        orderBy('timeTaken', 'asc'),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      leaderboard.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching endless leaderboard:', error);
    throw new Error('Failed to load leaderboard.');
  }
};

/**
 * Get all unique topics from endless quizzes
 * @returns {Promise<Array>} Array of unique topics with their subjects
 */
export const getAllEndlessTopics = async () => {
  try {
    const q = query(collection(db, 'endlessQuizzes'));
    const querySnapshot = await getDocs(q);
    
    const topicsMap = new Map();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const key = `${data.subject}-${data.topic}`;
      if (!topicsMap.has(key)) {
        topicsMap.set(key, {
          subject: data.subject,
          topic: data.topic
        });
      }
    });

    return Array.from(topicsMap.values());
  } catch (error) {
    console.error('Error fetching endless topics:', error);
    return [];
  }
};

/**
 * Get user's best endless quiz score
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Best score data
 */
export const getUserBestEndlessScore = async (userId) => {
  try {
    const q = query(
      collection(db, 'endlessQuizzes'),
      where('userId', '==', userId),
      orderBy('correctAnswers', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error fetching user best endless score:', error);
    return null;
  }
};

