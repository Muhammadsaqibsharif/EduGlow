# Endless Quiz Mode Documentation

## Overview
The Endless Quiz Mode is a challenging game mode where players answer questions starting from super easy difficulty and gradually progressing to harder levels. **One wrong answer ends the game**, and players compete on a global leaderboard to see who can answer the most questions correctly.

## Features

### 1. Progressive Difficulty System
- **Easy Level (Questions 1-5)**: Basic concepts, straightforward questions
- **Medium Level (Questions 6-10)**: Requires understanding and application of concepts
- **Hard Level (Questions 11+)**: Complex scenarios, critical thinking, advanced concepts

The difficulty automatically increases as players answer more questions correctly.

### 2. One Strike Rule
- Players must answer every question correctly to continue
- A single wrong answer immediately ends the quiz
- No second chances - keeps the game challenging and competitive

### 3. Global Leaderboard System
- Scores are automatically saved to a global leaderboard
- Leaderboard can be filtered by:
  - All subjects
  - Specific subject
  - Specific topic
- Shows top 50 players globally
- Displays:
  - Player rank (🥇 🥈 🥉 for top 3)
  - Player name
  - Number of correct answers
  - Time taken
  - Final difficulty reached
  - Subject and topic

### 4. Visual Podium Display
- Top 3 players are showcased on a visual podium
- Gold, Silver, and Bronze styling for the champions
- Makes the leaderboard more engaging and competitive

## How It Works

### Starting an Endless Quiz
1. Navigate to Quiz Configuration
2. Select "Endless Mode 🎮" from the quiz modes
3. Choose your subject and topic
4. Click "Generate Quiz" to start
   - Note: Difficulty selection is disabled as questions always start Easy

### During the Quiz
1. Questions are generated one at a time using AI
2. Each question has 4 multiple-choice options
3. Difficulty increases automatically:
   - Questions 1-5: Easy
   - Questions 6-10: Medium
   - Questions 11+: Hard
4. Real-time stats display:
   - Current question count
   - Current difficulty level
   - Visual difficulty progression indicator
5. Warning banner reminds players: "⚠️ One wrong answer and the quiz ends!"

### After Each Answer
- Correct Answer:
  - Green highlight on correct option
  - Explanation shown
  - Encouragement message with current progress
  - "Next Question →" button appears
  
- Wrong Answer:
  - Red highlight on selected wrong option
  - Green highlight on correct option
  - Game Over notification
  - Final score displayed
  - Automatic redirect to results after 3 seconds

### Results & Leaderboard
After the quiz ends:
1. **Results Card Shows**:
   - Final score (number of questions answered correctly)
   - Player's ranking on the leaderboard
   - Total questions attempted
   - Final difficulty reached
   - Time taken
   - Visual difficulty progression chart

2. **Leaderboard Displays**:
   - Player's position highlighted
   - Top 10 players shown
   - Refresh button to reload latest scores
   - Option to take another quiz or return to dashboard

## Technical Implementation

### Files Created
1. **EndlessQuizTaking.jsx** - Main quiz component
   - Manages quiz state and progression
   - Handles question generation
   - Implements difficulty progression logic
   - Auto-saves score on game over

2. **EndlessQuizResults.jsx** - Results and leaderboard view
   - Displays player's final score
   - Shows player's ranking
   - Lists top players with visual styling
   - Allows filtering and refreshing leaderboard

3. **EndlessLeaderboard.jsx** - Standalone leaderboard page
   - Full leaderboard view accessible from navbar
   - Advanced filtering by subject/topic
   - Top 3 podium display
   - Shows top 50 players

### Database Structure

**Collection: `endlessQuizzes`**
```javascript
{
  userId: string,           // Firebase user ID
  userName: string,         // Display name for leaderboard
  userEmail: string,        // User's email
  subject: string,          // Quiz subject
  topic: string,            // Specific topic
  questions: array,         // All questions with answers
  correctAnswers: number,   // Number of correct answers (score)
  totalQuestions: number,   // Total questions attempted
  finalDifficulty: string,  // Final difficulty reached
  timeTaken: number,        // Time in seconds
  quizType: 'endless',      // Quiz type identifier
  completedAt: timestamp    // Firestore server timestamp
}
```

