"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { userService, UserData } from "@/lib/userService";
import { getAllLessons, getAllUnits } from "@/utils/lessonLoader";
import {
  User,
  BookOpen,
  Trophy,
  Edit,
  Save,
  X,
  Calendar,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    username: "",
    email: "",
  });

  // Fetch user data from Firestore when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && !user.isGuest) {
        setIsLoadingUserData(true);
        try {
          const fullUserData = await userService.getUserByEmail(user.email);
          if (fullUserData) {
            setUserData(fullUserData);
            setEditData({
              name: fullUserData.name,
              username: fullUserData.username,
              email: fullUserData.email,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoadingUserData(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!userData || user?.isGuest) return;

    try {
      // Update user data in Firestore
      await userService.updateUserProfile(userData.id, {
        ...userData.profile,
        // Add any additional profile updates here
      });

      // Update local state
      setUserData({
        ...userData,
        name: editData.name,
        email: editData.email,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: userData?.name || "",
      username: userData?.username || "",
      email: userData?.email || "",
    });
    setIsEditing(false);
  };

  const formatJoinDate = (
    date: Date | { toDate: () => Date } | { seconds: number } | null | undefined
  ) => {
    // Handle Firestore timestamp conversion
    let jsDate: Date;

    if (
      date &&
      typeof date === "object" &&
      "toDate" in date &&
      typeof date.toDate === "function"
    ) {
      // It's a Firestore timestamp
      jsDate = date.toDate();
    } else if (date instanceof Date) {
      // It's already a JavaScript Date
      jsDate = date;
    } else if (
      date &&
      typeof date === "object" &&
      "seconds" in date &&
      typeof date.seconds === "number"
    ) {
      // It's a Firestore timestamp object
      jsDate = new Date(date.seconds * 1000);
    } else {
      // Fallback to current date
      jsDate = new Date();
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(jsDate);
  };

  // Calculate real progress from localStorage
  const [progressData, setProgressData] = useState({
    lessonsCompleted: 0,
    totalLessons: 0,
    unitsCompleted: 0,
    totalUnits: 0,
    wordsLearned: 0,
    quizAverage: 0,
    lessonsToday: 0,
  });

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        const allLessons = await getAllLessons();
        const allUnits = await getAllUnits();

        // Calculate lessons completed
        let completedLessons = 0;
        let totalWords = 0;
        let todayLessons = 0;
        const today = new Date().toDateString();

        allLessons.forEach((lesson) => {
          const lessonStatus = localStorage.getItem(`lesson-${lesson.slug}`);
          if (lessonStatus) {
            const status = JSON.parse(lessonStatus);
            if (status.completed) {
              completedLessons++;
              totalWords += lesson.vocabulary.length;

              // Check if completed today
              const completedDate = new Date(status.completedAt).toDateString();
              if (completedDate === today) {
                todayLessons++;
              }
            }
          }
        });

        // Calculate units completed
        let completedUnits = 0;
        const quizScores: number[] = [];
        allUnits.forEach((unit) => {
          const unitId = unit.toLowerCase().replace(/ /g, "_");
          const quizResult = localStorage.getItem(`quiz-${unitId}`);
          if (quizResult) {
            const result = JSON.parse(quizResult);
            if (result.passed) {
              completedUnits++;
              quizScores.push(result.score);
            }
          }
        });

        // Calculate quiz average
        const quizAverage =
          quizScores.length > 0
            ? Math.round(
                quizScores.reduce((a, b) => a + b, 0) / quizScores.length
              )
            : 0;

        setProgressData({
          lessonsCompleted: completedLessons,
          totalLessons: allLessons.length,
          unitsCompleted: completedUnits,
          totalUnits: allUnits.length,
          wordsLearned: totalWords,
          quizAverage,
          lessonsToday: todayLessons,
        });
      } catch (error) {
        console.error("Error calculating progress:", error);
      }
    };

    calculateProgress();
  }, []);

  const lessonsProgressPercentage =
    progressData.totalLessons > 0
      ? (progressData.lessonsCompleted / progressData.totalLessons) * 100
      : 0;

  const unitsProgressPercentage =
    progressData.totalUnits > 0
      ? (progressData.unitsCompleted / progressData.totalUnits) * 100
      : 0;

  // Show loading state
  if (isLoading || isLoadingUserData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`container mx-auto px-4 py-8 max-w-4xl ${
          !isAuthenticated || (isAuthenticated && user?.isGuest)
            ? "blur-[3px] pointer-events-none"
            : ""
        }`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account and track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {userData?.name?.charAt(0) ||
                        user?.name?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <Input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <Input
                            value={editData.username}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                username: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">
                          {userData?.name || user?.name || "User"}
                        </h3>
                        <p className="text-gray-600">
                          @{userData?.username || user?.username || "username"}
                        </p>
                        <p className="text-gray-600">
                          {userData?.email || user?.email || "No email"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Joined:</span>
                    <span className="text-sm font-medium">
                      {userData?.createdAt
                        ? formatJoinDate(userData.createdAt)
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Track your Uyghur language learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Lessons Completed
                    </span>
                    <span className="text-sm text-gray-600">
                      {progressData.lessonsCompleted} /{" "}
                      {progressData.totalLessons}
                    </span>
                  </div>
                  <Progress value={lessonsProgressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(lessonsProgressPercentage)}% complete
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Units Completed</span>
                    <span className="text-sm text-gray-600">
                      {progressData.unitsCompleted} / {progressData.totalUnits}
                    </span>
                  </div>
                  <Progress value={unitsProgressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(unitsProgressPercentage)}% complete
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {progressData.wordsLearned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Words Learned
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {progressData.quizAverage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Quiz Average
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Lessons Today
                  </span>
                  <span className="text-sm font-medium">
                    {progressData.lessonsToday}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Words Learned
                  </span>
                  <span className="text-sm font-medium">
                    {progressData.wordsLearned}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Quiz Average
                  </span>
                  <span className="text-sm font-medium">
                    {progressData.quizAverage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Units Completed
                  </span>
                  <span className="text-sm font-medium">
                    {progressData.unitsCompleted}/{progressData.totalUnits}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Authentication Required Overlay */}
      {(!isAuthenticated || (isAuthenticated && user?.isGuest)) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <Dialog
            open={!isAuthenticated || (isAuthenticated && user?.isGuest)}
            onOpenChange={() => {}}
          >
            <DialogContent className="sm:max-w-md [&>button]:hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-center text-xl font-bold text-gray-900">
                  <Lock className="h-6 w-6 text-blue-600" />
                  {user?.isGuest ? "Account Required" : "Sign In Required"}
                </DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  {user?.isGuest
                    ? "Create an account to access your learning profile and save your progress"
                    : "Sign in to save your progress and access your learning profile"}
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full">
                      {user?.isGuest ? "Create Account" : "Sign In to Continue"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="w-full"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
