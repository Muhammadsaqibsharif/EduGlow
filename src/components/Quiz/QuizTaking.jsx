import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveQuiz } from '../../services/quizService';
import { generateHint } from '../../services/geminiService';
import ProgressBar from './ProgressBar';
import toast from 'react-hot-toast';

const QuizTaking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const { questions, config } = location.state || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions?.length || 0).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hint states
  const [hints, setHints] = useState({}); // { questionIndex: [hint1, hint2, hint3] }
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      toast.error('No questions available');
      navigate('/quiz/configure');
    }
  }, [questions, navigate]);

  useEffect(() => {
    // Load saved answer for current question
    setSelectedOption(userAnswers[currentQuestionIndex]);
  }, [currentQuestionIndex, userAnswers]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleGetHint = async () => {
    if (isLoadingHint) return;

    const currentHints = hints[currentQuestionIndex] || [];
    
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

      const updatedHints = {
        ...hints,
        [currentQuestionIndex]: [...currentHints, hint]
      };
      setHints(updatedHints);

      toast.success(`Hint ${currentHints.length + 1} generated!`, { id: loadingToast });
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to generate hint', { id: loadingToast });
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `Are you sure you want to submit? You have answered ${answeredCount} of ${questions.length} questions.`
      );
      
      if (!confirmSubmit) {
        return;
      }
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your quiz...');

    try {
      // Calculate score
      let score = 0;
      questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
          score++;
        }
      });

      // Calculate time taken
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      // Prepare quiz data
      const quizData = {
        userId: currentUser.uid,
        subject: config.subject,
        topic: config.topic,
        difficulty: config.difficulty,
        numberOfQuestions: questions.length,
        questions: questions,
        userAnswers: userAnswers,
        score: score,
        totalQuestions: questions.length,
        timeTaken: timeTaken
      };

      // Save to Firestore and navigate to results
      const quizId = await saveQuiz(quizData);
      toast.success('Quiz submitted successfully!', { id: loadingToast });
      
      navigate('/quiz/results', { 
        state: { 
          quizData,
          quizId
        } 
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz results', { id: loadingToast });
      setIsSubmitting(false);
      
      // Still navigate to results even if save fails
      navigate('/quiz/results', { 
        state: { 
          quizData: {
            userId: currentUser.uid,
            subject: config.subject,
            topic: config.topic,
            difficulty: config.difficulty,
            numberOfQuestions: questions.length,
            questions: questions,
            userAnswers: userAnswers,
            score: questions.reduce((acc, question, index) => 
              acc + (userAnswers[index] === question.correctAnswer ? 1 : 0), 0),
            totalQuestions: questions.length,
            timeTaken: Math.floor((Date.now() - startTime) / 1000)
          },
          quizId: null
        } 
      });
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={questions.length} 
          />

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Question {currentQuestionIndex + 1}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{config.subject} • {config.difficulty}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isSubmitting}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-200 disabled:cursor-not-allowed
                  ${selectedOption === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4
                    ${selectedOption === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {optionLabels[index]}
                  </div>
                  <span className={`
                    text-base
                    ${selectedOption === index ? 'text-gray-900 font-medium' : 'text-gray-700'}
                  `}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Hint Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <span className="font-semibold text-gray-700">Need Help?</span>
              </div>
              <button
                onClick={handleGetHint}
                disabled={isLoadingHint || isSubmitting || (hints[currentQuestionIndex]?.length >= 3)}
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
                  `Get Hint (${hints[currentQuestionIndex]?.length || 0}/3)`
                )}
              </button>
            </div>
            
            {hints[currentQuestionIndex]?.length > 0 && (
              <div className="space-y-2">
                {hints[currentQuestionIndex].map((hint, index) => (
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

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion || isSubmitting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-500">
              {userAnswers.filter(a => a !== null).length} of {questions.length} answered
            </div>

            <button
              onClick={handleNext}
              disabled={selectedOption === null || isSubmitting}
              className="btn-primary relative"
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Submit Quiz →</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </>
              ) : (
                isLastQuestion ? 'Submit Quiz →' : 'Next →'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
