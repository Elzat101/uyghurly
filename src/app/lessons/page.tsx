"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllLessons, getAllUnits } from "@/utils/lessonLoader";
import { LessonContent } from "@/types/lesson";
import { CheckCircle2, Lock, Circle, PlayCircle } from "lucide-react";
import { getOrGenerateUnitQuiz } from "@/utils/quizGenerator";
import { Button } from "@/components/ui/button";
import type { UnitQuiz } from "@/types/lesson";
import { isStaticExport } from "@/utils/platform";
import StaticLessonsPage from "./static-page";

function ClientLessonsPage() {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState("Loading units...");
  const [unitStatus, setUnitStatus] = useState<
    Record<
      string,
      { completed: boolean; lessonsCompleted: number; totalLessons: number }
    >
  >({});
  const [quizStatus, setQuizStatus] = useState<
    Record<string, { completed: boolean; passed: boolean }>
  >({});

  useEffect(() => {
    let isMounted = true;

    const loadLessons = async () => {
      try {
        setLoadingProgress("Loading units...");
        const allUnits = await getAllUnits();
        if (!isMounted) return;

        if (allUnits.length === 0) {
          setError(
            "No units found. Please check if the lesson files are properly loaded."
          );
          setIsLoading(false);
          return;
        }
        setUnits(allUnits);
        setSelectedUnit(allUnits[0]);

        setLoadingProgress("Loading lessons...");
        const allLessons = await getAllLessons();
        if (!isMounted) return;

        if (allLessons.length === 0) {
          setError(
            "No lessons found. Please check if the lesson files are properly loaded."
          );
        } else {
          setLessons(allLessons);

          // Calculate unit status
          const status: Record<
            string,
            {
              completed: boolean;
              lessonsCompleted: number;
              totalLessons: number;
            }
          > = {};
          allUnits.forEach((unit) => {
            const unitLessons = allLessons.filter(
              (lesson) => lesson.unit === unit
            );
            const totalLessons = unitLessons.length;
            const lessonsCompleted = unitLessons.filter((lesson) => {
              const lessonStatus = localStorage.getItem(
                `lesson-${lesson.slug}`
              );
              return lessonStatus ? JSON.parse(lessonStatus).completed : false;
            }).length;

            status[unit] = {
              completed: lessonsCompleted === totalLessons,
              lessonsCompleted,
              totalLessons,
            };
          });
          setUnitStatus(status);

          // Load quiz status for each unit
          const quizStatusObj: Record<
            string,
            { completed: boolean; passed: boolean }
          > = {};
          for (const unit of allUnits) {
            try {
              const unitId = unit.toLowerCase().replace(/ /g, "_");
              const quiz = await getOrGenerateUnitQuiz(unitId, unit);
              if (quiz) {
                // Check localStorage for quiz results
                const result = localStorage.getItem(`quiz-${unitId}`);
                const quizResult = result ? JSON.parse(result) : null;
                quizStatusObj[unit] = {
                  completed: !!quizResult,
                  passed: !!quizResult && quizResult.score >= quiz.passingScore,
                };
              } else {
                quizStatusObj[unit] = { completed: false, passed: false };
              }
            } catch (error) {
              console.error(`Error loading quiz for unit ${unit}:`, error);
              quizStatusObj[unit] = { completed: false, passed: false };
            }
          }
          setQuizStatus(quizStatusObj);
        }
      } catch (error) {
        console.error("Error loading lessons:", error);
        if (isMounted) {
          setError("Failed to load lessons. Please try refreshing the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadLessons();

    return () => {
      isMounted = false;
    };
  }, []);

  const isUnitLocked = (unitIndex: number) => {
    if (unitIndex === 0) return false; // First unit is always unlocked
    const previousUnit = units[unitIndex - 1];
    // Next unit is locked if previous unit's quiz is not passed
    return !quizStatus[previousUnit]?.passed;
  };

  const getUnitProgress = (unit: string) => {
    const status = unitStatus[unit];
    if (!status) return null;
    return `${status.lessonsCompleted}/${status.totalLessons} lessons completed`;
  };

  const filteredLessons = selectedUnit
    ? lessons.filter((lesson) => lesson.unit === selectedUnit)
    : lessons;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">
              {loadingProgress}
            </div>
            <div className="text-sm text-muted-foreground">
              Please wait while we load your lessons...
            </div>
            <div className="mt-4 animate-pulse">
              <div className="h-4 bg-secondary rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-secondary rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              No lessons available.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Lessons
          </h1>
        </div>

        {/* Vertical unit progression */}
        <div className="max-w-3xl mx-auto">
          {units.map((unit, index) => (
            <div key={unit} className="relative">
              {/* Connecting line */}
              {index < units.length - 1 && (
                <div className="absolute left-5 sm:left-6 top-14 sm:top-16 bottom-8 w-0.5 bg-primary/20 dark:bg-primary/30" />
              )}

              {/* Unit content */}
              <div className="relative flex items-start gap-3 sm:gap-4 mb-8">
                {/* Unit number circle */}
                <div
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                    isUnitLocked(index)
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      : unitStatus[unit]?.completed && quizStatus[unit]?.passed
                      ? "bg-green-500 dark:bg-green-600 text-white"
                      : "bg-yellow-500 dark:bg-yellow-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Unit content */}
                <div className="flex-grow min-w-0">
                  <button
                    onClick={() => {
                      if (!isUnitLocked(index)) {
                        setSelectedUnit(selectedUnit === unit ? null : unit);
                      }
                    }}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all ${
                      isUnitLocked(index)
                        ? "bg-muted cursor-not-allowed"
                        : selectedUnit === unit
                        ? "bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white"
                        : unitStatus[unit]?.completed &&
                          quizStatus[unit]?.passed
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                    }`}
                    disabled={isUnitLocked(index)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          Unit {index + 1}: {unit}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {getUnitProgress(unit)}
                        </p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        {isUnitLocked(index) ? (
                          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        ) : quizStatus[unit]?.passed ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Lessons grid */}
                  {selectedUnit === unit && !isUnitLocked(index) && (
                    <>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {filteredLessons.map((lesson) => {
                          const lessonStatus = localStorage.getItem(
                            `lesson-${lesson.slug}`
                          );
                          const status = lessonStatus
                            ? JSON.parse(lessonStatus)
                            : null;
                          const isCompleted = status?.completed;
                          const isPerfect =
                            status?.score === lesson.vocabulary.length;

                          return (
                            <Link
                              href={`/lessons/${lesson.slug}`}
                              key={lesson.slug}
                            >
                              <Card
                                className={`h-full transition-all hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
                                  isCompleted
                                    ? isPerfect
                                      ? "bg-green-50/50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
                                      : "bg-yellow-50/50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700"
                                    : ""
                                }`}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <CardTitle className="text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                                        {lesson.title}
                                      </CardTitle>
                                      <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {lesson.description}
                                      </CardDescription>
                                    </div>
                                    {isPerfect && (
                                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="text-xs sm:text-sm text-muted-foreground">
                                    {lesson.vocabulary.length} vocabulary words
                                  </div>
                                  {isCompleted && (
                                    <div className="mt-2 text-xs sm:text-sm space-y-1">
                                      <div className="text-muted-foreground">
                                        Score: {status.score}/
                                        {lesson.vocabulary.length}
                                      </div>
                                      <div className="text-muted-foreground">
                                        Completed:{" "}
                                        {new Date(
                                          status.completedAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </Link>
                          );
                        })}
                      </div>
                      {/* Quiz Card */}
                      <div className="mt-8">
                        <QuizCard
                          unit={unit}
                          unitStatus={unitStatus[unit]}
                          quizStatus={quizStatus[unit]}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// QuizCard component
type QuizCardProps = {
  unit: string;
  unitStatus: {
    completed: boolean;
    lessonsCompleted: number;
    totalLessons: number;
  };
  quizStatus: { completed: boolean; passed: boolean };
};

function QuizCard({ unit, unitStatus, quizStatus }: QuizCardProps) {
  const [quiz, setQuiz] = useState<UnitQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const unitId = unit.toLowerCase().replace(/ /g, "_");
        const quizData = await getOrGenerateUnitQuiz(unitId, unit);
        setQuiz(quizData);
      } catch (error) {
        console.error(`Error loading quiz for unit ${unit}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [unit]);

  if (isLoading) {
    return (
      <Card className="bg-muted border-muted dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Loading Quiz...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) return null;

  const isQuizLocked = !unitStatus?.completed;
  const isQuizPassed = quizStatus?.passed;

  return (
    <Card
      className={`transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
        isQuizPassed
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
          : isQuizLocked
          ? "bg-muted dark:bg-gray-700 border-muted dark:border-gray-600"
          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          {isQuizPassed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : isQuizLocked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : (
            <PlayCircle className="h-5 w-5 text-yellow-500" />
          )}
          {quiz.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-gray-600 dark:text-gray-400">
          {quiz.description}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Questions: {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Passing: {quiz.passingScore}%
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Time: {quiz.timeLimit} min
          </span>
        </div>
        <div className="mt-4">
          {isQuizPassed ? (
            <Button disabled variant="outline" className="w-full">
              Quiz Completed
            </Button>
          ) : isQuizLocked ? (
            <Button disabled variant="outline" className="w-full">
              Complete all lessons to unlock quiz
            </Button>
          ) : (
            <Link href={`/quiz/${quiz.unitId}`}>
              <Button className="w-full">Take Quiz</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LessonsPage() {
  // For iOS builds, render the static version
  if (isStaticExport()) {
    return <StaticLessonsPage />;
  }

  // For web builds, render the client version
  return <ClientLessonsPage />;
}
