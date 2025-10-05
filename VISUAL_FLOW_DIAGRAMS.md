# 📊 Dynamic Quiz System - Visual Flow Diagrams

## 🎯 Overall System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      EduGlow Quiz App                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Standard   │         │   Dynamic    │                 │
│  │     Quiz     │         │     Quiz     │ ← NEW!          │
│  │              │         │              │                 │
│  │ • Fixed Qs   │         │ • Adaptive   │                 │
│  │ • Pre-gen    │         │ • One-by-one │                 │
│  │ • Set Diff   │         │ • Streak Goal│                 │
│  └──────────────┘         └──────────────┘                 │
│         ↓                        ↓                          │
│  ┌─────────────────────────────────────────┐               │
│  │        Unified Results System           │               │
│  │     (Handles both quiz types)           │               │
│  └─────────────────────────────────────────┘               │
│         ↓                                                   │
│  ┌─────────────────────────────────────────┐               │
│  │        Firebase Storage                 │               │
│  │    (quizzes collection)                 │               │
│  └─────────────────────────────────────────┘               │
│         ↓                                                   │
│  ┌─────────────────────────────────────────┐               │
│  │   Dashboard & History Views             │               │
│  │  (Shows both quiz types)                │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Dynamic Quiz Flow

```
START
  │
  ├─→ [Configuration Page]
  │     │
  │     ├─ Select "Dynamic Quiz" mode
  │     ├─ Choose Subject (e.g., Math)
  │     ├─ Choose Topic (e.g., Algebra)
  │     └─ Choose Starting Difficulty (Easy/Medium/Hard)
  │
  ↓
  ├─→ [Navigate to /quiz/dynamic]
  │     │
  │     └─ DynamicQuizTaking component mounts
  │
  ↓
  ├─→ [Initialize State]
  │     │
  │     ├─ streak = 0
  │     ├─ correctAnswers = 0
  │     ├─ wrongAnswers = 0
  │     ├─ questionHistory = []
  │     └─ currentDifficulty = config.difficulty
  │
  ↓
  ├─→ [Generate First Question]
  │     │
  │     └─ Call Gemini API with:
  │           - subject
  │           - topic
  │           - difficulty
  │           - previousQuestions = []
  │
  ↓
  ┌─────────────────────────────────────┐
  │    MAIN QUIZ LOOP (Repeats)        │
  │                                     │
  │  ┌─→ [Display Question]            │
  │  │     │                            │
  │  │     ├─ Show question text        │
  │  │     ├─ Show 4 options (A-D)      │
  │  │     ├─ Show current streak       │
  │  │     ├─ Show stats cards          │
  │  │     └─ Show difficulty badge     │
  │  │                                  │
  │  ├─→ [User Selects Answer]         │
  │  │     │                            │
  │  │     └─ Option highlighted        │
  │  │                                  │
  │  ├─→ [User Submits Answer]         │
  │  │     │                            │
  │  │     ├─ Check if correct          │
  │  │     ├─ Show immediate feedback   │
  │  │     └─ Show explanation          │
  │  │                                  │
  │  ├─→ [Update Streak]               │
  │  │     │                            │
  │  │     ├─ If Correct:               │
  │  │     │   ├─ streak++              │
  │  │     │   └─ correctAnswers++      │
  │  │     │                            │
  │  │     └─ If Wrong:                 │
  │  │         ├─ streak = max(0, s-1)  │
  │  │         └─ wrongAnswers++        │
  │  │                                  │
  │  ├─→ [Check Win Condition]         │
  │  │     │                            │
  │  │     ├─ If streak >= 5:           │
  │  │     │   └─→ GO TO [WIN!]         │
  │  │     │                            │
  │  │     └─ If streak < 5:            │
  │  │         └─→ CONTINUE LOOP        │
  │  │                                  │
  │  ├─→ [Calculate Next Difficulty]   │
  │  │     │                            │
  │  │     ├─ If Correct:               │
  │  │     │   └─ Increase difficulty   │
  │  │     │      (Easy→Med→Hard)       │
  │  │     │                            │
  │  │     └─ If Wrong:                 │
  │  │         └─ Decrease difficulty   │
  │  │            (Hard→Med→Easy)       │
  │  │                                  │
  │  ├─→ [Generate Next Question]      │
  │  │     │                            │
  │  │     └─ Call Gemini API with:    │
  │  │           - new difficulty       │
  │  │           - previousQuestions    │
  │  │                                  │
  │  └─→ [Loop Back to Display]        │
  │                                     │
  └─────────────────────────────────────┘
        │
        ↓
  ┌─────────────────────┐
  │      [WIN!]         │
  │                     │
  │  - streak = 5       │
  │  - Show celebration │
  │  - Save to Firebase │
  │  - Navigate results │
  └─────────────────────┘
        │
        ↓
  [Results Page]
        │
        ├─ Show final stats
        ├─ Show "Won!" badge
        ├─ Show final streak
        ├─ Review all questions
        └─ Option to retake/new quiz
        │
        ↓
      END
```

