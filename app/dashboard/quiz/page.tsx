'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { generateQuestions } from '@/lib/ai/gemini';
import { saveQuizAttempt } from '@/lib/db/firestore';
import { Question } from '@/types';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [language, setLanguage] = useState<'english' | 'urdu'>('english');

  const subject = searchParams.get('subject') || '';
  const topic = searchParams.get('topic') || '';
  const difficulty = (searchParams.get('difficulty') || 'medium') as 'easy' | 'medium' | 'hard';

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const result = await generateQuestions(subject, topic, difficulty, 5);
    
    if (result.success && result.questions.length > 0) {
      setQuestions(result.questions);
      setSelectedAnswers(new Array(result.questions.length).fill(-1));
    } else {
      alert('Failed to generate questions. Please try again.');
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = selectedAnswers.filter(a => a === -1).length;
    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`);
      if (!confirm) return;
    }

    setShowResults(true);

    // Calculate score
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Save to Firestore
    if (auth.currentUser) {
      await saveQuizAttempt({
        userId: auth.currentUser.uid,
        quizId: `quiz_${Date.now()}`,
        questions,
        answers: selectedAnswers,
        score,
        totalQuestions: questions.length,
        timeSpent,
        subject,
        topic,
      });
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating personalized questions with AI...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-red-600">No questions were generated. Please try again.</p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{subject} - {topic}</h2>
            <p className="text-gray-600 capitalize">Difficulty: {difficulty}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'english' ? 'urdu' : 'english')}
              className="btn-outline text-sm"
            >
              {language === 'english' ? 'اردو' : 'English'}
            </button>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{Math.floor((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{selectedAnswers.filter(a => a !== -1).length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Question */}
          <div className="card animate-slide-up">
            <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`quiz-option ${
                    selectedAnswers[currentQuestionIndex] === index ? 'quiz-option-selected' : ''
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={handleSubmit} className="btn-primary">
                  Submit Quiz
                </button>
              ) : (
                <button onClick={handleNext} className="btn-primary">
                  Next →
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Results */}
          <div className="card animate-scale-in text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Complete! 🎉</h2>
            <div className="text-6xl font-bold text-primary-600 mb-2">{percentage}%</div>
            <p className="text-xl text-gray-600 mb-8">
              You scored {score} out of {questions.length}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{questions.length - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.floor((Date.now() - startTime) / 1000)}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => router.push('/dashboard')} className="btn-outline">
                Back to Dashboard
              </button>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold">Review Answers</h3>
            {questions.map((question, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold flex-1">
                    {index + 1}. {question.question}
                  </h4>
                  {selectedAnswers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        optIndex === question.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500'
                          : optIndex === selectedAnswers[index]
                          ? 'bg-red-100 border-2 border-red-500'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                      {option}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">💡 {language === 'english' ? 'Explanation' : 'وضاحت'}</div>
                  <p className="text-gray-700">
                    {language === 'english' ? question.explanation.english : question.explanation.urdu}
                  </p>
                </div>

                {/* Hint for incorrect answers */}
                {selectedAnswers[index] !== question.correctAnswer && (
                  <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                    <div className="font-semibold mb-2">🔍 {language === 'english' ? 'Hint' : 'اشارہ'}</div>
                    <p className="text-gray-700">
                      {language === 'english' ? question.hint.english : question.hint.urdu}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
