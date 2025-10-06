import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEndlessLeaderboard, getAllEndlessTopics } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EndlessLeaderboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const subjects = [
    'All Subjects',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'English Literature',
    'Computer Science',
    'General Knowledge'
  ];

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedSubject, selectedTopic]);

  const loadTopics = async () => {
    try {
      const topicsList = await getAllEndlessTopics();
      setTopics(topicsList);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const subject = selectedSubject === 'all' ? null : selectedSubject;
      const topic = selectedTopic === 'all' ? null : selectedTopic;
      const data = await getEndlessLeaderboard(subject, topic);
      setLeaderboard(data);
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

  const getFilteredTopics = () => {
    if (selectedSubject === 'all') return topics;
    return topics.filter(t => t.subject === selectedSubject);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🏆 Endless Quiz Leaderboard
                </h1>
                <p className="text-gray-600">
                  See who can answer the most questions without getting one wrong!
                </p>
              </div>
              <button
                onClick={() => navigate('/quiz/configure')}
                className="btn-primary"
              >
                Take Quiz
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic('all');
                }}
                className="input-field"
              >
                <option value="all">All Subjects</option>
                {subjects.slice(1).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="input-field"
                disabled={selectedSubject === 'all'}
              >
                <option value="all">All Topics</option>
                {getFilteredTopics().map((topic, index) => (
                  <option key={index} value={topic.topic}>
                    {topic.topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leaderboard */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl text-gray-600 mb-2">No entries yet!</p>
              <p className="text-gray-500 mb-6">
                Be the first to set a score in this category
              </p>
              <button
                onClick={() => navigate('/quiz/configure')}
                className="btn-primary"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="mb-8 flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="text-center flex-1 max-w-[200px]">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg p-6 mb-2">
                      <div className="text-4xl mb-2">🥈</div>
                      <div className="font-bold text-white truncate">
                        {leaderboard[1].userName}
                      </div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {leaderboard[1].correctAnswers}
                      </div>
                    </div>
                    <div className="bg-gray-200 h-24 rounded-b-lg flex items-center justify-center">
                      <div className="text-2xl font-bold text-gray-600">2</div>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center flex-1 max-w-[200px]">
                    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-lg p-6 mb-2">
                      <div className="text-5xl mb-2">🥇</div>
                      <div className="font-bold text-white truncate">
                        {leaderboard[0].userName}
                      </div>
                      <div className="text-4xl font-bold text-white mt-2">
                        {leaderboard[0].correctAnswers}
                      </div>
                    </div>
                    <div className="bg-yellow-200 h-32 rounded-b-lg flex items-center justify-center">
                      <div className="text-3xl font-bold text-yellow-700">1</div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center flex-1 max-w-[200px]">
                    <div className="bg-gradient-to-b from-orange-300 to-orange-500 rounded-t-lg p-6 mb-2">
                      <div className="text-4xl mb-2">🥉</div>
                      <div className="font-bold text-white truncate">
                        {leaderboard[2].userName}
                      </div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {leaderboard[2].correctAnswers}
                      </div>
                    </div>
                    <div className="bg-orange-200 h-16 rounded-b-lg flex items-center justify-center">
                      <div className="text-2xl font-bold text-orange-700">3</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard List */}
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.userId === currentUser?.uid;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' :
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
                            {entry.subject} • {entry.topic}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(entry.timeTaken)} • {entry.finalDifficulty} difficulty
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">
                            {entry.correctAnswers}
                          </div>
                          <div className="text-xs text-gray-600">questions</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {leaderboard.length >= 50 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing top 50 players
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndlessLeaderboard;
