"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

const ADMIN_EMAILS = ["parhat.elzat@gmail.com", "bouncebackuyghur@gmail.com"];

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Helper: Get all lesson and quiz keys in localStorage
  function getAllLessonKeys() {
    return Object.keys(localStorage).filter((key) => key.startsWith("lesson-"));
  }
  function getAllQuizKeys() {
    return Object.keys(localStorage).filter((key) => key.startsWith("quiz-"));
  }

  // Complete all lessons
  const handleCompleteAllLessons = () => {
    // For demo: just set a completed status for all lessons in localStorage
    // (In a real app, you might want to fetch all lesson slugs dynamically)
    const lessonKeys = getAllLessonKeys();
    lessonKeys.forEach((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          completed: true,
          score: 100,
          totalQuestions: 10,
          completedAt: new Date().toISOString(),
        })
      );
    });
    setActionMessage("All lessons marked as completed.");
  };

  // Clear all progress
  const handleClearProgress = () => {
    getAllLessonKeys().forEach((key) => localStorage.removeItem(key));
    getAllQuizKeys().forEach((key) => localStorage.removeItem(key));
    setActionMessage("All progress cleared.");
  };

  // Complete all quizzes
  const handleCompleteAllQuizzes = () => {
    const quizKeys = getAllQuizKeys();
    quizKeys.forEach((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          completed: true,
          score: 100,
          totalQuestions: 10,
          completedAt: new Date().toISOString(),
          passed: true,
        })
      );
    });
    setActionMessage("All quizzes marked as completed.");
  };

  return (
    <MainLayout hideProgress={true}>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : !isAdmin ? (
          <div className="text-center text-red-500">
            You are not authorized to view this page.
          </div>
        ) : (
          <div className="space-y-4">
            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleCompleteAllLessons}
            >
              Complete All Lessons
            </button>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCompleteAllQuizzes}
            >
              Complete All Quizzes
            </button>
            <button
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleClearProgress}
            >
              Clear Progress
            </button>
            {actionMessage && (
              <div className="text-center text-green-600">{actionMessage}</div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
