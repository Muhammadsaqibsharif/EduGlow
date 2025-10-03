'use client';

import { History, BookOpen, Clock, Target, Calendar, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const quizHistory = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Algebra Basics',
      score: 95,
      totalQuestions: 10,
      timeSpent: '12 min',
      difficulty: 'Medium',
      date: '2024-10-03',
      time: '2:30 PM'
    },
    {
      id: 2,
      subject: 'Science',
      topic: 'Photosynthesis',
      score: 88,
      totalQuestions: 8,
      timeSpent: '10 min',
      difficulty: 'Easy',
      date: '2024-10-02',
      time: '4:15 PM'
    },
    {
      id: 3,
      subject: 'English',
      topic: 'Grammar Fundamentals',
      score: 92,
      totalQuestions: 12,
      timeSpent: '15 min',
      difficulty: 'Medium',
      date: '2024-10-01',
      time: '1:45 PM'
    },
    {
      id: 4,
      subject: 'Physics',
      topic: 'Newton Laws',
      score: 75,
      totalQuestions: 15,
      timeSpent: '22 min',
      difficulty: 'Hard',
      date: '2024-09-30',
      time: '3:20 PM'
    },
    {
      id: 5,
      subject: 'Mathematics',
      topic: 'Geometry',
      score: 82,
      totalQuestions: 10,
      timeSpent: '14 min',
      difficulty: 'Medium',
      date: '2024-09-29',
      time: '11:30 AM'
    },
    {
      id: 6,
      subject: 'Chemistry',
      topic: 'Chemical Bonding',
      score: 90,
      totalQuestions: 12,
      timeSpent: '16 min',
      difficulty: 'Hard',
      date: '2024-09-28',
      time: '5:00 PM'
    },
  ];

  const subjects = ['all', 'Mathematics', 'Science', 'English', 'Physics', 'Chemistry'];
  
  const filteredHistory = selectedFilter === 'all' 
    ? quizHistory 
    : quizHistory.filter(quiz => quiz.subject === selectedFilter);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <History className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Quiz History</h1>
          <p className="text-gray-600 text-lg">
            Review your past quiz performances and track your improvement
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{quizHistory.length}</div>
          <div className="text-gray-600">Total Quizzes</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Math.round(quizHistory.reduce((acc, quiz) => acc + quiz.score, 0) / quizHistory.length)}%
          </div>
          <div className="text-gray-600">Average Score</div>
          <div className="text-xs text-gray-500 mt-1">Overall performance</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {quizHistory.filter(quiz => quiz.score >= 90).length}
          </div>
          <div className="text-gray-600">Excellent Scores</div>
          <div className="text-xs text-gray-500 mt-1">90% and above</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {new Set(quizHistory.map(quiz => quiz.subject)).size}
          </div>
          <div className="text-gray-600">Subjects Practiced</div>
          <div className="text-xs text-gray-500 mt-1">Different topics</div>
        </div>
      </div>

      {/* Filter and History */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            Quiz History
          </h3>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quiz History List */}
        <div className="space-y-4">
          {filteredHistory.map((quiz) => (
            <div 
              key={quiz.id} 
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold">{quiz.subject} - {quiz.topic}</h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {quiz.date} at {quiz.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(quiz.score)}`}>
                    {quiz.score}%
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{quiz.score}/{quiz.totalQuestions} correct</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{quiz.timeSpent}</span>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="text-right">
                  <button 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={() => alert('Quiz review feature coming soon!')}
                  >
                    Review Quiz →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No quizzes found</h3>
            <p className="text-gray-400">
              {selectedFilter === 'all' 
                ? 'You have not taken any quizzes yet. Start your first quiz!' 
                : `No quizzes found for ${selectedFilter}. Try a different subject.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold mb-4">Performance Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold mb-2">Best Subject</h4>
            <p className="text-lg font-bold text-green-600">English</p>
            <p className="text-sm text-gray-600">92% average score</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Fastest Quiz</h4>
            <p className="text-lg font-bold text-blue-600">10 minutes</p>
            <p className="text-sm text-gray-600">Science - Photosynthesis</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-semibold mb-2">Best Score</h4>
            <p className="text-lg font-bold text-purple-600">95%</p>
            <p className="text-sm text-gray-600">Mathematics - Algebra</p>
          </div>
        </div>
      </div>
    </div>
  );
}