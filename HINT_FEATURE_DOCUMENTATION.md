# Hint Feature Documentation

## Overview
A hint system has been added to all quiz modes (Normal, Dynamic, and Endless) that uses Google Gemini AI to provide intelligent hints without revealing the answer directly.

## Features

### 🎯 Core Functionality
- **3 Hints Per Question**: Users can request up to 3 progressively helpful hints for each question
- **AI-Powered**: Uses Google Gemini 2.5 Flash to generate contextual, intelligent hints
- **Progressive Difficulty**: Hints become more helpful with each request
  - **Hint 1**: Subtle guidance (general direction or concept)
  - **Hint 2**: Moderate help (eliminate wrong option or provide context)
  - **Hint 3**: Strong hint (narrow down significantly without giving the answer)
- **No Answer Revelation**: Hints guide thinking without directly stating the correct answer

### 📱 User Interface
- **Visual Hint Button**: Located below the answer options with a lightbulb icon
- **Hint Counter**: Shows how many hints used (e.g., "Get Hint (1/3)")
- **Hint Display**: Each hint appears in a yellow-themed card with numbered badges
- **Loading State**: Shows spinner while generating hint
- **Disabled State**: Button disables after 3 hints or when submitting

### 🔄 Mode-Specific Behavior

#### Normal Quiz Mode (`QuizTaking.jsx`)
- Hints persist per question when navigating back/forward
- Stored in state object keyed by question index
- Can review previous hints when returning to a question

#### Dynamic Quiz Mode (`DynamicQuizTaking.jsx`)
- Hints reset when moving to the next question
- Only available before submitting an answer
- Helps maintain challenge progression

#### Endless Quiz Mode (`EndlessQuizTaking.jsx`)
- Hints reset for each new question
- Disabled after game over
- Helps users continue their streak

## Implementation Details

### New Service Function
**File**: `src/services/geminiService.js`

```javascript
generateHint({
  question,      // The question text
  options,       // Array of answer options
  correctAnswer, // Index of correct answer
  hintNumber,    // Which hint (1-3)
  previousHints  // Array of previously given hints
})
```

**Features**:
- Analyzes the question and all options
- Knows the correct answer but doesn't reveal it
- Provides progressively stronger hints
- Avoids repeating previous hints
- Returns concise, helpful guidance (1-2 sentences)

### State Management

Each quiz component now includes:
```javascript
// Hint states
const [hints, setHints] = useState({}); // Normal mode (per question)
const [currentHints, setCurrentHints] = useState([]); // Dynamic/Endless
const [isLoadingHint, setIsLoadingHint] = useState(false);
```

### UI Components Added

**Hint Section** (appears below options, before explanation):
- Header with lightbulb icon and "Need Help?" text
- Button to request hints
- Display area for generated hints with numbered badges
- Yellow color theme for visual distinction

## User Experience

### Requesting a Hint
1. User reads the question and options
2. Clicks "Get Hint (0/3)" button
3. Loading indicator appears
4. Hint generates in ~1-3 seconds
5. Hint appears in yellow card below
6. Button updates to "Get Hint (1/3)"

### Hint Progression Example

**Question**: "What is the capital of France?"
- **Hint 1**: "Think about the most populous city in France, known for its iconic tower."
- **Hint 2**: "This city is located on the Seine River and is not Lyon or Marseille."
- **Hint 3**: "The answer is associated with the Eiffel Tower and the Louvre Museum."

### Error Handling
- Toast notification if hint generation fails
- Graceful fallback with retry message
- Button remains usable after error
- Loading state properly cleared

## Best Practices for Users

✅ **Do**:
- Use hints when genuinely stuck
- Read each hint carefully before requesting the next
- Try to reason through the problem with the hint
- Use hints as learning opportunities

❌ **Don't**:
- Request all hints immediately without thinking
- Rely solely on hints without attempting to answer
- Expect hints to directly give the answer

## Technical Notes

### API Usage
- Each hint request = 1 Gemini API call
- Uses `gemini-2.5-flash` model for speed
- Typical response time: 1-3 seconds
- Token usage: ~200-500 tokens per hint

### Performance
- Hints generated on-demand (not pre-generated)
- Loading state prevents multiple simultaneous requests
- Minimal state overhead
- No impact on quiz save/submit functionality

### Accessibility
- Clear visual feedback for loading/disabled states
- Semantic HTML structure
- Keyboard accessible buttons
- Screen reader friendly labels

## Future Enhancements (Optional)

Potential improvements:
- Track hint usage in quiz results/statistics
- Add hint usage to leaderboard (penalize heavy hint users)
- Allow configuration of hint count per quiz
- Add hint quality feedback mechanism
- Generate hints during initial question generation (faster response)

## Testing Checklist

✅ All quiz modes have hint functionality
✅ Hints limit enforced (max 3 per question)
✅ Hints reset appropriately between questions
✅ Loading states work correctly
✅ Error handling implemented
✅ UI is responsive and accessible
✅ Hints are contextual and helpful
✅ No answer revelation in hints
✅ Progressive hint difficulty working

## Code Files Modified

1. **`src/services/geminiService.js`**
   - Added `generateHint()` function

2. **`src/components/Quiz/QuizTaking.jsx`**
   - Added hint state management
   - Added hint UI section
   - Added `handleGetHint()` function

3. **`src/components/Quiz/DynamicQuizTaking.jsx`**
   - Added hint state management
   - Added hint UI section
   - Added `handleGetHint()` function
   - Reset hints on question change

4. **`src/components/Quiz/EndlessQuizTaking.jsx`**
   - Added hint state management
   - Added hint UI section
   - Added `handleGetHint()` function
   - Reset hints on question change

## Conclusion

The hint feature is now fully integrated across all quiz modes, providing users with AI-powered assistance that helps them learn without simply giving away answers. The implementation is clean, performant, and follows the existing code patterns in the application.
