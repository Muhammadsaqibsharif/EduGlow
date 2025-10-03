import Link from 'next/link';
import { BookOpen, Brain, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-6">
            Welcome to EduGlow
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Master your subjects with AI-powered personalized quizzes, instant feedback in English and Urdu, 
            and intelligent progress tracking.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
            <Link href="/auth/login" className="btn-outline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary-100 rounded-full">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">AI-Generated Questions</h3>
            <p className="text-gray-600 text-center">
              Get personalized multiple-choice questions tailored to your subject and difficulty level
            </p>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-secondary-100 rounded-full">
                <BookOpen className="w-8 h-8 text-secondary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Bilingual Feedback</h3>
            <p className="text-gray-600 text-center">
              Receive detailed explanations and hints in both English and Urdu
            </p>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Progress Tracking</h3>
            <p className="text-gray-600 text-center">
              Monitor your performance and identify areas that need improvement
            </p>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Personalized Learning</h3>
            <p className="text-gray-600 text-center">
              Get customized learning paths based on your weak areas and goals
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Subject</h3>
              <p className="text-gray-600">
                Select from various subjects and topics you want to practice
              </p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-secondary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Take AI-Generated Quizzes</h3>
              <p className="text-gray-600">
                Answer personalized questions that adapt to your skill level
              </p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">
                View detailed analytics and get personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
