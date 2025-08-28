import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  isGuest: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  profile?: {
    level?: string;
    lessonsCompleted?: number;
    totalStudyTime?: number;
    streak?: number;
    achievements?: number;
  };
  progress?: {
    [unitId: string]: {
      lessonCompleted?: boolean;
      quizCompleted?: boolean;
      quizScore?: number;
      completedAt?: string;
    };
  };
}

// Helper function to check if Firebase is available
function checkFirebaseAvailable(): void {
  if (!db) {
    throw new Error(
      "Firebase is not available. This feature requires the web version."
    );
  }
}

export const userService = {
  // Create a new user account
  async createUser(
    userData: Omit<UserData, "id" | "createdAt" | "lastLoginAt">
  ): Promise<UserData> {
    checkFirebaseAvailable();

    const userRef = doc(collection(db!, "users"));
    const newUser: UserData = {
      ...userData,
      id: userRef.id,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      profile: {
        level: "Beginner",
        lessonsCompleted: 0,
        totalStudyTime: 0,
        streak: 0,
        achievements: 0,
        ...userData.profile,
      },
    };

    await setDoc(userRef, newUser);
    return newUser;
  },

  // Get user by ID
  async getUserById(userId: string): Promise<UserData | null> {
    checkFirebaseAvailable();

    const userRef = doc(db!, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<UserData | null> {
    checkFirebaseAvailable();

    const usersRef = collection(db!, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as UserData;
    }
    return null;
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<UserData | null> {
    checkFirebaseAvailable();

    const usersRef = collection(db!, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as UserData;
    }
    return null;
  },

  // Get user by email or username
  async getUserByEmailOrUsername(identifier: string): Promise<UserData | null> {
    // First try to find by email
    const userByEmail = await this.getUserByEmail(identifier);
    if (userByEmail) {
      return userByEmail;
    }

    // If not found by email, try by username
    const userByUsername = await this.getUserByUsername(identifier);
    if (userByUsername) {
      return userByUsername;
    }

    return null;
  },

  // Update user's last login time
  async updateLastLogin(userId: string): Promise<void> {
    checkFirebaseAvailable();

    const userRef = doc(db!, "users", userId);
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
    });
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    profile: Partial<UserData["profile"]>
  ): Promise<void> {
    checkFirebaseAvailable();

    const userRef = doc(db!, "users", userId);
    await updateDoc(userRef, {
      profile: profile,
    });
  },

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return user !== null;
  },

  // Check if username exists
  async usernameExists(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user !== null;
  },

  // Update user progress (lessons and quizzes)
  async updateUserProgress(
    userId: string,
    unitId: string,
    progress: {
      lessonCompleted?: boolean;
      quizCompleted?: boolean;
      quizScore?: number;
      completedAt?: string;
    }
  ): Promise<void> {
    checkFirebaseAvailable();

    const userRef = doc(db!, "users", userId);

    // Get current user data to update progress
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data() as UserData;
    const currentProgress = userData.progress || {};

    // Update progress for the specific unit
    currentProgress[unitId] = {
      ...currentProgress[unitId],
      ...progress,
    };

    // Update lessons completed count if lesson was completed
    let lessonsCompleted = userData.profile?.lessonsCompleted || 0;
    if (progress.lessonCompleted && !currentProgress[unitId]?.lessonCompleted) {
      lessonsCompleted += 1;
    }

    await updateDoc(userRef, {
      progress: currentProgress,
      profile: {
        ...userData.profile,
        lessonsCompleted,
      },
    });
  },
};
