# Firebase Setup Guide

This project uses Firebase for authentication and user management. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "uyghurly")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable and configure
   - **Google**: Enable and configure (add your authorized domain)

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

## 4. Get Your Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web app icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the configuration object

## 5. Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## 6. Security Rules (Optional)

For production, you should set up proper Firestore security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try creating an account with email/password
3. Try signing in with Google
4. Check that user data is being stored in Firestore

## Features Implemented

- ✅ Email/Password authentication
- ✅ Google Sign-in
- ✅ User account creation and management
- ✅ Guest mode (local storage)
- ✅ User data storage in Firestore
- ✅ Proper error handling
- ✅ Session persistence

## Troubleshooting

- **Google Sign-in not working**: Make sure you've added your domain to authorized domains in Firebase Auth settings
- **Firestore permission errors**: Check your security rules
- **Environment variables not loading**: Restart your development server after adding `.env.local`
