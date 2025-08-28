# Complete Firebase Setup Guide for Uyghurly App

This guide will walk you through setting up Firebase authentication with email/password and Google sign-in for your Uyghur language learning app.

## 🚀 Quick Start

1. **Create Firebase Project** → **Enable Authentication** → **Set up Firestore** → **Configure Environment Variables** → **Test the App**

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Basic understanding of web development

## 🔥 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter your project name: `uyghurly` (or your preferred name)
4. **Optional**: Enable Google Analytics (recommended for production)
5. Click **"Create project"**
6. Wait for project creation to complete

## 🔐 Step 2: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:

### Email/Password Authentication

- Click on **"Email/Password"**
- Toggle **"Enable"** to ON
- Check **"Email link (passwordless sign-in)"** if you want passwordless login
- Click **"Save"**

### Google Authentication

- Click on **"Google"**
- Toggle **"Enable"** to ON
- Enter a **Project support email** (your email)
- Click **"Save"**

## 🗄️ Step 3: Set up Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development (you can secure it later)
4. Select a **location** close to your users (e.g., `us-central1` for US)
5. Click **"Done"**

## ⚙️ Step 4: Get Your Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview" to open Project Settings
2. Scroll down to **"Your apps"** section
3. Click the **web app icon** (</>) to add a web app
4. Register your app with a nickname: `uyghurly-web`
5. **Copy the configuration object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};
```

## 🔧 Step 5: Configure Environment Variables

1. In your project root directory, create a file called `.env.local`
2. Add the following content, replacing the values with your actual Firebase configuration:

```env
# Firebase Configuration
# Replace these values with your actual Firebase project configuration
# You can find these values in your Firebase Console > Project Settings > General > Your apps

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Example (replace with your actual values):
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uyghurly-12345.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=uyghurly-12345
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=uyghurly-12345.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
# NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## 🛡️ Step 6: Security Rules (Optional but Recommended)

For production, set up proper Firestore security rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read lesson data
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
    }

    // Allow authenticated users to read quiz data
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## 🧪 Step 7: Test Your Setup

1. **Restart your development server** after adding `.env.local`:

   ```bash
   npm run dev
   ```

2. **Test Account Creation**:

   - Go to your app's login page
   - Click "Don't have an account? Sign up"
   - Create an account with a strong password (8+ chars, number, letter, capital)
   - Verify the password strength indicator works

3. **Test Login**:

   - Sign out and sign back in with your credentials
   - Verify you're redirected to the home page

4. **Test Google Sign-in**:

   - Click "Continue with Google"
   - Complete the Google authentication flow
   - Verify you're signed in

5. **Test Guest Mode**:
   - Click "Start Learning Now" (guest mode)
   - Verify you can access the app without authentication

## 🔍 Step 8: Verify Data in Firestore

1. Go to **Firestore Database** in Firebase Console
2. You should see a `users` collection
3. Click on a user document to see their data structure
4. Verify that user profiles, progress, and other data are being stored

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. "Firebase: Error (auth/unauthorized-domain)"

- **Solution**: Add your domain to authorized domains in Firebase Console → Authentication → Settings → Authorized domains

#### 2. "Firebase: Error (auth/popup-closed-by-user)"

- **Solution**: This is normal when users close the Google sign-in popup. The error is handled gracefully.

#### 3. "Firebase: Error (auth/network-request-failed)"

- **Solution**: Check your internet connection and Firebase project status

#### 4. Environment variables not loading

- **Solution**:
  - Ensure `.env.local` is in the project root
  - Restart your development server
  - Check that variable names start with `NEXT_PUBLIC_`

#### 5. Google sign-in not working

- **Solution**:
  - Verify Google provider is enabled in Authentication
  - Check that your domain is authorized
  - Ensure you're not in an incognito/private browsing mode

#### 6. Firestore permission errors

- **Solution**: Check your security rules and ensure they allow the operations you're trying to perform

## 📱 Production Deployment

When deploying to production:

1. **Update security rules** to be more restrictive
2. **Enable additional authentication providers** if needed
3. **Set up proper domain restrictions**
4. **Monitor usage and costs** in Firebase Console
5. **Set up backup and monitoring**

## 🎯 Features Now Available

✅ **Email/Password Authentication**

- User registration with strong password validation
- User login with email or username
- Password strength indicator
- Secure password requirements (8+ chars, number, letter, capital)

✅ **Google Authentication**

- One-click Google sign-in
- Automatic user profile creation
- Seamless integration with existing accounts

✅ **User Management**

- User profiles stored in Firestore
- Progress tracking and learning history
- Session persistence
- Secure logout

✅ **Guest Mode**

- Local storage-based guest access
- No authentication required
- Progress saved locally

✅ **Error Handling**

- Comprehensive error messages
- User-friendly feedback
- Graceful fallbacks

## 🔗 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Need Help?

If you encounter issues:

1. Check the Firebase Console for error logs
2. Verify your environment variables are correct
3. Ensure all authentication providers are enabled
4. Check that your domain is authorized
5. Review the troubleshooting section above

Your Uyghur language learning app is now fully configured with Firebase authentication! 🎉
