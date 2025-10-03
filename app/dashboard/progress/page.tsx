'use client';

import { TrendingUp, BookOpen, Target, Calendar, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const subjects = [
    { name: 'Mathematics', progress: 85, color: 'bg-blue-500', quizzes: 15, avgScore: 87 },
    { name: 'Science', progress: 72, color: 'bg-green-500', quizzes: 12, avgScore: 79 },
    { name: 'English', progress: 94, color: 'bg-purple-500', quizzes: 18, avgScore: 92 },
    { name: 'History', progress: 68, color: 'bg-yellow-500', quizzes: 8, avgScore: 74 },
    { name: 'Physics', progress: 76, color: 'bg-red-500', quizzes: 10, avgScore: 81 },
    { name: 'Chemistry', progress: 82, color: 'bg-indigo-500', quizzes: 11, avgScore: 85 },
  ];

  const weeklyProgress = [
    { day: 'Mon', score: 78 },
    { day: 'Tue', score: 85 },
    { day: 'Wed', score: 82 },
    { day: 'Thu', score: 90 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 92 },
    { day: 'Sun', score: 89 },
  ];

  const achievements = [
    { title: 'Quiz Master', description: 'Completed 50 quizzes', icon: '🎯', earned: true },
    { title: 'Perfect Score', description: 'Got 100% on a quiz', icon: '💯', earned: true },
    { title: 'Week Warrior', description: 'Took quizzes 7 days in a row', icon: '🔥', earned: true },
    { title: 'Subject Expert', description: 'Master 3 subjects', icon: '🧠', earned: false },
    { title: 'Speed Runner', description: 'Complete quiz in under 5 minutes', icon: '⚡', earned: false },
    { title: 'Improvement Hero', description: 'Improve score by 20 points', icon: '📈', earned: true },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="card text-center">
          <TrendingUp className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
          <p className="text-gray-600 text-lg">
            Track your performance and see how you're improving over time
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">74</div>
          <div className="text-gray-600">Total Quizzes</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">84%</div>
          <div className="text-gray-600">Overall Average</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">23</div>
          <div className="text-gray-600">Day Streak</div>
          <div className="text-xs text-gray-500 mt-1">Keep going!</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">6</div>
          <div className="text-gray-600">Achievements</div>
          <div className="text-xs text-gray-500 mt-1">4 earned</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            Subject Progress
          </h3>
          <div className="space-y-6">
            {subjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.name}</span>
                  <div className="text-sm text-gray-600">
                    {subject.quizzes} quizzes • {subject.avgScore}% avg
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm font-medium text-gray-700">
                  {subject.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Calendar className="w-6 h-6 text-green-600 mr-2" />
            This Week's Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average this week</span>
              <span className="font-bold text-green-600">86%</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                  <div className="bg-gray-200 rounded h-20 flex items-end">
                    <div 
                      className="bg-green-500 rounded w-full transition-all duration-500"
                      style={{ height: `${(day.score / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-1">{day.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 text-yellow-600 mr-2" />
          Achievements
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                achievement.earned 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-bold mb-1 ${
                  achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                      Earned ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold mb-4">Study Tips Based on Your Progress</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Focus on History</h4>
              <p className="text-gray-600 text-sm">Your lowest performing subject. Try taking more practice quizzes!</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Keep Up English</h4>
              <p className="text-gray-600 text-sm">You're doing great! Maintain your streak with regular practice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}