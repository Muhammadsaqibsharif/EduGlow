# ⚡ Quick Reference Card

## 🚀 Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔑 Environment Variables (.env)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

## 📍 Application Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/signup` | User registration | No |
| `/login` | User authentication | No |
| `/forgot-password` | Password reset | No |
| `/dashboard` | Main dashboard | Yes |
| `/quiz/configure` | Quiz setup | Yes |
| `/quiz/take` | Take quiz | Yes |
| `/quiz/results` | View results | Yes |
| `/quiz-history` | All quizzes | Yes |
| `/quiz/:id` | Specific quiz | Yes |

## 🎯 Quick Setup (5 Steps)

1. **Firebase Console** → Create project
2. **Enable Auth** → Email/Password
3. **Create Firestore** → Test mode
4. **Get API Key** → Google AI Studio
5. **Update .env** → Save credentials

## 📦 Key Dependencies

- **react**: ^19.1.1
- **firebase**: ^12.3.0
- **@google/generative-ai**: ^0.24.1
- **react-router-dom**: ^7.9.3
- **react-hot-toast**: ^2.6.0
- **tailwindcss**: ^4.1.14

## 🎨 Tailwind Utility Classes

```css
.btn-primary - Primary button style
.btn-secondary - Secondary button style
.input-field - Form input style
.card - Card container
.error-text - Error message style
```

## 🔐 Firebase Collections

### users/{userId}
```javascript
{
  name: string,
  email: string,
  createdAt: timestamp,
  totalQuizzes: number,
  totalScore: number
}
```

### quizzes/{quizId}
```javascript
{
  userId: string,
  subject: string,
  topic: string,
  difficulty: string,
  numberOfQuestions: number,
  questions: array,
  userAnswers: array,
  score: number,
  totalQuestions: number,
  timeTaken: number,
  completedAt: timestamp
}
```

## 🎓 Available Subjects

1. Mathematics
2. Physics
3. Chemistry
4. Biology
5. History
6. Geography
7. English Literature
8. Computer Science
9. General Knowledge

## 📊 Statistics Tracked

- Total Quizzes Taken
- Average Score (%)
- Best Score (%)
- Individual Quiz Results
- Time Taken per Quiz

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Firebase error | Check `.env` credentials |
| Gemini API error | Verify API key |
| Permission denied | Deploy Firestore rules |
| Blank page | Restart dev server |
| Build error | Run `npm install` |

## 📚 Documentation Files

- **README.md** - Complete documentation
- **GETTING_STARTED.md** - Quick start guide
- **SETUP_GUIDE.md** - Detailed setup
- **ENV_SETUP.md** - Environment config
- **PROJECT_CHECKLIST.md** - Features list
- **PROJECT_SUMMARY.md** - Overview

## 🌐 Important URLs

- **Firebase Console**: https://console.firebase.google.com/
- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Local Dev**: http://localhost:5173

## 💡 Pro Tips

1. Be specific with quiz topics
2. Start with Easy difficulty
3. Review explanations thoroughly
4. Track progress regularly
5. Use different subjects

## 🎯 Testing Flow

1. Sign up → Create account
2. Login → Access dashboard
3. Configure → Set quiz parameters
4. Take → Answer questions
5. Results → Review performance
6. History → Track progress

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security Rules Location

File: `firestore.rules`
Deploy: Firebase Console → Firestore → Rules

## ⚙️ Configuration Files

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.js` - Vite configuration
- `.env` - Environment variables
- `firestore.rules` - Database security

## 🎨 Color Palette

- Primary: Blue (600-700)
- Success: Green (600)
- Error: Red (600)
- Neutral: Gray (50-900)

---

**Quick Access**: Keep this file open for instant reference! 🚀
