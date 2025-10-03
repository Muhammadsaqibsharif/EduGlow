'use client';

import { QuizResult } from '@/types';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Home } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onBackToDashboard: () => void;
  language: 'english' | 'urdu';
}

export function QuizResults({ result, onRetry, onBackToDashboard, language }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = (percentage: number) => {
    if (language === 'urdu') {
      if (percentage >= 90) return 'بہترین! آپ نے شاندار کارکردگی دکھائی! 🌟';
      if (percentage >= 80) return 'عمدہ! آپ کی کارکردگی بہت اچھی ہے! 👏';
      if (percentage >= 70) return 'اچھا! آپ نے اچھی کوشش کی! 👍';
      if (percentage >= 60) return 'ٹھیک ہے! مزید مشق کریں! 💪';
      return 'کوئی بات نہیں! دوبارہ کوشش کریں! 🎯';
    }

    if (percentage >= 90) return 'Excellent! Outstanding performance! 🌟';
    if (percentage >= 80) return 'Great job! Very good performance! 👏';
    if (percentage >= 70) return 'Good work! Nice effort! 👍';
    if (percentage >= 60) return 'Not bad! Keep practicing! 💪';
    return 'Keep trying! You can do better! 🎯';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className="card text-center animate-scale-in">
        <div className="mb-6">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold mb-2">
            {language === 'english' ? 'Quiz Complete!' : 'کوئز مکمل!'}
          </h2>
          <p className="text-gray-600 text-lg">
            {getPerformanceMessage(result.percentage)}
          </p>
        </div>

        {/* Score Display */}
        <div className={`text-7xl font-bold mb-4 ${getScoreColor(result.percentage)}`}>
          {result.percentage}%
        </div>

        <p className="text-xl text-gray-600 mb-8">
          {language === 'english' 
            ? `You scored ${result.score} out of ${result.totalQuestions} questions correctly`
            : `آپ نے ${result.totalQuestions} میں سے ${result.score} سوالات درست کیے`
          }
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-green-50 rounded-xl">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{result.score}</div>
            <div className="text-sm text-green-600">
              {language === 'english' ? 'Correct' : 'درست'}
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-xl">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">
              {result.totalQuestions - result.score}
            </div>
            <div className="text-sm text-red-600">
              {language === 'english' ? 'Incorrect' : 'غلط'}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">
              {formatTime(result.timeSpent)}
            </div>
            <div className="text-sm text-blue-600">
              {language === 'english' ? 'Time' : 'وقت'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToDashboard}
            className="flex items-center justify-center space-x-2 btn-outline"
          >
            <Home className="w-5 h-5" />
            <span>{language === 'english' ? 'Back to Dashboard' : 'ڈیش بورڈ پر واپس'}</span>
          </button>

          <button
            onClick={onRetry}
            className="flex items-center justify-center space-x-2 btn-primary"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{language === 'english' ? 'Try Again' : 'دوبارہ کوشش کریں'}</span>
          </button>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">
          {language === 'english' ? 'Performance Insights' : 'کارکردگی کا تجزیہ'}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {language === 'english' ? 'Average Time per Question' : 'ہر سوال کے لیے اوسط وقت'}
            </h4>
            <p className="text-blue-700">
              {Math.round(result.timeSpent / result.totalQuestions)} seconds
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              {language === 'english' ? 'Accuracy Rate' : 'درستگی کی شرح'}
            </h4>
            <p className="text-purple-700">{result.percentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}