import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveQuiz } from '../../services/quizService';
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

  const handleSubmit = () => {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `Are you sure you want to submit? You have answered ${answeredCount} of ${questions.length} questions.`
      );
      
      if (!confirmSubmit) {
        return;
      }
    }

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
    saveQuiz(quizData)
      .then((quizId) => {
        navigate('/quiz/results', { 
          state: { 
            quizData,
            quizId
          } 
        });
      })
      .catch((error) => {
        console.error('Error saving quiz:', error);
        toast.error('Failed to save quiz results');
        // Still navigate to results even if save fails
        navigate('/quiz/results', { 
          state: { 
            quizData,
            quizId: null
          } 
        });
      });
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

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${selectedOption === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4
                    ${selectedOption === index
                      ? 'bg-primary-500 text-white'
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

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-500">
              {userAnswers.filter(a => a !== null).length} of {questions.length} answered
            </div>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="btn-primary"
            >
              {isLastQuestion ? 'Submit Quiz →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
