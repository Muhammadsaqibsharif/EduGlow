# Dynamic Quiz System - Implementation Guide

## 🎯 Overview

The Dynamic Quiz System is an adaptive learning feature that adjusts question difficulty based on user performance in real-time. Users must achieve **5 correct answers in a row** to complete the quiz.

---

## 🆕 New Features

### 1. **Adaptive Difficulty System**
- Questions adjust difficulty based on previous answers
- **Correct Answer** → Next question becomes **harder**
- **Wrong Answer** → Next question becomes **easier**
- Difficulty levels: Easy → Medium → Hard

### 2. **Streak Tracking**
- **Correct answer**: Streak +1
- **Wrong answer**: Streak -1 (minimum 0)
- **Goal**: Reach 5 correct answers in a row

### 3. **One Question at a Time**
- Questions are generated dynamically
- No pre-loading of all questions
- Fresh AI-generated questions based on current difficulty

### 4. **Win Condition**
- Quiz auto-completes when streak reaches 5
- Players can continue after mistakes until they reach the goal
- No maximum question limit

---

## 📁 Files Modified/Created

### **New Files:**
1. `src/components/Quiz/DynamicQuizTaking.jsx` - Main dynamic quiz component

### **Modified Files:**
1. `src/components/Quiz/QuizConfiguration.jsx` - Added quiz mode selector
2. `src/services/geminiService.js` - Added `generateSingleQuestion()` function
3. `src/services/quizService.js` - Added `saveDynamicQuiz()` function
4. `src/components/Quiz/QuizResults.jsx` - Updated to handle dynamic quiz results
5. `src/components/Dashboard/Dashboard.jsx` - Added dynamic quiz indicators
6. `src/components/Dashboard/QuizHistory.jsx` - Updated to display dynamic quiz data
7. `src/App.jsx` - Added `/quiz/dynamic` route

---

## 🎮 How to Use

### **For Users:**

1. **Start a Quiz**
   - Go to Quiz Configuration page
   - Select "Dynamic Quiz" mode
   - Choose subject, topic, and starting difficulty
   - Click "Generate Quiz"

2. **Taking the Quiz**
   - Answer one question at a time
   - View immediate feedback after each answer
   - Track your streak progress at the top
   - Continue until you reach 5 correct in a row

3. **Progress Indicators**
   - **Current Streak**: Shows your current streak (target: 5)
   - **Correct**: Total correct answers
   - **Wrong**: Total wrong answers
   - **Difficulty Badge**: Shows current question difficulty

4. **Completing the Quiz**
   - **Win**: Reach 5 correct answers in a row
   - **Quit**: Exit anytime (progress saved)

### **For Developers:**

#### **Quiz Flow:**
```
Configuration Page
    ↓
Select Dynamic Mode
    ↓
DynamicQuizTaking Component
    ↓
Generate Single Question (AI)
    ↓
User Answers
    ↓
Immediate Feedback
    ↓
Update Streak & Difficulty
    ↓
Generate Next Question
    ↓
Repeat until 5C streak
    ↓
Save to Firebase
    ↓
Results Page
```

---

## 🔧 Key Functions

### **1. generateSingleQuestion() - geminiService.js**
```javascript
generateSingleQuestion({ 
  subject, 
  topic, 
  difficulty, 
  previousQuestions 
})
```
- Generates one question at a time
- Avoids repeating previous questions
- Returns question with specific difficulty

### **2. saveDynamicQuiz() - quizService.js**
```javascript
saveDynamicQuiz({
  userId,
  subject,
  topic,
  startingDifficulty,
  questions,
  correctAnswers,
  wrongAnswers,
  totalQuestions,
  finalStreak,
  completed,
  timeTaken
})
```
- Saves dynamic quiz with `quizType: 'dynamic'`
- Tracks streak and completion status

### **3. Streak Logic - DynamicQuizTaking.jsx**
```javascript
if (correct) {
  setStreak(prev => prev + 1);
  if (streak + 1 >= TARGET_STREAK) {
    handleQuizComplete(true); // Win!
  }
} else {
  setStreak(prev => Math.max(0, prev - 1));
}
```

### **4. Difficulty Adjustment**
```javascript
const getDifficultyLevel = (currentLevel, wasCorrect) => {
  // Easy → Medium → Hard (if correct)
  // Hard → Medium → Easy (if wrong)
}
```

---

## 📊 Data Structure

### **Dynamic Quiz Data (Firebase):**
```javascript
{
  userId: "user123",
  subject: "Mathematics",
  topic: "Algebra",
  startingDifficulty: "Medium",
  questions: [
    {
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      explanation: "2+2 equals 4",
      difficulty: "Easy",
      userAnswer: 1,
      wasCorrect: true
    },
    // ... more questions
  ],
  correctAnswers: 5,
  wrongAnswers: 2,
  totalQuestions: 7,
  finalStreak: 5,
  completed: true,
  timeTaken: 180,
  quizType: "dynamic",
  completedAt: Timestamp
}
```

