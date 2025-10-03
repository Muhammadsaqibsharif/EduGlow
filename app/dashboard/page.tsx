'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Zap, Target } from 'lucide-react';

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Urdu',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Geography',
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartQuiz = () => {
    if (!selectedSubject || !topic) {
      alert('Please select a subject and enter a topic');
      return;
    }

    const queryParams = new URLSearchParams({
      subject: selectedSubject,
      topic,
      difficulty,
    });

    router.push(`/dashboard/quiz?${queryParams.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card animate-scale-in">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Brain className="w-8 h-8 text-primary-600" />
          <span>Start a New Quiz</span>
        </h2>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Subject</label>
            <select
              className="input-field"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose a subject...</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Enter Topic</label>
            <input
              type="text"
              className="input-field"
              placeholder="E.g., Algebra, Photosynthesis, Grammar..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  difficulty === 'easy'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Easy</div>
                <div className="text-sm text-gray-600">Beginner friendly</div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('medium')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  difficulty === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <Target className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <div className="font-medium">Medium</div>
                <div className="text-sm text-gray-600">Intermediate level</div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  difficulty === 'hard'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <Brain className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="font-medium">Hard</div>
                <div className="text-sm text-gray-600">Advanced challenges</div>
              </button>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="btn-primary w-full text-lg py-4"
          >
            Generate Quiz with AI ✨
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
          <div className="text-gray-600">Quizzes Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-secondary-600 mb-2">0%</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">0</div>
          <div className="text-gray-600">Total Questions</div>
        </div>
      </div>
    </div>
  );
}
