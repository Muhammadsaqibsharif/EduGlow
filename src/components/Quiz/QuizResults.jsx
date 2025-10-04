import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { quizData } = location.state || {};

  if (!quizData) {
    navigate('/dashboard');
    return null;
  }

  const { questions, userAnswers, score, totalQuestions, timeTaken, subject, topic, difficulty } = quizData;
  
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 60;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetakeQuiz = () => {
    navigate('/quiz/configure', { 
      state: { 
        prefill: { 
          subject, 
          topic, 
          difficulty,
          numberOfQuestions: totalQuestions
        } 
      } 
    });
  };

  const handleNewQuiz = () => {
    navigate('/quiz/configure');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Card */}
        <div className="card mb-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Score: {score}/{totalQuestions}
            </h1>
            <p className={`text-3xl font-semibold mb-4 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentage}%
            </p>

            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Time Taken:</span> {formatTime(timeTaken)}
              </div>
              <div>
                <span className="font-semibold">Difficulty:</span> {difficulty}
              </div>
              <div>
                <span className="font-semibold">Accuracy:</span> {percentage}%
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{subject}</span> - {topic}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleRetakeQuiz}
            className="btn-primary py-3"
          >
            🔄 Retake Quiz
          </button>
          <button
            onClick={handleNewQuiz}
            className="btn-primary py-3"
          >
            ✨ New Quiz
          </button>
          <button
            onClick={handleBackToDashboard}
            className="btn-secondary py-3"
          >
            📊 Dashboard
          </button>
        </div>

        {/* Detailed Review */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Detailed Review
          </h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const optionLabels = ['A', 'B', 'C', 'D'];

              return (
                <div 
                  key={index} 
                  className={`p-5 rounded-lg border-2 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start mb-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Question {index + 1}: {question.question}
                      </h3>

                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = question.correctAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer
                                  ? 'bg-green-100 border-2 border-green-400'
                                  : isUserAnswer && !isCorrect
                                  ? 'bg-red-100 border-2 border-red-400'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-semibold mr-2">
                                  {optionLabels[optionIndex]}.
                                </span>
                                <span className={
                                  isCorrectAnswer || (isUserAnswer && !isCorrect)
                                    ? 'font-medium'
                                    : ''
                                }>
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <span className="ml-auto text-green-700 text-sm font-semibold">
                                    ✓ Correct Answer
                                  </span>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <span className="ml-auto text-red-700 text-sm font-semibold">
                                    ✗ Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm">
                          <span className="font-semibold text-blue-900">Explanation:</span>{' '}
                          <span className="text-blue-800">{question.explanation}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
