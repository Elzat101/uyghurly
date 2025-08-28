// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { isStaticExport } from "@/utils/platform";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

// Initialize Firebase only if we have valid config and not in static export
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (!isStaticExport() && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    //const analytics = getAnalytics(app);

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Google Auth Provider
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else if (isStaticExport()) {
  console.log("Firebase disabled for static export (iOS build)");
}

// Export with fallbacks for static export
export { app, auth, db, googleProvider };

export default app;
