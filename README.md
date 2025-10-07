# EduGlow - AI-Powered Quiz Generator

A dynamic quiz generator web application that uses Google Gemini AI to create personalized quizzes across multiple subjects. Built with React, Firebase, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Question Generation**: Uses Google Gemini API to generate contextual quiz questions
- **User Authentication**: Secure signup, login, and password reset using Firebase Auth
- **Real-time Database**: Quiz history and user statistics stored in Firestore
- **Multiple Subjects**: Support for Mathematics, Science, History, Computer Science, and more
- **Difficulty Levels**: Choose between Easy, Medium, and Hard difficulty levels
- **Comprehensive Analytics**: Track your progress with detailed statistics
- **Quiz History**: Review all past quizzes with detailed explanations
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication & Firestore Database)
- **AI**: Google Gemini API
- **Routing**: React Router DOM v6
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Firebase account
- A Google Gemini API key

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd EduGlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password provider)
4. Create a Firestore Database
5. Go to Project Settings and copy your Firebase config

### 4. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for configuration

### 5. Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Note**: You can copy `.env.example` and rename it to `.env`, then fill in your actual credentials.

### 6. Run the application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── SignUp.jsx
│   │   ├── Login.jsx
│   │   └── ForgotPassword.jsx
│   ├── Quiz/
│   │   ├── QuizConfiguration.jsx
│   │   ├── QuizTaking.jsx
│   │   ├── QuizResults.jsx
│   │   └── ProgressBar.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── QuizHistory.jsx
│   └── Layout/
│       ├── Navbar.jsx
│       └── ProtectedRoute.jsx
├── services/
│   ├── firebase.js
│   ├── geminiService.js
│   └── quizService.js
├── context/
│   └── AuthContext.jsx
├── App.jsx
└── main.jsx
```

## 🎮 How to Use

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account
3. **Configure Quiz**: 
   - Select a subject
   - Enter a specific topic
   - Choose number of questions (5, 10, 15, or 20)
   - Select difficulty level (Easy, Medium, Hard)
4. **Take Quiz**: Answer the AI-generated questions
5. **View Results**: See your score and detailed explanations
6. **Track Progress**: Review your quiz history and statistics

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure
- Use Firebase Security Rules to protect your database
- Enable Firebase App Check for additional security

## 🚀 Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## 📝 Firebase Security Rules

Add these rules to your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quizzes collection
    match /quizzes/{quizId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Gemini API may occasionally return improperly formatted JSON (retry mechanism implemented)
- Quiz history loads last 50 quizzes for performance

## 💡 Future Enhancements

- Timer for each question
- Leaderboard system
- Quiz sharing functionality
- Export quiz results as PDF
- Dark mode support
- Multiple language support

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Firebase, and Google Gemini AI

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
