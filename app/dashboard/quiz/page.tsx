'use client';

import { Book, Clock, Trophy, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  const sampleQuizzes = [
    {
      id: 1,
      title: 'Mathematics - Algebra Basics',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: '15 min',
      description: 'Test your understanding of basic algebraic concepts',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Science - Photosynthesis',
      difficulty: 'Medium',
      questions: 8,
      timeLimit: '12 min',
      description: 'Explore the process of photosynthesis in plants',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'English - Grammar Fundamentals',
      difficulty: 'Easy',
      questions: 12,
      timeLimit: '18 min',
      description: 'Master the basics of English grammar',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Physics - Newton\'s Laws',
      difficulty: 'Hard',
      questions: 15,
      timeLimit: '25 min',
      description: 'Deep dive into Newton\'s three laws of motion',
      color: 'bg-red-500'
    }
  ];

  const difficultyColors = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Hard': 'bg-red-100 text-red-800'
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
          <Book className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Available Quizzes</h1>
          <p className="text-gray-600 text-lg">
            Choose from our collection of educational quizzes
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">24</div>
          <div className="text-gray-600">Total Quizzes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">8</div>
          <div className="text-gray-600">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">85%</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
          <div className="text-gray-600">Subjects</div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleQuizzes.map((quiz) => (
          <div key={quiz.id} className="card hover:scale-105 transition-transform duration-300">
            <div className={`h-32 ${quiz.color} rounded-lg mb-4 flex items-center justify-center`}>
              <Book className="w-12 h-12 text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[quiz.difficulty as keyof typeof difficultyColors]
              }`}>
                {quiz.difficulty}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {quiz.timeLimit}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-500 text-sm">
                <Target className="w-4 h-4 mr-1" />
                {quiz.questions} questions
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Trophy className="w-4 h-4 mr-1" />
                Not attempted
              </div>
            </div>
            
            <button 
              className="w-full btn-primary"
              onClick={() => alert('Quiz functionality coming soon!')}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-12 card text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold mb-4">Quiz Feature Coming Soon!</h2>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you an amazing quiz experience with AI-generated questions.
          Stay tuned for updates!
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">AI-Generated Questions</h4>
            <p className="text-sm text-gray-600 text-center">
              Personalized questions based on your learning level
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Instant Feedback</h4>
            <p className="text-sm text-gray-600 text-center">
              Get detailed explanations for every answer
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Progress Tracking</h4>
            <p className="text-sm text-gray-600 text-center">
              Monitor your learning journey and achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