---

## 🎨 UI Components

### **Quiz Mode Selector** (QuizConfiguration)
- Radio button style selection
- Standard Quiz vs Dynamic Quiz
- Clear descriptions for each mode

### **Streak Progress Bar** (DynamicQuizTaking)
- Visual progress indicator
- Shows current/target (e.g., 3/5)
- Color-coded gradient

### **Stats Cards** (DynamicQuizTaking)
- Current Streak (blue)
- Correct Answers (green)
- Wrong Answers (red)

### **Difficulty Badge**
- Easy: Green
- Medium: Yellow
- Hard: Red

### **Results Page** (QuizResults)
- Shows "Dynamic Quiz" badge
- Displays final streak
- Shows "Won!" status if completed
- Per-question difficulty indicators

---

## 🔍 Testing Checklist

- [ ] **Start Dynamic Quiz** from configuration page
- [ ] **Answer Correct** - verify streak increases, difficulty goes up
- [ ] **Answer Wrong** - verify streak decreases, difficulty goes down
- [ ] **Reach 5 Streak** - verify auto-completion with win status
- [ ] **Quit Early** - verify progress saves
- [ ] **View Results** - verify dynamic quiz indicators show
- [ ] **Check Dashboard** - verify dynamic quiz badge displays
- [ ] **Check History** - verify dynamic quiz shows in list with proper info
- [ ] **View Details** - verify streak, difficulty per question displays

---

## 🎯 Example User Journey

**Scenario: User takes a Dynamic Math Quiz**

```
1. Configuration:
   - Mode: Dynamic Quiz
   - Subject: Mathematics
   - Topic: Algebra
   - Starting Difficulty: Medium

2. Question Progression:
   Q1 (Medium) → ✅ Correct → Streak: 1 → Next: Hard
   Q2 (Hard) → ❌ Wrong → Streak: 0 → Next: Medium
   Q3 (Medium) → ✅ Correct → Streak: 1 → Next: Hard
   Q4 (Hard) → ✅ Correct → Streak: 2 → Next: Hard
   Q5 (Hard) → ✅ Correct → Streak: 3 → Next: Hard
   Q6 (Hard) → ✅ Correct → Streak: 4 → Next: Hard
   Q7 (Hard) → ✅ Correct → Streak: 5 → 🎉 WIN!

3. Results:
   - Total Questions: 7
   - Correct: 6
   - Wrong: 1
   - Final Streak: 5
   - Status: Won! 🏆
```

---

## 🚀 Future Enhancements

### Potential Features:
1. **Configurable Target Streak** (e.g., 3, 5, 7, 10)
2. **Time-based Difficulty** (harder if answered quickly)
3. **Topic Adaptation** (switch topics based on weak areas)
4. **Leaderboards** (fastest time to 5 streak)
5. **Achievements** (badges for streaks, difficulty levels)
6. **Practice Mode** (no streak required, just learning)
7. **Multiplayer Challenge** (compete for highest streak)

---

## 🐛 Troubleshooting

### **Issue: Questions not loading**
- Check Gemini API key in `.env`
- Verify `generateSingleQuestion()` function works
- Check browser console for errors

### **Issue: Streak not updating**
- Verify state management in `DynamicQuizTaking.jsx`
- Check `handleSubmitAnswer()` logic

### **Issue: Quiz not saving**
- Check Firebase connection
- Verify `saveDynamicQuiz()` function
- Check Firestore rules allow writes

### **Issue: Results page not showing dynamic data**
- Verify `quizType: 'dynamic'` is set in saved data
- Check `QuizResults.jsx` conditional rendering

---

## 📝 Notes

- Dynamic quizzes use more API calls (one per question) vs standard quizzes (all at once)
- Questions are unique per session (no repeats)
- Streak resets to max(0, streak-1) on wrong answer, not to zero
- Users can quit and resume is not supported (fresh start each time)
- Difficulty never exceeds "Hard" or goes below "Easy"

---

## ✅ Summary

The Dynamic Quiz System successfully implements:
- ✅ One question at a time generation
- ✅ Adaptive difficulty based on answers
- ✅ Streak tracking with +1/-1 logic
- ✅ 5 correct in a row win condition
- ✅ Clean, intuitive UI
- ✅ Firebase integration
- ✅ Results and history tracking
- ✅ Compatible with existing quiz structure

**Enjoy your new adaptive learning experience! 🎓✨**
