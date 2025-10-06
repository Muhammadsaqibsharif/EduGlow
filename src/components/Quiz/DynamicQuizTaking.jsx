import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateSingleQuestion, generateHint } from '../../services/geminiService';
import { saveDynamicQuiz } from '../../services/quizService';
import toast from 'react-hot-toast';

const DynamicQuizTaking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const { config } = location.state || {};
  
  const [streak, setStreak] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(config?.difficulty || 'Medium');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [startTime] = useState(Date.now());
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  
  // Track quiz history
  const [questionHistory, setQuestionHistory] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0); // Track consecutive correct for difficulty
  const [consecutiveWrong, setConsecutiveWrong] = useState(0); // Track consecutive wrong for difficulty

  // Hint states
  const [currentHints, setCurrentHints] = useState([]);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const difficultyOrder = ['Easy', 'Medium', 'Hard'];
  const TARGET_STREAK = 5;
  const DIFFICULTY_THRESHOLD = 2; // Need 2 consecutive correct/wrong to change difficulty

  useEffect(() => {
    if (!config) {
      toast.error('No quiz configuration found');
      navigate('/quiz/configure');
      return;
    }
    
    // Load first question
    loadNextQuestion();
  }, []);

  const getDifficultyLevel = (currentLevel, wasCorrect, consCorrect, consWrong) => {
    const currentIndex = difficultyOrder.indexOf(currentLevel);
    
    if (wasCorrect && consCorrect >= DIFFICULTY_THRESHOLD) {
      // Move up in difficulty after 2 consecutive correct answers
      if (currentIndex < difficultyOrder.length - 1) {
        return difficultyOrder[currentIndex + 1];
      }
      return currentLevel; // Stay at Hard if already there
    } else if (!wasCorrect && consWrong >= DIFFICULTY_THRESHOLD) {
      // Move down in difficulty after 2 consecutive wrong answers
      if (currentIndex > 0) {
        return difficultyOrder[currentIndex - 1];
      }
      return currentLevel; // Stay at Easy if already there
    }
    
    // Otherwise, stay at current difficulty
    return currentLevel;
  };

  const loadNextQuestion = async (previousCorrect = null) => {
    setIsLoadingNextQuestion(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestion(null); // Clear current question during loading
    setCurrentHints([]); // Reset hints for new question
    
    try {
      // Determine difficulty for next question
      let nextDifficulty = currentDifficulty;
      let newConsCorrect = consecutiveCorrect;
      let newConsWrong = consecutiveWrong;
      
      if (previousCorrect !== null) {
        // Update consecutive counters
        if (previousCorrect) {
          newConsCorrect = consecutiveCorrect + 1;
          newConsWrong = 0;
          setConsecutiveCorrect(newConsCorrect);
          setConsecutiveWrong(0);
        } else {
          newConsWrong = consecutiveWrong + 1;
          newConsCorrect = 0;
          setConsecutiveWrong(newConsWrong);
          setConsecutiveCorrect(0);
        }
        
        // Check if difficulty should change
        nextDifficulty = getDifficultyLevel(currentDifficulty, previousCorrect, newConsCorrect, newConsWrong);
        
        // Reset consecutive counters if difficulty changed
        if (nextDifficulty !== currentDifficulty) {
          setConsecutiveCorrect(0);
          setConsecutiveWrong(0);
        }
        
        setCurrentDifficulty(nextDifficulty);
      }

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
    if (isAnswered) return;
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

    // Calculate new values
    const newStreak = correct ? streak + 1 : Math.max(0, streak - 1);
    const newCorrectAnswers = correct ? correctAnswers + 1 : correctAnswers;
    const newWrongAnswers = correct ? wrongAnswers : wrongAnswers + 1;

    // Update history
    setQuestionHistory(prev => [...prev, {
      ...currentQuestion,
      userAnswer: selectedOption,
      wasCorrect: correct,
      difficulty: currentDifficulty
    }]);

    // Update counters
    if (correct) {
      setCorrectAnswers(newCorrectAnswers);
      setStreak(newStreak);
      
      // Check if won (5 correct in a row)
      if (newStreak >= TARGET_STREAK) {
        setIsCompleting(true);
        setTimeout(() => {
          handleQuizComplete(true);
        }, 2000);
        return;
      }
    } else {
      setWrongAnswers(newWrongAnswers);
      setStreak(newStreak);
    }
  };

  const handleNextQuestion = () => {
    loadNextQuestion(isCorrect);
  };

  const handleGetHint = async () => {
    if (isLoadingHint) return;

    if (currentHints.length >= 3) {
      toast.error('You have used all 3 hints for this question');
      return;
    }

    setIsLoadingHint(true);
    const loadingToast = toast.loading('Generating hint...');

    try {
      const hint = await generateHint({
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        hintNumber: currentHints.length + 1,
        previousHints: currentHints
      });

      setCurrentHints([...currentHints, hint]);
      toast.success(`Hint ${currentHints.length + 1} generated!`, { id: loadingToast });
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to generate hint', { id: loadingToast });
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleQuitQuiz = () => {
    if (questionHistory.length === 0) {
      navigate('/quiz/configure');
      return;
    }

    const confirmQuit = window.confirm(
      'Are you sure you want to quit? Your progress will be saved.'
    );
    
    if (confirmQuit) {
      handleQuizComplete(false);
    }
  };

  const handleQuizComplete = async (won) => {
    // Prevent double submission
    if (isSubmitting || isCompleting) return;
    
    setIsSubmitting(true);
    setIsCompleting(true);
    const loadingToast = toast.loading('Saving your quiz...');

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const quizData = {
        userId: currentUser.uid,
        subject: config.subject,
        topic: config.topic,
        startingDifficulty: config.difficulty,
        questions: questionHistory,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        totalQuestions: questionHistory.length,
        finalStreak: streak,
        completed: won,
        timeTaken: timeTaken
      };

      const quizId = await saveDynamicQuiz(quizData);
      
      if (won) {
        toast.success('🎉 Congratulations! You won!', { id: loadingToast });
      } else {
        toast.success('Quiz saved successfully!', { id: loadingToast });
      }
      
      navigate('/quiz/results', { 
        state: { 
          quizData: {
            ...quizData,
            quizType: 'dynamic',
            score: correctAnswers,
            isDynamic: true
          },
          quizId
        } 
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz results', { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  if (!config) {
    return null;
  }

  if ((isLoading || isLoadingNextQuestion) && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {isLoadingNextQuestion ? 'Loading next question...' : 'Loading your question...'}
          </p>
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
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{streak}</div>
              <div className="text-sm text-gray-600 mt-1">Current Streak</div>
              <div className="text-xs text-gray-500 mt-1">Target: {TARGET_STREAK}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600 mt-1">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
              <div className="text-sm text-gray-600 mt-1">Wrong</div>
            </div>
          </div>

          {/* Streak Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress to Win</span>
              <span className="text-sm text-gray-600">{streak}/{TARGET_STREAK}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(streak / TARGET_STREAK) * 100}%` }}
              ></div>
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
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${optionClass} ${
                        isAnswered ? 'cursor-default' : ''
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

              {/* Hint Section */}
              {!isAnswered && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                      <span className="font-semibold text-gray-700">Need Help?</span>
                    </div>
                    <button
                      onClick={handleGetHint}
                      disabled={isLoadingHint || currentHints.length >= 3}
                      className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingHint ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        `Get Hint (${currentHints.length}/3)`
                      )}
                    </button>
                  </div>
                  
                  {currentHints.length > 0 && (
                    <div className="space-y-2">
                      {currentHints.map((hint, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold mr-2">
                              {index + 1}
                            </span>
                            <p className="text-sm text-gray-700 flex-1">{hint}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                      </h4>
                      <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                        {currentQuestion.explanation}
                      </p>
                      {!isCorrect && streak > 0 && (
                        <p className="mt-2 text-sm text-red-700">
                          Your streak decreased from {streak + 1} to {streak}.
                          {consecutiveWrong + 1 >= DIFFICULTY_THRESHOLD && currentDifficulty !== 'Easy'
                            ? ' Next question will be easier.'
                            : consecutiveWrong + 1 === DIFFICULTY_THRESHOLD - 1 && currentDifficulty !== 'Easy'
                            ? ' One more wrong for easier questions.'
                            : ''}
                        </p>
                      )}
                      {isCorrect && streak + 1 < TARGET_STREAK && (
                        <p className="mt-2 text-sm text-green-700">
                          Great job! Streak: {streak + 1}. Next question will be harder.
                        </p>
                      )}
                      {isCorrect && streak + 1 >= TARGET_STREAK && (
                        <p className="mt-2 text-sm font-semibold text-green-700">
                          🎉 Amazing! You've reached {TARGET_STREAK} correct answers in a row!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={handleQuitQuiz}
                  disabled={isSubmitting}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Quit Quiz
                </button>

                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="btn-primary"
                  >
                    Submit Answer
                  </button>
                ) : streak >= TARGET_STREAK ? (
                  <button
                    onClick={() => handleQuizComplete(true)}
                    disabled={isSubmitting || isCompleting}
                    className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || isCompleting ? 'Completing...' : '🎉 Complete Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={isLoadingNextQuestion}
                    className="btn-primary"
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

export default DynamicQuizTaking;
