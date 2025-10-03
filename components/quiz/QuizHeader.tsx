'use client';

import { useEffect, useState } from 'react';
import { Clock, User, BookOpen, Zap } from 'lucide-react';

interface QuizHeaderProps {
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRemaining: number;
  progress: {
    current: number;
    total: number;
    percentage: number;
    answeredCount: number;
  };
  onLanguageToggle: () => void;
  language: 'english' | 'urdu';
}

export function QuizHeader({
  subject,
  topic,
  difficulty,
  timeRemaining,
  progress,
  onLanguageToggle,
  language,
}: QuizHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card mb-6">
      {/* Top Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {subject} - {topic}
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
              <Zap className="w-4 h-4 inline mr-1" />
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onLanguageToggle}
            className="btn-outline text-sm px-4 py-2"
          >
            {language === 'english' ? 'اردو' : 'English'}
          </button>

          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            timeRemaining <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold" suppressHydrationWarning>
              {mounted ? formatTime(timeRemaining) : '00:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Question {progress.current} of {progress.total}
          </span>
          <span className="text-gray-600">
            {progress.answeredCount} answered
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Mini progress dots */}
        <div className="flex justify-center space-x-2 overflow-x-auto py-2">
          {Array.from({ length: progress.total }, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index < progress.current
                  ? 'bg-primary-500'
                  : index === progress.current - 1
                  ? 'bg-primary-400 scale-125'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}