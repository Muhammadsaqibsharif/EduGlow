# 🎯 Dynamic Quiz Streak Logic - Quick Reference

## 📊 Streak Examples

### Example 1: Clean Win (No Mistakes)
```
Start: Streak = 0, Difficulty = Medium

Q1: ✅ Correct → Streak = 1, Next Difficulty = Hard
Q2: ✅ Correct → Streak = 2, Next Difficulty = Hard
Q3: ✅ Correct → Streak = 3, Next Difficulty = Hard
Q4: ✅ Correct → Streak = 4, Next Difficulty = Hard
Q5: ✅ Correct → Streak = 5, Next Difficulty = Hard
→ 🎉 WIN! Quiz Complete!

Total Questions: 5
Correct: 5, Wrong: 0
```

### Example 2: One Mistake, Then Win
```
Start: Streak = 0, Difficulty = Medium

Q1: ✅ Correct → Streak = 1, Next Difficulty = Hard
Q2: ✅ Correct → Streak = 2, Next Difficulty = Hard
Q3: ❌ Wrong → Streak = 1, Next Difficulty = Medium
Q4: ✅ Correct → Streak = 2, Next Difficulty = Hard
Q5: ✅ Correct → Streak = 3, Next Difficulty = Hard
Q6: ✅ Correct → Streak = 4, Next Difficulty = Hard
Q7: ✅ Correct → Streak = 5, Next Difficulty = Hard
→ 🎉 WIN! Quiz Complete!

Total Questions: 7
Correct: 6, Wrong: 1
```

### Example 3: Multiple Mistakes
```
Start: Streak = 0, Difficulty = Medium

Q1: ✅ Correct → Streak = 1, Next Difficulty = Hard
Q2: ❌ Wrong → Streak = 0, Next Difficulty = Medium
Q3: ✅ Correct → Streak = 1, Next Difficulty = Hard
Q4: ✅ Correct → Streak = 2, Next Difficulty = Hard
Q5: ❌ Wrong → Streak = 1, Next Difficulty = Medium
Q6: ✅ Correct → Streak = 2, Next Difficulty = Hard
Q7: ✅ Correct → Streak = 3, Next Difficulty = Hard
Q8: ✅ Correct → Streak = 4, Next Difficulty = Hard
Q9: ✅ Correct → Streak = 5, Next Difficulty = Hard
→ 🎉 WIN! Quiz Complete!

Total Questions: 9
Correct: 7, Wrong: 2
```

### Example 4: Streak Never Drops Below 0
```
Start: Streak = 0, Difficulty = Medium

Q1: ❌ Wrong → Streak = 0 (not -1!), Next Difficulty = Easy
Q2: ❌ Wrong → Streak = 0, Next Difficulty = Easy
Q3: ✅ Correct → Streak = 1, Next Difficulty = Medium
... continues until 5C
```

---

## 🔢 Streak Formula

### On Correct Answer:
```javascript
newStreak = currentStreak + 1

if (newStreak >= 5) {
  // WIN! Complete quiz
} else {
  // Continue with harder question
}
```

### On Wrong Answer:
```javascript
newStreak = Math.max(0, currentStreak - 1)
// Streak can never go below 0
// Continue with easier question
```

---

## 📈 Difficulty Progression

### When Answer is Correct:
- Easy → Medium
- Medium → Hard
- Hard → Hard (stays at max)

### When Answer is Wrong:
- Hard → Medium
- Medium → Easy
- Easy → Easy (stays at min)

### Code:
```javascript
const difficultyOrder = ['Easy', 'Medium', 'Hard'];

const getDifficultyLevel = (currentLevel, wasCorrect) => {
  const currentIndex = difficultyOrder.indexOf(currentLevel);
  
  if (wasCorrect) {
    // Move up if possible
    return currentIndex < 2 
      ? difficultyOrder[currentIndex + 1] 
      : currentLevel;
  } else {
    // Move down if possible
    return currentIndex > 0 
      ? difficultyOrder[currentIndex - 1] 
      : currentLevel;
  }
};
```

