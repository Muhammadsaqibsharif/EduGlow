# 🏗️ EduGlow Architecture

## Application Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         EDUGLOW                              │
│                  AI Quiz Generator Platform                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │     Quiz     │  │  Dashboard   │     │
│  │  Components  │  │  Components  │  │  Components  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Router (Navigation Layer)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AuthContext (State Management)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Firebase   │  │    Gemini    │  │     Quiz     │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Firebase   │  │  Firestore   │  │   Google     │     │
│  │     Auth     │  │   Database   │  │  Gemini AI   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
│
├── AuthProvider (Context)
│
├── Router
    │
    ├── Public Routes
    │   ├── /signup → SignUp.jsx
    │   ├── /login → Login.jsx
    │   └── /forgot-password → ForgotPassword.jsx
    │
    └── Protected Routes (ProtectedRoute.jsx)
        │
        ├── Navbar.jsx (Common)
        │
        ├── /dashboard → Dashboard.jsx
        │   ├── Statistics Cards
        │   ├── Recent History Table
        │   └── Start New Quiz Button
        │
        ├── /quiz/configure → QuizConfiguration.jsx
        │   ├── Subject Selector
        │   ├── Topic Input
        │   ├── Question Count
        │   └── Difficulty Level
        │
        ├── /quiz/take → QuizTaking.jsx
        │   ├── ProgressBar.jsx
        │   ├── Question Display
        │   ├── Options Selection
        │   └── Navigation Controls
        │
        ├── /quiz/results → QuizResults.jsx
        │   ├── Score Display
        │   ├── Statistics Summary
        │   ├── Detailed Review
        │   └── Action Buttons
        │
        └── /quiz-history → QuizHistory.jsx
            ├── Filters & Search
            ├── History Table
            └── Quiz Detail View
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      USER ACTION                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  REACT COMPONENT                          │
│  - Handles user input                                     │
│  - Validates data                                         │
│  - Triggers service calls                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                            │
│  - firebase.js: Authentication & initialization           │
│  - geminiService.js: AI question generation              │
│  - quizService.js: Database operations                   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                            │
│  - Firebase Auth: User authentication                     │
│  - Firestore: Data storage & retrieval                   │
│  - Gemini API: AI-powered question generation            │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                    RESPONSE                               │
│  - Success: Update UI with data                           │
│  - Error: Show error message via toast                    │
└──────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────────┐
│   Sign Up    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Create Firebase Account     │
│  - Email validation          │
│  - Password strength check   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Update User Profile         │
│  - Set display name          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Create Firestore Profile    │
│  - User document             │
│  - Initial statistics        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Set Auth State              │
│  - Update context            │
│  - Persist session           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────┐
│  Redirect to │
│  Dashboard   │
└──────────────┘
```

## Quiz Generation Flow

```
┌──────────────────────┐
│  Quiz Configuration  │
│  - Select subject    │
│  - Enter topic       │
│  - Choose count      │
│  - Set difficulty    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Validate Input              │
│  - Required fields           │
│  - Format checks             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Call Gemini API             │
│  - Send prompt               │
│  - Request JSON format       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Parse Response              │
│  - Extract JSON              │
│  - Validate structure        │
│  - Retry if needed           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Navigate to Quiz Taking     │
│  - Pass questions            │
│  - Start timer               │
└──────────────────────────────┘
```

## Quiz Taking Flow

```
┌──────────────────────┐
│  Display Question    │
│  - Show question     │
│  - Show 4 options    │
│  - Show progress     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  User Selects Answer         │
│  - Save to state             │
│  - Enable next button        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Navigate Questions          │
│  - Next: Move forward        │
│  - Previous: Move back       │
│  - Submit: On last question  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Calculate Score             │
│  - Compare answers           │
│  - Count correct             │
│  - Calculate time            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Save to Firestore           │
│  - Create quiz document      │
│  - Update user stats         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Show Results        │
│  - Display score     │
│  - Show review       │
└──────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────┐
│         AuthContext (Global)             │
│  - currentUser                           │
│  - signup()                              │
│  - login()                               │
│  - logout()                              │
│  - resetPassword()                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      Component State (Local)             │
│  - Form data                             │
│  - Loading states                        │
│  - Error states                          │
│  - UI states                             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      Router State (Navigation)           │
│  - Location state                        │
│  - Query parameters                      │
│  - Route parameters                      │
└──────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────┐
│           Frontend Security              │
│  - Protected routes                      │
│  - Input validation                      │
│  - XSS protection (React)                │
│  - Environment variables                 │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         Firebase Security                │
│  - Authentication tokens                 │
│  - Firestore rules                       │
│  - User-based access control             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│          API Security                    │
│  - API key protection                    │
│  - Rate limiting                         │
│  - Error handling                        │
└──────────────────────────────────────────┘
```

## Database Schema

```
Firestore Database
│
├── users (collection)
│   └── {userId} (document)
│       ├── name: string
│       ├── email: string
│       ├── createdAt: timestamp
│       ├── totalQuizzes: number
│       └── totalScore: number
│
└── quizzes (collection)
    └── {quizId} (document)
        ├── userId: string
        ├── subject: string
        ├── topic: string
        ├── difficulty: string
        ├── numberOfQuestions: number
        ├── questions: array[
        │   ├── question: string
        │   ├── options: array[4]
        │   ├── correctAnswer: number
        │   └── explanation: string
        │   ]
        ├── userAnswers: array[numbers]
        ├── score: number
        ├── totalQuestions: number
        ├── timeTaken: number
        └── completedAt: timestamp
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│           Development                     │
│  - npm run dev                           │
│  - Hot module replacement                │
│  - Source maps                           │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│           Build Process                   │
│  - npm run build                         │
│  - Vite optimization                     │
│  - Tailwind purge                        │
│  - Asset optimization                    │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│           Production                      │
│  - Static files in /dist                │
│  - Optimized bundles                     │
│  - Minified code                         │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│         Hosting Platform                  │
│  - Vercel / Netlify / Firebase           │
│  - CDN distribution                      │
│  - SSL/HTTPS                             │
└──────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │
│  - React Components                             │
│  - Tailwind CSS                                 │
│  - React Router                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│               Business Logic                     │
│  - AuthContext                                  │
│  - Service functions                            │
│  - Validation logic                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Data Access Layer                   │
│  - Firebase SDK                                 │
│  - Firestore queries                            │
│  - API calls                                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              External Services                   │
│  - Firebase Auth                                │
│  - Firestore Database                           │
│  - Google Gemini AI                             │
└─────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ User Experience
