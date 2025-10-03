# EduGlow 🌟
**Team IgniteEd | Innovista National Agentic AI Hackathon 2025 (Track 2)**  
*AI-powered bilingual (English + Urdu) learning companion for students in Pakistan.*

---

## 🚩 Problem
Students in Pakistan often lack access to **affordable, personalized learning resources**.  
Traditional test prep is rigid, doesn’t adapt to student needs, and rarely supports bilingual formats.  
This creates barriers for effective self-study, especially for underserved students.

---

## 💡 Solution
**EduGlow** is an AI-powered learning companion that:
- Dynamically generates **MCQs and quizzes** tailored to subject, grade, and student performance.
- Adapts difficulty levels in **real-time**.
- Provides **personalized feedback** and **step-by-step explanations** in English & Urdu.
- Tracks progress to act like an **intelligent tutor** for accessible, personalized, and engaging self-learning.

---

## ⚡ Technology Stack
- **Frontend**: Flutter / React Native (for cross-platform app)
- **Backend & AI**: Python APIs (FastAPI/Flask) + Mistral/OpenAI for quiz generation
- **Database & Hosting**: Google Firebase Studio

---

## 🔑 Firebase Services (Planned)
- **Firestore** → Store user profiles, quiz history, and progress tracking.
- **Firebase Auth** → Secure login with email/Google.
- **Cloud Functions** → Handle quiz generation requests, adaptive difficulty logic.
- **Firebase Hosting** → Host admin dashboard / web components.
- **Firebase Cloud Messaging** → Send personalized study reminders & progress updates.

---

## 📅 Project Roadmap
1. **Planning Phase** (current) → Define problem, solution, architecture, and tech stack.
2. **Prototype Phase** → Build quiz generation + bilingual explanations.
3. **Integration Phase** → Connect Firebase services & progress tracking.
4. **Testing & Deployment** → Prepare working demo for hackathon.

---

## 👥 Team IgniteEd
- Muhammad Saqib (Team Leader)
- Abdul Rehman Syed (Firebase + Frontend)
- Madeha shah (UI/UX designer)
- Abdullah Khaled (Backend)


---

## 📜 License
This project is licensed under the MIT License.

---

# 🚀 Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ and npm/yarn
- A Google Cloud account with Gemini API access
- A Firebase project

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file in the root directory:

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Scroll to "Your apps" and create a web app
5. Copy the configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

#### Firebase Admin SDK
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file and use values:

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
```

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key:

```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

### 3. Set Up Firebase Services

#### Enable Firestore
1. In Firebase Console → Firestore Database
2. Click "Create Database"
3. Choose production mode
4. Select a location

#### Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features Implemented

### ✅ Dynamic MCQ Generation
- AI-powered question generation with Gemini
- Subject and topic-based customization
- Adaptive difficulty (Easy, Medium, Hard)
- Performance-based difficulty adjustment

### ✅ Personalized Feedback
- Bilingual support (English & Urdu)
- Step-by-step explanations
- Helpful hints for incorrect answers
- Stored in Firestore for review

### ✅ Progress Tracking
- Track attempts, scores, and time spent
- Identify weak areas
- Personalized learning path generation
- Visual analytics

### ✅ Question History
- Complete quiz history storage
- Review past attempts
- Access explanations anytime
- Performance trends

### ✅ Student Profiles
- Firebase Authentication
- Customizable profiles (name, grade, subjects)
- Personalized dashboard
- Subject preferences

## 🎨 Design System

### Typography
- **Headlines**: Poppins (sans-serif)
- **Body Text**: PT Sans (sans-serif)

### Colors
- Primary: Blue gradient (#0ea5e9 to #0284c7)
- Secondary: Purple gradient (#d946ef to #c026d3)
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

### Animations
- Fade in effects for content
- Slide up animations for cards
- Scale transitions for interactions
- Glass-morphism effects

## 📊 Project Structure

```
EduGlow/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── quiz/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai/gemini.ts
│   ├── db/firestore.ts
│   ├── firebase/
│   │   ├── admin.ts
│   │   └── config.ts
│   └── genkit/config.ts
├── types/index.ts
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Usage Guide

### For Students
1. **Sign Up**: Create account with email, name, grade, subjects
2. **Start Quiz**: Select subject, topic, and difficulty
3. **Answer Questions**: AI generates personalized MCQs
4. **Get Feedback**: View explanations in English or Urdu
5. **Track Progress**: Monitor performance and weak areas

### For Developers

#### Generate Questions
```typescript
import { generateQuestions } from '@/lib/ai/gemini';

const result = await generateQuestions(
  'Mathematics',
  'Algebra',
  'medium',
  5
);
```

#### Save Progress
```typescript
import { saveQuizAttempt } from '@/lib/db/firestore';

await saveQuizAttempt({
  userId: 'user-id',
  quizId: 'quiz-id',
  questions,
  answers,
  score: 4,
  totalQuestions: 5,
  timeSpent: 120,
  subject: 'Math',
  topic: 'Algebra',
  completedAt: new Date()
});
```

## 🐛 Troubleshooting

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Firebase Issues
- Verify environment variables
- Check Firebase project settings
- Ensure services are enabled

### Gemini API Errors
- Confirm API key is valid
- Check quota limits
- Verify network connectivity

## 🤝 Contributing

Contributions welcome! Submit a Pull Request.

---

**Made with ❤️ by Team IgniteEd for Innovista Hackathon 2025**
