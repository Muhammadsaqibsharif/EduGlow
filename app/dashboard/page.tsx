'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Zap, Target, Clock, BookOpen, TrendingUp, History, Award } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="card animate-fade-in text-center">
        <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Welcome to EduGlow</h1>
        <p className="text-gray-600 text-lg">
          Your AI-powered learning companion for quizzes, progress tracking, and educational insights
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/quiz" className="card text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Take Quiz</h3>
          <p className="text-gray-600 text-sm">Start a new quiz session</p>
        </Link>
        
        <Link href="/dashboard/progress" className="card text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
          <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">View Progress</h3>
          <p className="text-gray-600 text-sm">Track your learning journey</p>
        </Link>
        
        <Link href="/dashboard/history" className="card text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
          <History className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Quiz History</h3>
          <p className="text-gray-600 text-sm">Review past performances</p>
        </Link>
        
        <Link href="/dashboard/profile" className="card text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Achievements</h3>
          <p className="text-gray-600 text-sm">View your badges and rewards</p>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
          <div className="text-gray-600">Quizzes Taken</div>
          <div className="text-xs text-gray-500 mt-1">This month</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
          <div className="text-gray-600">Average Score</div>
          <div className="text-xs text-gray-500 mt-1">Last 10 quizzes</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
          <div className="text-gray-600">Subjects Mastered</div>
          <div className="text-xs text-gray-500 mt-1">Above 80% score</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">23</div>
          <div className="text-gray-600">Days Streak</div>
          <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Quizzes */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            Recent Quizzes
          </h3>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', topic: 'Algebra', score: 90, date: '2 hours ago' },
              { subject: 'Science', topic: 'Physics', score: 75, date: '1 day ago' },
              { subject: 'English', topic: 'Grammar', score: 95, date: '2 days ago' },
            ].map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{quiz.subject} - {quiz.topic}</div>
                  <div className="text-sm text-gray-500">{quiz.date}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quiz.score >= 80 ? 'bg-green-100 text-green-800' : 
                  quiz.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.score}%
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/history" className="block mt-4 text-center text-blue-600 hover:text-blue-700">
            View All Quiz History →
          </Link>
        </div>

        {/* Progress Chart */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
            Progress Overview
          </h3>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', progress: 85, color: 'bg-blue-500' },
              { subject: 'Science', progress: 72, color: 'bg-green-500' },
              { subject: 'English', progress: 94, color: 'bg-purple-500' },
              { subject: 'History', progress: 68, color: 'bg-yellow-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.subject}</span>
                  <span className="text-sm text-gray-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/progress" className="block mt-4 text-center text-green-600 hover:text-green-700">
            View Detailed Progress →
          </Link>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Coming Soon! 🚀</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">AI Quiz Generation</h4>
            <p className="text-gray-600 text-sm">Personalized quizzes powered by advanced AI</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Smart Analytics</h4>
            <p className="text-gray-600 text-sm">Detailed insights into your learning patterns</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Gamification</h4>
            <p className="text-gray-600 text-sm">Badges, leaderboards, and achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
