import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUserProfile } from '../services/quizService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User's full name
   */
  const signup = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });

    // Create user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      name: fullName,
      email: email
    });

    return userCredential;
  };

  /**
   * Sign in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Sign out the current user
   */
  const logout = async () => {
    return await signOut(auth);
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   */
  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
