"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, googleProvider } from "@/lib/firebase";
import { userService } from "@/lib/userService";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProgress: (
    unitId: string,
    progress: {
      lessonCompleted?: boolean;
      quizCompleted?: boolean;
      quizScore?: number;
      completedAt?: string;
    }
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // Check if Firebase auth is available (disabled in iOS builds)
    if (!auth) {
      console.log("Firebase auth not available, skipping authentication check");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        try {
          // Check if user exists in our Firestore database
          const userData = await userService.getUserByEmail(
            firebaseUser.email!
          );

          if (userData) {
            // User exists in our database
            setUser({
              id: userData.id,
              name: userData.name,
              username: userData.username,
              email: userData.email,
              isGuest: false,
            });
            // Update last login time
            await userService.updateLastLogin(userData.id);
          } else {
            // Firebase user exists but not in our database - create the missing user document
            console.log(
              "User exists in Firebase but not in Firestore, creating user document..."
            );
            try {
              const newUserData = await userService.createUser({
                name:
                  firebaseUser.displayName || firebaseUser.email!.split("@")[0],
                username:
                  firebaseUser.displayName || firebaseUser.email!.split("@")[0],
                email: firebaseUser.email!,
                isGuest: false,
              });

              setUser({
                id: newUserData.id,
                name: newUserData.name,
                username: newUserData.username,
                email: newUserData.email,
                isGuest: false,
              });
            } catch (createError) {
              console.error(
                "Failed to create missing user document:",
                createError
              );
              // If we can't create the user document, sign them out
              if (auth) {
                await signOut(auth);
              }
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        // Check for guest user in AsyncStorage
        try {
          const savedUser = await AsyncStorage.getItem("uyghurly_guest_user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error reading from AsyncStorage:", error);
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error(
        "Authentication is not available in this version. Please use the web version for full functionality."
      );
    }

    setIsLoading(true);
    try {
      // Validate that the input looks like an email
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      // Sign in with Firebase using the email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Now that we're authenticated, we can safely query Firestore
      let userData: User | null;
      try {
        userData = await userService.getUserByEmail(firebaseUser.email!);
      } catch (dbError) {
        console.log("Database lookup failed after auth:", dbError);
        // Create a basic user object from Firebase auth data
        userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email!.split("@")[0],
          username:
            firebaseUser.displayName || firebaseUser.email!.split("@")[0],
          email: firebaseUser.email!,
          isGuest: false,
        };
      }

      // Ensure userData exists before using it
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          isGuest: false,
        });

        // Update last login time if we have a valid user ID
        if (userData.id && userData.id !== firebaseUser.uid) {
          try {
            await userService.updateLastLogin(userData.id);
          } catch (updateError) {
            console.log("Failed to update last login:", updateError);
          }
        }
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const firebaseError = error as { code?: string; message?: string };

      // Log more details for debugging
      console.log("Firebase error code:", firebaseError.code);
      console.log("Firebase error message:", firebaseError.message);

      if (firebaseError.code === "auth/user-not-found") {
        throw new Error(
          "No account found with this email. Please sign up first."
        );
      } else if (firebaseError.code === "auth/wrong-password") {
        throw new Error("Incorrect password. Please try again.");
      } else if (firebaseError.code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      } else if (firebaseError.code === "auth/invalid-credential") {
        throw new Error(
          "Invalid credentials. Please check your email and password."
        );
      } else if (firebaseError.code === "auth/too-many-requests") {
        throw new Error("Too many failed attempts. Please try again later.");
      } else if (firebaseError.code === "auth/network-request-failed") {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      } else {
        throw new Error(
          `Login failed: ${firebaseError.message || "Please try again."}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    if (!auth) {
      throw new Error(
        "Authentication is not available in this version. Please use the web version for full functionality."
      );
    }

    setIsLoading(true);
    try {
      // Create user in Firebase first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Now that we're authenticated, we can safely check and create in Firestore
      let userData;
      try {
        // Check if email already exists
        const emailExists = await userService.emailExists(email);
        if (emailExists) {
          throw new Error(
            "An account with this email already exists. Please sign in instead."
          );
        }

        // Check if username already exists
        const usernameExists = await userService.usernameExists(username);
        if (usernameExists) {
          throw new Error(
            "This username is already taken. Please choose a different username."
          );
        }

        // Create user in Firestore
        userData = await userService.createUser({
          name,
          username,
          email,
          isGuest: false,
        });
      } catch (dbError) {
        console.log("Database operations failed:", dbError);
        // Create a basic user object from Firebase auth data
        userData = {
          id: firebaseUser.uid,
          name,
          username,
          email,
          isGuest: false,
        };
      }

      setUser({
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        isGuest: false,
      });
    } catch (error: unknown) {
      console.error("Sign up failed:", error);
      const firebaseError = error as { code?: string; message?: string };

      // Log more details for debugging
      console.log("Firebase error code:", firebaseError.code);
      console.log("Firebase error message:", firebaseError.message);

      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error(
          "An account with this email already exists. Please sign in instead."
        );
      } else if (firebaseError.code === "auth/weak-password") {
        throw new Error(
          "Password should be at least 8 characters long and contain numbers, letters, and capital letters."
        );
      } else if (firebaseError.code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      } else if (firebaseError.code === "auth/invalid-credential") {
        throw new Error("Invalid credentials provided.");
      } else if (firebaseError.code === "auth/network-request-failed") {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      } else {
        throw new Error(
          `Account creation failed: ${
            firebaseError.message || "Please try again."
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error(
        "Google authentication is not available in this version. Please use the web version for full functionality."
      );
    }

    setIsLoading(true);
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user exists in our database
      let userData;
      try {
        userData = await userService.getUserByEmail(firebaseUser.email!);
      } catch (dbError) {
        console.log("Database lookup failed after Google auth:", dbError);
        userData = null;
      }

      if (!userData) {
        // Create new user in our database
        console.log("Creating new user document for Google sign-in...");
        try {
          const username =
            firebaseUser.displayName || firebaseUser.email!.split("@")[0];
          userData = await userService.createUser({
            name: firebaseUser.displayName || firebaseUser.email!.split("@")[0],
            username: username,
            email: firebaseUser.email!,
            isGuest: false,
          });
        } catch (createError) {
          console.log("Failed to create user document:", createError);
          // Create a basic user object from Firebase auth data
          userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email!.split("@")[0],
            username:
              firebaseUser.displayName || firebaseUser.email!.split("@")[0],
            email: firebaseUser.email!,
            isGuest: false,
          };
        }
      } else {
        // Update last login time
        try {
          await userService.updateLastLogin(userData.id);
        } catch (updateError) {
          console.log("Failed to update last login:", updateError);
        }
      }

      setUser({
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        isGuest: false,
      });
    } catch (error: unknown) {
      console.error("Google sign in failed:", error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        throw new Error("Sign in was cancelled.");
      } else if (
        firebaseError.code === "auth/account-exists-with-different-credential"
      ) {
        throw new Error(
          "An account with this email already exists with a different sign-in method."
        );
      } else {
        throw new Error("Google sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    const guestUser: User = {
      id: "guest_" + Date.now(),
      name: "Guest User",
      username: "guest",
      email: "guest@uyghurly.com",
      isGuest: true,
    };

    setUser(guestUser);
    try {
      await AsyncStorage.setItem("uyghurly_guest_user", JSON.stringify(guestUser));
    } catch (error) {
      console.error("Error saving guest user to AsyncStorage:", error);
    }
  };

  const logout = async () => {
    try {
      if (user && !user.isGuest && auth) {
        // Sign out from Firebase
        await signOut(auth);
      }
      // Clear guest user from AsyncStorage
      await AsyncStorage.removeItem("uyghurly_guest_user");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUserProgress = async (
    unitId: string,
    progress: {
      lessonCompleted?: boolean;
      quizCompleted?: boolean;
      quizScore?: number;
      completedAt?: string;
    }
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    await userService.updateUserProgress(user.id, unitId, progress);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signUp,
    signInWithGoogle,
    loginAsGuest,
    logout,
    isLoading,
    updateUserProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
