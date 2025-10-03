'use client';

import { Question } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  showResults?: boolean;
  language: 'english' | 'urdu';
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  showResults = false,
  language,
}: QuestionCardProps) {
  const getOptionStyle = (optionIndex: number) => {
    if (!showResults) {
      return selectedAnswer === optionIndex
        ? 'quiz-option quiz-option-selected border-primary-500 bg-primary-50'
        : 'quiz-option';
    }

    // In results mode
    if (optionIndex === question.correctAnswer) {
      return 'quiz-option border-green-500 bg-green-100 text-green-800';
    }

    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return 'quiz-option border-red-500 bg-red-100 text-red-800';
    }

    return 'quiz-option opacity-60';
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showResults) return null;

    if (optionIndex === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex-1">
            <span className="text-primary-600 font-bold">Q{questionNumber}.</span>{' '}
            {question.question}
          </h2>
          {showResults && (
            <div className="ml-4 flex-shrink-0">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResults && onAnswerSelect(index)}
            disabled={showResults}
            className={getOptionStyle(index)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center flex-1">
                <span className="font-bold text-lg mr-3 text-gray-500">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-left">{option}</span>
              </div>
              {getOptionIcon(index)}
            </div>
          </button>
        ))}
      </div>

      {showResults && (
        <div className="mt-6 space-y-4">
          {/* Explanation */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              💡 {language === 'english' ? 'Explanation' : 'وضاحت'}
            </h4>
            <p className="text-blue-700">
              {language === 'english' ? question.explanation.english : question.explanation.urdu}
            </p>
          </div>

          {/* Hint for incorrect answers */}
          {selectedAnswer !== question.correctAnswer && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                💭 {language === 'english' ? 'Hint for next time' : 'اگلی بار کے لیے اشارہ'}
              </h4>
              <p className="text-yellow-700">
                {language === 'english' ? question.hint.english : question.hint.urdu}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}