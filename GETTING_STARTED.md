# 🎓 EduGlow - Getting Started Guide

Welcome to EduGlow! This guide will help you get your AI-powered quiz generator up and running in minutes.

## 🌟 What You've Got

A fully-functional quiz generator application with:
- ✨ AI-powered question generation using Google Gemini
- 🔐 Secure user authentication with Firebase
- 📊 Comprehensive quiz history and analytics
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design

## ⚡ Quick Start (5 Minutes)

### Step 1: Configure Environment Variables (2 minutes)

You already have a `.env` file created. Open it and fill in your credentials:

```env
# Get these from Firebase Console
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Get this from Google AI Studio
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 2: Get Firebase Credentials (2 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a project** (or use existing)
3. **Enable Authentication**:
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" provider
4. **Create Firestore Database**:
   - Click "Firestore Database" → "Create database"
   - Select "Test mode" → Choose location → "Enable"
5. **Get Configuration**:
   - Click gear icon ⚙️ → "Project settings"
   - Scroll to "Your apps" → Click web icon `</>`
   - Copy all the config values to your `.env` file

### Step 3: Get Gemini API Key (1 minute)

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key to your `.env` file

### Step 4: Deploy Security Rules

Copy the content from `firestore.rules` and paste it in:
Firebase Console → Firestore Database → Rules tab → Publish

### Step 5: Start the App

```bash
npm run dev
```

Visit: http://localhost:5173

## 🎮 Using the Application

### 1. Create an Account
- Click "Sign Up"
- Enter your name, email, and password
- Click "Sign Up" button

### 2. Generate Your First Quiz
- Click "Start New Quiz" button
- Select a subject (e.g., "Mathematics")
- Enter a topic (e.g., "Quadratic Equations")
- Choose number of questions (try 5 for testing)
- Select difficulty (start with "Medium")
- Click "Generate Quiz"
- Wait for AI to create questions (~5-10 seconds)

### 3. Take the Quiz
- Read each question carefully
- Click on your answer choice
- Click "Next" to move forward
- Click "Previous" to go back and change answers
- Click "Submit Quiz" when done
- Confirm submission

### 4. View Results
- See your score and percentage
- Review each question
- Read explanations for correct answers
- Choose to retake, start new quiz, or go to dashboard

### 5. Track Progress
- View statistics on dashboard
- Check quiz history
- Filter and search past quizzes
- Review any past quiz in detail

## 🎯 Testing Your Setup

### Quick Test Checklist

1. **Authentication Test**:
   - ✅ Sign up with test email
   - ✅ Logout
   - ✅ Login again
   - ✅ Try "Forgot Password"

2. **Quiz Generation Test**:
   - ✅ Configure a quiz with 5 questions
   - ✅ Wait for AI to generate questions
   - ✅ Verify 5 questions appear

3. **Quiz Taking Test**:
   - ✅ Select answers for all questions
   - ✅ Navigate forward and backward
   - ✅ Submit quiz
   - ✅ View results

4. **Dashboard Test**:
   - ✅ Check statistics update
   - ✅ See quiz in recent history
   - ✅ Click "View Details"

## 🔧 Troubleshooting

### "Firebase not initialized"
❌ **Problem**: `.env` file not configured
✅ **Solution**: Fill in all Firebase credentials in `.env`

### "Invalid API key" (Gemini)
❌ **Problem**: Gemini API key incorrect or not set
✅ **Solution**: Get new key from Google AI Studio

### "Permission denied" (Firestore)
❌ **Problem**: Security rules not deployed
✅ **Solution**: Copy `firestore.rules` to Firebase Console

### "Failed to generate questions"
❌ **Problem**: Gemini API issue or rate limit
✅ **Solution**: Wait a few seconds and try again

### Page shows blank or errors
❌ **Problem**: Development server needs restart
✅ **Solution**: Stop server (Ctrl+C) and run `npm run dev` again

## 📱 Supported Features

### Subjects Available
- Mathematics
- Physics
- Chemistry
- Biology
- History
- Geography
- English Literature
- Computer Science
- General Knowledge

### Question Counts
- 5 questions (quick test)
- 10 questions (standard)
- 15 questions (comprehensive)
- 20 questions (full quiz)

### Difficulty Levels
- Easy (basic concepts)
- Medium (standard difficulty)
- Hard (advanced topics)

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Clean, modern interface
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error alerts
- **Progress Tracking**: Visual progress bars
- **Statistics Dashboard**: Track your improvement

## 📊 Understanding Your Stats

### Total Quizzes
- Total number of quizzes you've completed

### Average Score
- Your overall average score across all quizzes
- Calculated as percentage

### Best Score
- Your highest score achieved
- Shown as percentage

### Quiz History
- View all past quizzes
- Filter by subject
- Search by topic
- See detailed results

## 🚀 Pro Tips

1. **Be Specific with Topics**: "Pythagorean Theorem" gets better questions than "Triangles"

2. **Start Easy**: Begin with Easy difficulty to understand question format

3. **Review Explanations**: Read explanations even for correct answers

4. **Track Progress**: Take quizzes regularly and monitor your improvement

5. **Use Different Subjects**: Test your knowledge across various domains

6. **Retake Quizzes**: AI generates new questions each time

## 🎯 Achievement Goals

- [ ] Take your first quiz
- [ ] Score 100% on any quiz
- [ ] Complete 10 quizzes
- [ ] Try all 9 subjects
- [ ] Score 80%+ on Hard difficulty
- [ ] Complete a 20-question quiz
- [ ] Maintain 70%+ average score

## 📞 Need Help?

### Resources
- 📖 **README.md** - Full documentation
- 🔧 **SETUP_GUIDE.md** - Detailed setup instructions
- 🔐 **ENV_SETUP.md** - Environment variables guide
- ✅ **PROJECT_CHECKLIST.md** - Feature list

### Common Questions

**Q: Can I change my answers?**
A: Yes! Use the "Previous" button to go back anytime before submitting.

**Q: How long does quiz generation take?**
A: Usually 5-10 seconds depending on question count.

**Q: Are quizzes saved automatically?**
A: Yes! Once you submit, results are saved to your account.

**Q: Can I retake the same quiz?**
A: Yes, but AI will generate new questions on the same topic.

**Q: Is my data secure?**
A: Yes! Firebase security rules ensure you only access your own data.

## 🎉 You're Ready!

Start generating quizzes and test your knowledge with AI-powered questions!

**Happy Learning! 📚✨**

---

Built with ❤️ using React, Firebase, Tailwind CSS, and Google Gemini AI
