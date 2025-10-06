import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Auth Components
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';

// Dashboard Components
import Dashboard from './components/Dashboard/Dashboard';
import QuizHistory from './components/Dashboard/QuizHistory';

// Quiz Components
import QuizConfiguration from './components/Quiz/QuizConfiguration';
import QuizTaking from './components/Quiz/QuizTaking';
import DynamicQuizTaking from './components/Quiz/DynamicQuizTaking';
import EndlessQuizTaking from './components/Quiz/EndlessQuizTaking';
import QuizResults from './components/Quiz/QuizResults';
import EndlessQuizResults from './components/Quiz/EndlessQuizResults';
import EndlessLeaderboard from './components/Quiz/EndlessLeaderboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz-history"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <QuizHistory />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <QuizHistory />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/configure"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <QuizConfiguration />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/take"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <QuizTaking />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/dynamic"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <DynamicQuizTaking />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/endless"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <EndlessQuizTaking />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/results"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/quiz/endless/results"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <EndlessQuizResults />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <EndlessLeaderboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
