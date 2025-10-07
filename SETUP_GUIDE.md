# 🚀 Quick Start Guide for EduGlow

## Step-by-Step Setup Instructions

### 1. Install Dependencies ✅ (Already Done)

The required packages have been installed:
- firebase
- react-router-dom
- react-hot-toast
- @google/generative-ai
- tailwindcss (with postcss & autoprefixer)

### 2. Configure Firebase 🔥

#### a. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name (e.g., "eduglow-quiz")
4. Disable Google Analytics (optional)
5. Click "Create project"

#### b. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Click "Save"

#### c. Create Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose a location closest to your users
5. Click "Enable"

#### d. Get Firebase Configuration
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "EduGlow Web")
6. Copy the config values

### 3. Get Google Gemini API Key 🤖

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" or choose existing project
5. Copy the API key

### 4. Set Up Environment Variables 📝

1. Copy the `.env.example` file to `.env`:
   ```bash
   Copy-Item .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_GEMINI_API_KEY=AIzaSy...
   ```

### 5. Add Firebase Security Rules 🔒

Go to Firestore Database → Rules tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /quizzes/{quizId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Click "Publish"

### 6. Start Development Server 🎯

```bash
npm run dev
```

Your app should now be running at http://localhost:5173

### 7. Test the Application ✨

1. **Sign Up**: Create a new account
2. **Login**: Sign in with your credentials
3. **Configure Quiz**: 
   - Subject: "Mathematics"
   - Topic: "Quadratic Equations"
   - Questions: 5
   - Difficulty: Medium
4. **Take Quiz**: Answer the AI-generated questions
5. **View Results**: Check your score and explanations

## 🐛 Troubleshooting

### Firebase Errors
- **"Firebase not initialized"**: Check if `.env` file exists and contains valid credentials
- **"Permission denied"**: Update Firestore security rules

### Gemini API Errors
- **"Invalid API key"**: Verify your Gemini API key in `.env`
- **"Failed to generate questions"**: Check if API key has proper permissions
- **Rate limits**: Wait a few seconds and try again

### Build Errors
- **"Module not found"**: Run `npm install` again
- **Tailwind not working**: Run `npm run dev` to restart the dev server

## 📚 Application Structure

### Main Routes
- `/signup` - User registration
- `/login` - User authentication
- `/forgot-password` - Password reset
- `/dashboard` - Main dashboard (protected)
- `/quiz/configure` - Quiz setup (protected)
- `/quiz/take` - Take quiz (protected)
- `/quiz/results` - View results (protected)
- `/quiz-history` - Quiz history (protected)
- `/quiz/:quizId` - View specific quiz (protected)

### Key Features
✅ AI-powered question generation
✅ User authentication with Firebase
✅ Real-time quiz history
✅ Detailed statistics
✅ Multiple subjects and difficulty levels
✅ Comprehensive explanations
✅ Responsive design

## 🎉 You're All Set!

The application is now ready to use. Enjoy generating and taking AI-powered quizzes!

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check the README.md for more details