---

## 🎓 Learning Patterns

### Pattern 1: Struggling Student
```
❌❌✅❌✅✅❌✅✅✅✅✅ → WIN after 12 questions
```
- Multiple mistakes early on
- Easier questions help build confidence
- Eventually achieves 5 correct streak

### Pattern 2: Confident Student
```
✅✅✅✅✅ → WIN after 5 questions
```
- No mistakes
- Questions get harder with each correct answer
- Quick completion

### Pattern 3: Oscillating Performance
```
✅✅❌✅✅❌✅✅✅✅✅ → WIN after 11 questions
```
- Some correct, some wrong
- Difficulty adjusts up and down
- System adapts to student's level

---

## 💡 Key Points

1. **Minimum Streak**: Always 0 (never negative)
2. **Target Streak**: 5 correct in a row
3. **No Maximum Questions**: Quiz continues until goal reached
4. **Immediate Feedback**: User sees result after each question
5. **Dynamic Difficulty**: Adjusts based on last answer only
6. **Progress Saved**: Can quit anytime and progress is saved

---

## 🧪 Test Cases

### Test Case 1: Verify Streak Increment
- Start quiz
- Answer correctly
- **Expected**: Streak = 1

### Test Case 2: Verify Streak Decrement
- Have streak = 3
- Answer incorrectly
- **Expected**: Streak = 2

### Test Case 3: Verify No Negative Streak
- Have streak = 0
- Answer incorrectly
- **Expected**: Streak = 0 (not -1)

### Test Case 4: Verify Win Condition
- Reach streak = 5
- **Expected**: Quiz auto-completes with "Won!" status

### Test Case 5: Verify Difficulty Increase
- Start at Medium
- Answer correctly
- **Expected**: Next question is Hard

### Test Case 6: Verify Difficulty Decrease
- Currently at Hard
- Answer incorrectly
- **Expected**: Next question is Medium

### Test Case 7: Verify Difficulty Boundaries
- At Easy, answer incorrectly
- **Expected**: Next question still Easy
- At Hard, answer correctly
- **Expected**: Next question still Hard

---

## 📱 UI Indicators

### Streak Display
```
┌─────────────────────────┐
│   Current Streak: 3     │
│   Target: 5            │
│   [■■■□□]              │
└─────────────────────────┘
```

### Stats Cards
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Streak  │ │ Correct │ │  Wrong  │
│    3    │ │    5    │ │    2    │
└─────────┘ └─────────┘ └─────────┘
```

### Feedback Messages
- ✅ **Correct**: "Great job! Streak: 3. Next question will be harder."
- ❌ **Wrong**: "Your streak decreased from 3 to 2. Next question will be easier."
- 🎉 **Win**: "Amazing! You've reached 5 correct answers in a row!"

---

## 🔄 State Management

### Key State Variables:
```javascript
const [streak, setStreak] = useState(0);
const [currentDifficulty, setCurrentDifficulty] = useState('Medium');
const [correctAnswers, setCorrectAnswers] = useState(0);
const [wrongAnswers, setWrongAnswers] = useState(0);
const [questionHistory, setQuestionHistory] = useState([]);
```

### State Flow:
1. User selects answer
2. Submit answer
3. Check if correct
4. Update streak (+1 if correct, -1 if wrong, min 0)
5. Update counters (correctAnswers or wrongAnswers)
6. Add to questionHistory
7. Check if streak >= 5 (win condition)
8. If not won, calculate next difficulty
9. Generate next question
10. Repeat

---

## 🎯 Summary

The streak system is designed to:
- ✅ Reward consecutive correct answers
- ✅ Provide immediate feedback
- ✅ Adapt difficulty to user's level
- ✅ Motivate users to reach the goal
- ✅ Keep users challenged but not frustrated
- ✅ Track progress transparently

**Remember**: The goal is learning, not just winning! 📚✨
