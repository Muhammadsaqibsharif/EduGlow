'use client';

import { ArrowLeft, ArrowRight, Send, SkipForward } from 'lucide-react';

interface NavigationControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  canProceed: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  selectedAnswer: number | null;
}

export function NavigationControls({
  currentQuestionIndex,
  totalQuestions,
  canProceed,
  isLastQuestion,
  onPrevious,
  onNext,
  onSubmit,
  selectedAnswer,
}: NavigationControlsProps) {
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isFirstQuestion
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 active:scale-95'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      {/* Question indicator */}
      <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">
          {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Next/Submit Button */}
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          className="flex items-center space-x-2 btn-primary"
        >
          <Send className="w-5 h-5" />
          <span>Submit Quiz</span>
        </button>
      ) : (
        <div className="flex space-x-2">
          {/* Skip button (if no answer selected) */}
          {selectedAnswer === null && (
            <button
              onClick={onNext}
              className="flex items-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-medium transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          )}

          {/* Next button */}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canProceed
                ? 'btn-primary'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}