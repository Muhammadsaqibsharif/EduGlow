import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateSingleQuestion } from '../../services/geminiService';
import { saveEndlessQuiz } from '../../services/quizService';
import toast from 'react-hot-toast';

const EndlessQuizTaking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const { config } = location.state || {};
  
  const [questionCount, setQuestionCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('Easy'); // Always start with Easy
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  const [startTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track quiz history
  const [questionHistory, setQuestionHistory] = useState([]);

  // Difficulty progression thresholds
  const DIFFICULTY_THRESHOLDS = {
    'Easy': 5,      // After 5 correct, move to Medium
    'Medium': 10,   // After 10 correct, move to Hard
    'Hard': Infinity // Stay at Hard forever
  };

  useEffect(() => {
    if (!config) {
      toast.error('No quiz configuration found');
      navigate('/quiz/configure');
      return;
    }
    
    // Load first question
    loadNextQuestion();
  }, []);

  const getDifficultyLevel = (correctCount) => {
    if (correctCount < DIFFICULTY_THRESHOLDS.Easy) {
      return 'Easy';
    } else if (correctCount < DIFFICULTY_THRESHOLDS.Medium) {
      return 'Medium';
    } else {
      return 'Hard';
    }
  };

  const loadNextQuestion = async () => {
    setIsLoadingNextQuestion(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestion(null);
    
    try {
      // Determine difficulty based on correct answers
      const nextDifficulty = getDifficultyLevel(questionCount);
      setCurrentDifficulty(nextDifficulty);

      const question = await generateSingleQuestion({
        subject: config.subject,
        topic: config.topic,
        difficulty: nextDifficulty,
        previousQuestions: questionHistory
      });

      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error loading question:', error);
      toast.error(error.message || 'Failed to load question');
    } finally {
      setIsLoadingNextQuestion(false);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    if (isAnswered || gameOver) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Update history
    const newHistory = [...questionHistory, {
      ...currentQuestion,
      userAnswer: selectedOption,
      wasCorrect: correct,
      difficulty: currentDifficulty
    }];
    setQuestionHistory(newHistory);

    if (correct) {
      // Continue to next question
      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      
      // Show progression message
      if (newCount === DIFFICULTY_THRESHOLDS.Easy) {
        toast.success('🎯 Difficulty increased to Medium!', { duration: 4000 });
      } else if (newCount === DIFFICULTY_THRESHOLDS.Medium) {
        toast.success('🔥 Difficulty increased to Hard!', { duration: 4000 });
      }
    } else {
      // Game over - one wrong answer ends the game
      setGameOver(true);
    }
  };

  const handleNextQuestion = () => {
    if (!gameOver) {
      loadNextQuestion();
    }
  };

  const handleGameOver = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    const loadingToast = toast.loading('Saving your score to leaderboard...');

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const quizData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        userEmail: currentUser.email,
        subject: config.subject,
        topic: config.topic,
        questions: questionHistory,
        correctAnswers: questionCount,
        totalQuestions: questionHistory.length,
        finalDifficulty: currentDifficulty,
        timeTaken: timeTaken
      };

      const quizId = await saveEndlessQuiz(quizData);
      
      toast.success('Score saved to leaderboard!', { id: loadingToast });
      
      navigate('/quiz/endless/results', { 
        state: { 
          quizData: {
            ...quizData,
            quizType: 'endless',
            score: questionCount
          },
          quizId
        } 
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz results', { id: loadingToast });
      setIsSaving(false);
    }
  };

  if (!config) {
    return null;
  }

  if (isLoadingNextQuestion && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your question...</p>
        </div>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          {/* Header Stats */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                🎮 Endless Mode
              </h2>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {questionCount}
              </div>
              <div className="text-gray-600">Questions Answered Correctly</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className={`text-2xl font-bold ${currentDifficulty === 'Easy' ? 'text-green-600' : 'text-gray-400'}`}>
                  Easy
                </div>
                <div className="text-xs text-gray-600 mt-1">0-4</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className={`text-2xl font-bold ${currentDifficulty === 'Medium' ? 'text-yellow-600' : 'text-gray-400'}`}>
                  Medium
                </div>
                <div className="text-xs text-gray-600 mt-1">5-9</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className={`text-2xl font-bold ${currentDifficulty === 'Hard' ? 'text-red-600' : 'text-gray-400'}`}>
                  Hard
                </div>
                <div className="text-xs text-gray-600 mt-1">10+</div>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-red-900">
                ⚠️ One wrong answer and the quiz ends!
              </span>
            </div>
          </div>

          {currentQuestion && (
            <>
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Question {questionHistory.length + 1}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      currentDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentDifficulty}
                    </span>
                    <span className="text-sm text-gray-500">{config.subject}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  let optionClass = 'border-gray-200 hover:border-gray-300 bg-white';
                  
                  if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                      optionClass = 'border-green-500 bg-green-50';
                    } else if (index === selectedOption) {
                      optionClass = 'border-red-500 bg-red-50';
                    }
                  } else if (selectedOption === index) {
                    optionClass = 'border-blue-500 bg-blue-50';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered || gameOver}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${optionClass} ${
                        isAnswered || gameOver ? 'cursor-default' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 ${
                          isAnswered && index === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : isAnswered && index === selectedOption
                            ? 'bg-red-500 text-white'
                            : selectedOption === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {optionLabels[index]}
                        </div>
                        <span className="text-base text-gray-700">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (shown after answering) */}
              {isAnswered && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full mr-3 mt-0.5 ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? (
                        <svg className="w-full h-full text-white p-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-full h-full text-white p-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {isCorrect ? '✓ Correct!' : '✗ Game Over!'}
                      </h4>
                      <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                        {currentQuestion.explanation}
                      </p>
                      {isCorrect && (
                        <p className="mt-2 text-sm text-green-700">
                          Great job! You've answered {questionCount} questions correctly. Keep going! 🚀
                        </p>
                      )}
                      {!isCorrect && (
                        <p className="mt-2 text-sm font-semibold text-red-700">
                          Your final score: {questionCount} questions answered correctly
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center items-center pt-4 border-t">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="btn-primary px-8"
                  >
                    Submit Answer
                  </button>
                ) : gameOver ? (
                  <button
                    onClick={handleGameOver}
                    disabled={isSaving}
                    className="btn-primary bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8"
                  >
                    {isSaving ? 'Saving...' : 'View Results & Leaderboard'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={isLoadingNextQuestion}
                    className="btn-primary px-8"
                  >
                    {isLoadingNextQuestion ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Next Question →'
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndlessQuizTaking;
