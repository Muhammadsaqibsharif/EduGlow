# EduGlow - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
Open PowerShell in the project directory and run:
```powershell
npm install
```

### Step 2: Set Up Firebase

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add Project"
   - Enter project name: "EduGlow"
   - Follow the setup wizard

2. **Enable Required Services**
   - **Firestore Database**: 
     - Go to Firestore Database → Create Database
     - Choose "Start in production mode"
     - Select a location close to you
   
   - **Authentication**:
     - Go to Authentication → Get Started
     - Enable "Email/Password" provider

3. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>)
   - Register app name: "EduGlow Web"
   - Copy the configuration object

### Step 3: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Select a Google Cloud project (or create new)
4. Copy the API key

### Step 4: Configure Environment

1. Copy `.env.example` to `.env.local`:
```powershell
Copy-Item .env.example .env.local
```

2. Open `.env.local` and fill in your credentials:

```env
# From Firebase Web App Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eduglow-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eduglow-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eduglow-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# From Firebase Service Account (Project Settings → Service Accounts → Generate Key)
FIREBASE_ADMIN_PROJECT_ID=eduglow-xxxxx
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@eduglow-xxxxx.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# From Google AI Studio
GOOGLE_GENAI_API_KEY=AIzaSy...

# App URL (keep as is for local development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run the App

```powershell
npm run dev
```

Open your browser and navigate to: http://localhost:3000

### Step 6: Test the Application

1. **Create an Account**
   - Click "Get Started"
   - Fill in your details
   - Select your grade and subjects

2. **Generate a Quiz**
   - Choose a subject (e.g., Mathematics)
   - Enter a topic (e.g., Algebra)
   - Select difficulty level
   - Click "Generate Quiz with AI"

3. **Take the Quiz**
   - Answer the questions
   - Toggle between English and Urdu explanations
   - Submit when complete

4. **Review Results**
   - View your score
   - Read explanations and hints
   - Track your progress

## 🎯 Key Features to Test

### 1. AI Question Generation
- Try different subjects and topics
- Test all difficulty levels
- Notice how questions adapt to your performance

### 2. Bilingual Support
- Toggle between English (اردو) and Urdu
- Check explanations in both languages
- Verify RTL support for Urdu text

### 3. Progress Tracking
- Complete multiple quizzes
- View performance analytics
- Identify weak areas

### 4. Question History
- Access previously attempted quizzes
- Review past explanations
- Track improvement over time

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'firebase'"
**Solution**: Dependencies not installed
```powershell
npm install
```

### Issue: Firebase connection error
**Solution**: Check environment variables
- Verify all Firebase config values are correct
- Ensure no extra spaces in `.env.local`
- Restart dev server after changes

### Issue: Gemini API error
**Solution**: 
- Confirm API key is valid
- Check if you have remaining quota
- Try generating fewer questions

### Issue: Build errors with TypeScript
**Solution**: Clear cache and rebuild
```powershell
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run dev
```

## 📱 Using the App

### Creating Your Profile
1. Choose your grade level (1-12)
2. Select subjects you're interested in
3. Profile helps personalize your learning path

### Starting a Quiz
1. **Subject**: What you want to study
2. **Topic**: Specific area within subject
3. **Difficulty**: 
   - Easy: Beginner friendly
   - Medium: Intermediate level
   - Hard: Advanced challenges

### Understanding Results
- **Green**: Correct answers
- **Red**: Incorrect answers
- **Explanations**: Why the answer is correct
- **Hints**: Help for next time

### Language Toggle
- Click "اردو" / "English" button
- Switches all explanations and hints
- Useful for bilingual learning

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { 500: '#your-color' },
  secondary: { 500: '#your-color' },
}
```

### Adjusting AI Settings
Edit `lib/ai/gemini.ts`:
```typescript
config: {
  temperature: 0.7,  // Creativity (0-1)
  maxOutputTokens: 4000,  // Response length
}
```

### Number of Questions
In dashboard quiz page, change:
```typescript
const result = await generateQuestions(
  subject,
  topic,
  difficulty,
  10  // Change this number
);
```

## 📊 Data Structure

### User Profile
- uid, email, displayName
- grade, subjectsOfInterest
- createdAt, updatedAt

### Quiz Attempt
- questions, answers, score
- timeSpent, completedAt
- subject, topic

### Progress Data
- totalAttempts, correctAnswers
- averageScore, weakAreas
- recommendedDifficulty

## 🔒 Security Notes

- Never commit `.env.local` to git
- Keep Firebase admin key secure
- Use environment variables for all secrets
- Enable Firebase security rules in production

## 📈 Next Steps

1. **Add More Features**
   - Implement progress page
   - Create history view
   - Add profile management

2. **Improve UI**
   - Add more animations
   - Create loading states
   - Enhance mobile responsiveness

3. **Extend Functionality**
   - Add more subjects
   - Support image questions
   - Include practice mode

## 💡 Tips for Best Results

1. **Be Specific with Topics**
   - Good: "Quadratic Equations"
   - Better: "Solving Quadratic Equations using Formula"

2. **Progress Gradually**
   - Start with Easy difficulty
   - Move up as you improve
   - Let the system adapt to you

3. **Review Explanations**
   - Don't skip explanations
   - Understand why answers are correct
   - Use hints to learn

4. **Track Your Progress**
   - Complete quizzes regularly
   - Monitor weak areas
   - Focus on improvement

## 🤝 Need Help?

- Check the main README.md
- Review Firebase documentation
- Check Gemini API docs
- Create an issue on GitHub

---

**Happy Learning with EduGlow! ✨**
