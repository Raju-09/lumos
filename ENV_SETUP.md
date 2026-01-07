# Lumos Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with these values:

```env
# Firebase Configuration (Already configured with defaults)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC5APPZ7EOWMYTZ2UJaJUmek22glqirGT0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lumos-team.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lumos-team
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lumos-team.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=387295451102
NEXT_PUBLIC_FIREBASE_APP_ID=1:387295451102:web:8277b1f8c1db5cc4662f4f

# Gemini AI API Key (Required for AI features)
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAfd36J-LrQ4WP6AD2rLCQDsLaSQCAlNCc
```

## How to Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and paste it in `.env.local`

## Firebase Firestore Rules

**CRITICAL: You MUST deploy Firestore rules for the app to work!**

1. Open: https://console.firebase.google.com/project/lumos-team/firestore/rules
2. Copy the contents of `firestore.rules` file
3. Paste and click "Publish"

## Quick Rules (Copy this if file is complex):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## After Setup

1. Restart the dev server: `npm run dev`
2. Clear browser localStorage (DevTools → Application → Clear)
3. Login fresh with any role

## Feature Checklist

| Feature | Requires | Status |
|---------|----------|--------|
| Authentication | Firebase Auth | ✅ Configured |
| Drive Creation | Firestore + Rules | Deploy Rules! |
| Student Applications | Firestore + Rules | Deploy Rules! |
| AI Chatbot | Gemini API Key | Add to .env.local |
| Resume Builder | Gemini API Key | Add to .env.local |
| ATS Checker | Gemini API Key | Add to .env.local |
