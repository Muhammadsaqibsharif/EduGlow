import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEndlessLeaderboard } from '../../services/quizService';
import toast from 'react-hot-toast';

const EndlessQuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, quizId } = location.state || {};

  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (!quizData) {
      toast.error('No quiz data found');
      navigate('/quiz/configure');
      return;
    }

    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getEndlessLeaderboard(quizData.subject, quizData.topic);
      setLeaderboard(data);

      // Find user's rank
      const rank = data.findIndex(entry => entry.id === quizId);
      if (rank !== -1) {
        setUserRank(rank + 1);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-500';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-700';
  };

  if (!quizData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Card */}
        <div className="card mb-6">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="text-6xl mb-4">🎮</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Endless Quiz Complete!
              </h1>
              <p className="text-gray-600">
                {quizData.subject} - {quizData.topic}
              </p>
            </div>

            <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl px-8 py-6 mb-6">
              <div className="text-5xl font-bold mb-2">{quizData.score}</div>
              <div className="text-lg">Questions Answered Correctly</div>
            </div>

            {userRank && (
              <div className="mb-4">
                <div className={`text-4xl font-bold ${getRankColor(userRank)}`}>
                  {getRankBadge(userRank)}
                </div>
                <div className="text-gray-600 mt-1">Your Ranking</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {quizData.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {quizData.finalDifficulty}
              </div>
              <div className="text-sm text-gray-600 mt-1">Final Difficulty</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(quizData.timeTaken)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Time Taken</div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Difficulty Progression
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Easy (0-4)</span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${Math.min((quizData.score / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {Math.min(quizData.score, 5)}/5
                </span>
              </div>
              {quizData.score >= 5 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Medium (5-9)</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${Math.min(((quizData.score - 5) / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {Math.min(Math.max(quizData.score - 5, 0), 5)}/5
                  </span>
                </div>
              )}
              {quizData.score >= 10 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hard (10+)</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-red-500 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {Math.max(quizData.score - 10, 0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🏆 Leaderboard
            </h2>
            <button
              onClick={loadLeaderboard}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              🔄 Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No entries yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.id === quizId;
                
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      isCurrentUser
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`text-2xl font-bold ${getRankColor(rank)} min-w-[60px] text-center`}>
                        {getRankBadge(rank)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(entry.timeTaken)} • {entry.finalDifficulty} difficulty
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {entry.correctAnswers}
                        </div>
                        <div className="text-xs text-gray-600">questions</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {leaderboard.length >= 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing top 10 players
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate('/quiz/configure')}
            className="flex-1 btn-primary"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndlessQuizResults;
