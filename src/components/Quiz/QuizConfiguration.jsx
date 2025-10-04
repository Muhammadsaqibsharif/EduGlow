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
    difficulty: 'Medium'
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

            {/* Number of Questions */}
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

            {/* Difficulty Level */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
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
