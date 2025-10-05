import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizQuestions } from '../../services/geminiService';
import toast from 'react-hot-toast';

const QuizConfiguration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    subject: 'Mathematics',
    topic: '',
    numberOfQuestions: 10,
    difficulty: 'Medium',
    quizMode: 'standard' // 'standard' or 'dynamic'
  });
  const [errors, setErrors] = useState({});

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'English Literature',
    'Computer Science',
    'General Knowledge'
  ];

  const questionOptions = [5, 10, 15, 20];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const quizModes = [
    { value: 'standard', label: 'Standard Quiz', description: 'Fixed number of questions at selected difficulty' },
    { value: 'dynamic', label: 'Dynamic Quiz', description: 'Adaptive difficulty - reach 5 correct in a row to win!' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!config.topic.trim()) {
      newErrors.topic = 'Please enter a specific topic';
    } else if (config.topic.trim().length < 3) {
      newErrors.topic = 'Topic must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // For dynamic mode, navigate directly without pre-generating questions
      if (config.quizMode === 'dynamic') {
        navigate('/quiz/dynamic', {
          state: { config }
        });
        return;
      }

      // Standard mode - generate all questions upfront
      const questions = await generateQuizQuestions({
        subject: config.subject,
        topic: config.topic,
        numberOfQuestions: parseInt(config.numberOfQuestions),
        difficulty: config.difficulty
      });

      // Navigate to quiz taking page with questions
      navigate('/quiz/take', { 
        state: { 
          questions,
          config 
        } 
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(error.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Configure Your Quiz
            </h1>
            <p className="text-gray-600">
              Customize your quiz settings to get personalized questions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quiz Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, quizMode: mode.value }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      config.quizMode === mode.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 mt-0.5 ${
                        config.quizMode === mode.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {config.quizMode === mode.value && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          config.quizMode === mode.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {mode.label}
                        </h3>
                        <p className="text-sm text-gray-600">{mode.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={config.subject}
                onChange={handleChange}
                className="input-field"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Specific Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                value={config.topic}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Quadratic Equations, World War II, Photosynthesis"
              />
              <p className="mt-1 text-sm text-gray-500">
                Be specific for better questions
              </p>
              {errors.topic && (
                <p className="error-text">{errors.topic}</p>
              )}
            </div>

            {/* Number of Questions - Only for standard mode */}
            {config.quizMode === 'standard' && (
              <div>
                <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={config.numberOfQuestions}
                  onChange={handleChange}
                  className="input-field"
                >
                  {questionOptions.map((num) => (
                    <option key={num} value={num}>
                      {num} Questions
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Starting Difficulty Level */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                {config.quizMode === 'dynamic' ? 'Starting Difficulty Level' : 'Difficulty Level'}
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={config.difficulty}
                onChange={handleChange}
                className="input-field"
              >
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {config.quizMode === 'dynamic' && (
                <p className="mt-1 text-sm text-gray-500">
                  Difficulty will adjust based on your answers
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI is generating your questions...
                  </span>
                ) : (
                  '✨ Generate Quiz'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizConfiguration;