---

## 📊 Streak State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                   Streak State Machine                       │
└─────────────────────────────────────────────────────────────┘

         ┌─────────────┐
    ┌────│  Streak: 0  │◄────┐
    │    └─────────────┘     │
    │         │              │
    │         │✅            │❌
    │         ↓              │
    │    ┌─────────────┐     │
    ├────│  Streak: 1  │─────┤
    │    └─────────────┘     │
    │         │              │
    │         │✅            │❌
    │         ↓              │
    │    ┌─────────────┐     │
    ├────│  Streak: 2  │─────┤
    │    └─────────────┘     │
    │         │              │
    │         │✅            │❌
    │         ↓              │
    │    ┌─────────────┐     │
    ├────│  Streak: 3  │─────┤
    │    └─────────────┘     │
    │         │              │
    │         │✅            │❌
    │         ↓              │
    │    ┌─────────────┐     │
    └────│  Streak: 4  │─────┘
         └─────────────┘
              │
              │✅
              ↓
         ┌─────────────┐
         │  Streak: 5  │
         │   🎉 WIN!   │
         └─────────────┘
              │
              ↓
         [Complete Quiz]

Legend:
  ✅ = Correct Answer → Streak +1
  ❌ = Wrong Answer → Streak -1 (min 0)
```

---

## 🎚️ Difficulty Progression Graph

```
┌─────────────────────────────────────────────────────────────┐
│              Difficulty Progression                          │
└─────────────────────────────────────────────────────────────┘

    Hard    ◄──────┬──────► Hard
             ❌    │    ✅
                   │
    Medium  ◄──────┼──────► Hard
             ❌    │    ✅
                   │
    Easy    ◄──────┼──────► Medium
             ❌    │    ✅
                   │
    Easy    ◄──────┴──────► Medium


Transition Rules:
┌─────────────┬─────────────┬──────────────┐
│ Current     │ If Correct  │ If Wrong     │
├─────────────┼─────────────┼──────────────┤
│ Easy        │ Medium      │ Easy         │
│ Medium      │ Hard        │ Easy         │
│ Hard        │ Hard        │ Medium       │
└─────────────┴─────────────┴──────────────┘
```

---

## 📈 Example Quiz Journey

```
┌─────────────────────────────────────────────────────────────┐
│          Example: User Quiz Journey                          │
└─────────────────────────────────────────────────────────────┘

Start: Difficulty = Medium, Streak = 0

Q1: [Medium] "What is 2x + 4 = 10?"
    User: ✅ Correct
    Result: Streak = 1, Next = Hard
    ────────────────────────────────────

Q2: [Hard] "Solve: 3x² - 12x + 9 = 0"
    User: ❌ Wrong
    Result: Streak = 0, Next = Medium
    ────────────────────────────────────

Q3: [Medium] "Simplify: 4(x + 3)"
    User: ✅ Correct
    Result: Streak = 1, Next = Hard
    ────────────────────────────────────

Q4: [Hard] "Factor: x² - 5x + 6"
    User: ✅ Correct
    Result: Streak = 2, Next = Hard
    ────────────────────────────────────