### Service Functions Added to quizService.js

1. **saveEndlessQuiz(quizData)**
   - Saves completed endless quiz to Firestore
   - Returns quiz document ID

2. **getEndlessLeaderboard(subject, topic, limit)**
   - Retrieves leaderboard entries
   - Filters by subject/topic if provided
   - Orders by correctAnswers (desc), then timeTaken (asc)
   - Defaults to top 50 entries

3. **getAllEndlessTopics()**
   - Retrieves all unique subject-topic combinations
   - Used for leaderboard filtering

4. **getUserBestEndlessScore(userId)**
   - Gets user's best endless quiz performance
   - Can be used for profile displays

### Firestore Security Rules
```javascript
match /endlessQuizzes/{quizId} {
  // Anyone authenticated can read for leaderboard
  allow read: if isAuthenticated();
  
  // Users can only create with their own userId
  allow create: if isAuthenticated() 
                && request.resource.data.userId == request.auth.uid
                && request.resource.data.keys().hasAll([...required fields]);
  
  // Immutable records - no updates or deletes
  allow update, delete: if false;
}
```

## Routes Added

| Route | Component | Description |
|-------|-----------|-------------|
| `/quiz/endless` | EndlessQuizTaking | Active endless quiz session |
| `/quiz/endless/results` | EndlessQuizResults | Results with embedded leaderboard |
| `/leaderboard` | EndlessLeaderboard | Full leaderboard page with filters |

## Navigation Updates

### QuizConfiguration.jsx
- Added "Endless Mode 🎮" option to quiz modes
- Shows special info box explaining endless mode rules
- Hides difficulty selection for endless mode
- Routes to `/quiz/endless` when endless mode selected

### Navbar.jsx
- Added "🏆 Leaderboard" link
- Provides quick access to full leaderboard from anywhere

## User Experience Highlights

1. **Progressive Challenge**: Players feel accomplishment as difficulty increases
2. **High Stakes**: One-strike rule creates tension and excitement
3. **Competitive Element**: Leaderboard drives replayability
4. **Visual Feedback**: Clear indicators of progress and difficulty
5. **Fair Ranking**: Ties broken by time taken (faster is better)
6. **Social Recognition**: Top 3 get special podium display

## Game Strategy Tips (for players)
- Start with easier subjects/topics to build high scores
- Speed matters for tiebreaking - answer quickly but accurately
- Stay focused throughout - one mistake ends everything
- Hard difficulty (10+ questions) is where champions are made

## Future Enhancements (Ideas)
- Daily/Weekly leaderboard resets
- Achievements and badges
- Multiplayer head-to-head mode
- Streak bonuses for consecutive correct answers
- Custom difficulty curves
- Category-specific leaderboards
- Player profiles with stats history

## Testing Checklist
- ✅ Questions start at Easy difficulty
- ✅ Difficulty progresses correctly (5 Easy, 5 Medium, then Hard)
- ✅ Game ends on first wrong answer
- ✅ Score saves to Firestore automatically
- ✅ Leaderboard displays correctly
- ✅ Filtering by subject/topic works
- ✅ Player's own score is highlighted
- ✅ Top 3 podium displays correctly
- ✅ Time tracking is accurate
- ✅ Mobile responsiveness
- ✅ Loading states display properly
- ✅ Error handling for failed API calls

## Performance Considerations
- Questions generated one at a time (reduces initial load)
- Leaderboard limited to 50 entries (prevents large queries)
- Firestore indexes required for efficient leaderboard queries
- Real-time updates not implemented (reduces costs)

## Required Firestore Indexes
```
Collection: endlessQuizzes
- correctAnswers (Descending) + timeTaken (Ascending)
- subject (Ascending) + correctAnswers (Descending) + timeTaken (Ascending)
- subject (Ascending) + topic (Ascending) + correctAnswers (Descending) + timeTaken (Ascending)
```

Firebase will prompt to create these indexes automatically on first query.
