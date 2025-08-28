"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, BookOpen } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 dark:border-sky-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 sm:space-y-8 py-8 sm:py-0">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Learn Uyghur with{" "}
              <span className="text-sky-600 dark:text-sky-400">Uyghurly</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Master the Uyghur language through interactive lessons, vocabulary
              practice, and real-world conversations.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {isAuthenticated ? (
              <Link href="/lessons">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Go to Lessons
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto bg-sky-600 hover:bg-sky-700"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Start Learning
                </Button>
              </Link>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 px-4 sm:px-0">
              {isAuthenticated
                ? "Continue your learning journey"
                : "Free, interactive, and fun way to learn Uyghur"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-16 max-w-4xl w-full px-4 sm:px-0">
            <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-sky-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                50+ Interactive Lessons
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Learn through engaging exercises and real-time feedback
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-sky-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                2000+ different words
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Build your vocabulary with essential words and phrases
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-sky-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Progress Tracking
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Track your learning journey and celebrate achievements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