Q5: [Hard] "Solve: |2x - 3| = 7"
    User: ✅ Correct
    Result: Streak = 3, Next = Hard
    ────────────────────────────────────

Q6: [Hard] "Find domain: f(x) = 1/(x-2)"
    User: ✅ Correct
    Result: Streak = 4, Next = Hard
    ────────────────────────────────────

Q7: [Hard] "Solve system: 2x+y=5, x-y=1"
    User: ✅ Correct
    Result: Streak = 5 → 🎉 WIN!
    ────────────────────────────────────

Final Stats:
  Total Questions: 7
  Correct: 6
  Wrong: 1
  Final Streak: 5
  Status: Won! 🏆
```

---

## 🗄️ Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Flow                                 │
└─────────────────────────────────────────────────────────────┘

[User Input]
     │
     ↓
[QuizConfiguration Component]
     │
     ├─ config = {
     │    subject: "Math",
     │    topic: "Algebra",
     │    difficulty: "Medium",
     │    quizMode: "dynamic"
     │  }
     │
     ↓
[Navigate to /quiz/dynamic with state]
     │
     ↓
[DynamicQuizTaking Component]
     │
     ├─→ [geminiService.generateSingleQuestion()]
     │      │
     │      ├─ Input: { subject, topic, difficulty, prevQuestions }
     │      ├─ API Call: Google Gemini AI
     │      └─ Output: { question, options, correctAnswer, explanation }
     │
     ├─→ [User Interaction]
     │      │
     │      ├─ Select answer
     │      ├─ Submit
     │      └─ View feedback
     │
     ├─→ [State Updates]
     │      │
     │      ├─ streak
     │      ├─ correctAnswers
     │      ├─ wrongAnswers
     │      ├─ questionHistory
     │      └─ currentDifficulty
     │
     └─→ [Check Win Condition]
            │
            └─ If won or quit:
               │
               ↓
         [quizService.saveDynamicQuiz()]
               │
               ├─ Data: {
               │    userId,
               │    questions,
               │    correctAnswers,
               │    wrongAnswers,
               │    finalStreak,
               │    completed,
               │    ...
               │  }
               │
               ↓
         [Firebase Firestore]
               │
               └─ Saved to 'quizzes' collection
               │
               ↓
         [Navigate to /quiz/results]
               │
               ↓
         [QuizResults Component]
               │
               ├─ Display stats
               ├─ Show badge
               └─ Review questions
               │
               ↓
         [Dashboard/History]
               │
               └─ Display in list with indicators
```

---

## 🎨 UI Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│              Component Hierarchy                             │
└─────────────────────────────────────────────────────────────┘

App.jsx
  │
  ├─ Router
  │   │
  │   ├─ Route: /quiz/configure
  │   │   └─ QuizConfiguration
  │   │       │
  │   │       ├─ Quiz Mode Selector
  │   │       │   ├─ Standard Option
  │   │       │   └─ Dynamic Option ← NEW
  │   │       │
  │   │       ├─ Subject Dropdown
  │   │       ├─ Topic Input
  │   │       ├─ Difficulty Dropdown
  │   │       └─ Generate Button
  │   │
  │   ├─ Route: /quiz/dynamic ← NEW
  │   │   └─ DynamicQuizTaking
  │   │       │
  │   │       ├─ Stats Cards
  │   │       │   ├─ Streak Card
  │   │       │   ├─ Correct Card
  │   │       │   └─ Wrong Card
  │   │       │
  │   │       ├─ Progress Bar
  │   │       │   └─ Shows streak/target
  │   │       │
  │   │       ├─ Question Display
  │   │       │   ├─ Question Text
  │   │       │   ├─ Difficulty Badge
  │   │       │   └─ 4 Options (A-D)
  │   │       │
  │   │       ├─ Feedback Panel
  │   │       │   ├─ Correct/Wrong Icon
  │   │       │   ├─ Explanation
  │   │       │   └─ Streak Message
  │   │       │
  │   │       └─ Action Buttons
  │   │           ├─ Quit Button
  │   │           ├─ Submit Button
  │   │           └─ Next Button
  │   │
  │   ├─ Route: /quiz/results
  │   │   └─ QuizResults (Updated)
  │   │       │
  │   │       ├─ Dynamic Badge (if dynamic)
  │   │       ├─ Score Display
  │   │       ├─ Streak Display (if dynamic)
  │   │       └─ Question Review
  │   │           └─ Difficulty per Q (if dynamic)
  │   │
  │   ├─ Route: /dashboard
  │   │   └─ Dashboard (Updated)
  │   │       │
  │   │       └─ Recent Quizzes Table
  │   │           └─ Dynamic Badges
  │   │
  │   └─ Route: /quiz-history
  │       └─ QuizHistory (Updated)
  │           │
  │           ├─ Quiz List
  │           │   └─ Dynamic Indicators
  │           │
  │           └─ Detail View
  │               └─ Streak & Difficulty Info
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│          State Management in DynamicQuizTaking               │
└─────────────────────────────────────────────────────────────┘

