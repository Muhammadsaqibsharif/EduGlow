import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserQuizzes, getQuizById } from '../../services/quizService';
import toast from 'react-hot-toast';

const QuizHistory = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    search: ''
  });

  useEffect(() => {
    loadQuizzes();
  }, [currentUser]);

  useEffect(() => {
    if (quizId) {
      loadQuizDetail(quizId);
    }
  }, [quizId]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getUserQuizzes(currentUser.uid, 50);
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizDetail = async (id) => {
    try {
      const quiz = await getQuizById(id);
      setSelectedQuiz(quiz);
    } catch (error) {
      console.error('Error loading quiz detail:', error);
      toast.error('Failed to load quiz details');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSubject = !filters.subject || quiz.subject === filters.subject;
    const matchesSearch = !filters.search || 
      quiz.topic.toLowerCase().includes(filters.search.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const uniqueSubjects = [...new Set(quizzes.map(q => q.subject))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  // If viewing a specific quiz detail
  if (selectedQuiz && quizId) {
    const isDynamic = selectedQuiz.quizType === 'dynamic';
    const questions = selectedQuiz.questions;
    const userAnswers = isDynamic ? questions.map(q => q.userAnswer) : selectedQuiz.userAnswers;
    const score = isDynamic ? selectedQuiz.correctAnswers : selectedQuiz.score;
    const totalQuestions = selectedQuiz.totalQuestions;
    const timeTaken = selectedQuiz.timeTaken;
    const subject = selectedQuiz.subject;
    const topic = selectedQuiz.topic;
    const difficulty = isDynamic ? selectedQuiz.startingDifficulty : selectedQuiz.difficulty;
    const completedAt = selectedQuiz.completedAt;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/quiz-history')}
            className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            ← Back to History
          </button>

          {/* Score Card */}
          <div className="card mb-6">
            <div className="text-center">
              {isDynamic && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    🎯 Dynamic Quiz {selectedQuiz.completed ? '- Won! 🎉' : ''}
                  </span>
                </div>
              )}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                isDynamic && selectedQuiz.completed ? 'bg-purple-100' : passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isDynamic ? 'Correct Answers:' : 'Score:'} {score}/{totalQuestions} ({percentage}%)
              </h1>

              {isDynamic && selectedQuiz.finalStreak !== undefined && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg inline-block">
                  <p className="text-lg font-semibold text-blue-900">
                    Final Streak: <span className="text-2xl">{selectedQuiz.finalStreak}</span>
                  </p>
                  {selectedQuiz.completed && (
                    <p className="text-sm text-blue-700 mt-1">
                      🏆 You achieved 5 correct answers in a row!
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-semibold">Subject:</span> {subject}
                </div>
                <div>
                  <span className="font-semibold">Topic:</span> {topic}
                </div>
                <div>
                  <span className="font-semibold">{isDynamic ? 'Starting' : ''} Difficulty:</span> {difficulty}
                </div>
                <div>
                  <span className="font-semibold">Time:</span> {formatTime(timeTaken)}
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {formatDate(completedAt)}
                </div>
                {isDynamic && (
                  <div>
                    <span className="font-semibold text-purple-600">Mode: Dynamic</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = isDynamic ? question.wasCorrect : (userAnswer === question.correctAnswer);
                const questionDifficulty = isDynamic ? question.difficulty : difficulty;

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
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Question {index + 1}: {question.question}
                          </h3>
                          {isDynamic && (
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                              questionDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              questionDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {questionDifficulty}
                            </span>
                          )}
                        </div>

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
                                      ✓ Correct
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
  }

  // Main quiz history list
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
          <p className="text-gray-600">Review all your past quizzes and track your progress</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by topic or subject..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                id="subject"
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className="input-field"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quiz List */}
        <div className="card">
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {quizzes.length === 0 ? 'No quizzes found' : 'No quizzes match your filters'}
              </p>
              {quizzes.length === 0 && (
                <Link to="/quiz/configure" className="btn-primary inline-block">
                  Take Your First Quiz
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuizzes.map((quiz) => {
                    const isDynamic = quiz.quizType === 'dynamic';
                    const score = isDynamic ? quiz.correctAnswers : quiz.score;
                    const difficulty = isDynamic ? quiz.startingDifficulty : quiz.difficulty;
                    const percentage = Math.round((score / quiz.totalQuestions) * 100);
                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{quiz.subject}</span>
                            {isDynamic && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                                Dynamic
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{quiz.topic}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{difficulty}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{quiz.totalQuestions}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              percentage >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {percentage}%
                            </span>
                            {isDynamic && quiz.completed && (
                              <span className="mt-1 text-xs text-purple-600 font-semibold">
                                🏆 Won!
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(quiz.completedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/quiz/${quiz.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;
