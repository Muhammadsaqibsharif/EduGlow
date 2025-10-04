# Environment Variables Configuration

## Required Environment Variables

This file contains all the environment variables needed to run the EduGlow application.

### Firebase Configuration

Get these values from Firebase Console → Project Settings → Your apps → Config

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Google Gemini AI API Key

Get your API key from: https://makersuite.google.com/app/apikey

```env
VITE_GEMINI_API_KEY=
```

## Setup Instructions

1. Copy this file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Or on Windows:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Fill in all the values with your actual credentials

3. **IMPORTANT**: Never commit the `.env` file to version control!

## Notes

- All environment variables must start with `VITE_` to be accessible in the Vite app
- The `.env` file is already included in `.gitignore`
- Restart the development server after changing environment variables

## Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Get Firebase configuration
- [ ] Add configuration to `.env`
- [ ] Deploy Firestore security rules

## Gemini API Setup Checklist

- [ ] Visit Google AI Studio
- [ ] Create API key
- [ ] Add API key to `.env`
- [ ] Test API key with a quiz generation

## Verification

To verify your setup is correct:

1. Start the dev server: `npm run dev`
2. Open the browser console
3. Try to sign up - should work without Firebase errors
4. Try to generate a quiz - should work without API errors

If you see errors, double-check:
- All environment variables are set
- API keys are correct and active
- Firebase project is properly configured