Initial State:
┌─────────────────────────────┐
│ streak: 0                   │
│ currentDifficulty: "Medium" │
│ currentQuestion: null       │
│ selectedOption: null        │
│ isAnswered: false           │
│ isCorrect: false            │
│ questionHistory: []         │
│ correctAnswers: 0           │
│ wrongAnswers: 0             │
└─────────────────────────────┘
         │
         ↓
    [useEffect]
         │
         └─→ loadNextQuestion()
                  │
                  ↓
┌─────────────────────────────┐
│ currentQuestion: {...}      │  ← API Response
│ isLoading: false            │
└─────────────────────────────┘
         │
         ↓
    [User Selects]
         │
         └─→ handleOptionSelect()
                  │
                  ↓
┌─────────────────────────────┐
│ selectedOption: 2           │
└─────────────────────────────┘
         │
         ↓
    [User Submits]
         │
         └─→ handleSubmitAnswer()
                  │
                  ├─→ Check Correct
                  │
                  ├─→ Update State
                  │       │
                  │       ↓
                  │ ┌─────────────────────────────┐
                  │ │ isAnswered: true            │
                  │ │ isCorrect: true/false       │
                  │ │ streak: updated             │
                  │ │ correctAnswers: updated     │
                  │ │ wrongAnswers: updated       │
                  │ │ questionHistory: [..., new] │
                  │ └─────────────────────────────┘
                  │
                  └─→ Check Win
                       │
                       ├─ If streak >= 5:
                       │   └─→ handleQuizComplete(true)
                       │
                       └─ Else:
                           └─→ Wait for Next button
                                    │
                                    ↓
                              [handleNextQuestion]
                                    │
                                    └─→ loadNextQuestion()
                                           │
                                           └─→ Loop back
```

---

## 🎯 Summary Diagram

```
┌─────────────────────────────────────────────────────────────┐
│       Dynamic Quiz System - Complete Overview               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  USER FLOW:                                                 │
│  Configure → Take Quiz → Answer → Feedback → Next          │
│     → Repeat until 5 streak → Results → Dashboard          │
│                                                              │
│  KEY FEATURES:                                              │
│  ✓ Adaptive difficulty (Easy ↔ Medium ↔ Hard)             │
│  ✓ Streak tracking (0 to 5)                                │
│  ✓ One question at a time                                  │
│  ✓ Immediate feedback                                      │
│  ✓ Win condition (5C)                                      │
│                                                              │
│  TECH STACK:                                                │
│  • React (Hooks, Router)                                   │
│  • Firebase (Firestore)                                    │
│  • Google Gemini AI                                        │
│  • Tailwind CSS                                            │
│                                                              │
│  COMPONENTS:                                                │
│  • DynamicQuizTaking (main)                                │
│  • QuizConfiguration (updated)                             │
│  • QuizResults (updated)                                   │
│  • Dashboard (updated)                                     │
│  • QuizHistory (updated)                                   │
│                                                              │
│  SERVICES:                                                  │
│  • geminiService.generateSingleQuestion()                  │
│  • quizService.saveDynamicQuiz()                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

*Visual diagrams to help understand the Dynamic Quiz System implementation*
