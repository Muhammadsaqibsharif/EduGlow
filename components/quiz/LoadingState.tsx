'use client';

import { Brain, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  language: 'english' | 'urdu';
}

export function LoadingState({ 
  message, 
  language 
}: LoadingStateProps) {
  const defaultMessage = language === 'english' 
    ? 'Generating personalized questions with AI...'
    : 'AI کے ذریعے ذاتی سوالات تیار کیے جا رہے ہیں...';

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-white animate-pulse" />
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {language === 'english' ? 'Creating Your Quiz...' : 'آپ کا کوئز بنایا جا رہا ہے...'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message || defaultMessage}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full animate-pulse" 
               style={{ width: '70%' }} />
        </div>

        {/* Fun facts */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {language === 'english' 
              ? '💡 Did you know? Our AI analyzes your learning patterns to create the perfect questions for you!'
              : '💡 کیا آپ جانتے ہیں؟ ہمارا AI آپ کے سیکھنے کے انداز کا تجزیہ کرتا ہے تاکہ آپ کے لیے بہترین سوالات بنائے!'
            }
          </p>
        </div>
      </div>
    </div>
  );
}