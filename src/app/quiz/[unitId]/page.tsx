"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UnitQuiz } from "@/types/lesson";
import { getOrGenerateUnitQuiz } from "@/utils/quizGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { isStaticExport } from "@/utils/platform";
import StaticQuizPage from "./static-page";

function ClientQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateUserProgress } = useAuth();
  const unitId = params.unitId as string;

  const [quiz, setQuiz] = useState<UnitQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get unit title from unitId (you might need to adjust this based on your unit structure)
        const unitTitle = unitId
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        const quizData = await getOrGenerateUnitQuiz(unitId, unitTitle);
        setQuiz(quizData);
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (unitId) {
      loadQuiz();
    }
  }, [unitId]);

  const handleSubmit = useCallback(() => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);

    // Save quiz result to localStorage
    const quizResult = {
      score: finalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
      passed: finalScore >= quiz.passingScore,
      answers: selectedAnswers,
    };
    localStorage.setItem(`quiz-${unitId}`, JSON.stringify(quizResult));

    // Update user progress if quiz is passed
    if (finalScore >= quiz.passingScore && user) {
      updateUserProgress(unitId, {
        quizCompleted: true,
        quizScore: finalScore,
        completedAt: new Date().toISOString(),
      });
    }
  }, [quiz, selectedAnswers, unitId, user, updateUserProgress]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleBackToLessons = () => {
    router.push("/lessons");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Loading quiz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4 text-sm sm:text-base">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Quiz not found
            </p>
            <Button onClick={handleBackToLessons} className="w-full sm:w-auto">
              Back to Lessons
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                {quiz.title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {quiz.description}
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isSubmitted ? (
            <>
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <span className="text-sm text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {answeredCount} of {quiz.questions.length} answered
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                  {currentQuestion.question}
                </h3>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswers[currentQuestion.id] === option
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start h-auto p-3 sm:p-4 text-left min-h-[48px] sm:min-h-[56px]"
                      onClick={() =>
                        handleAnswerSelect(currentQuestion.id, option)
                      }
                    >
                      <span className="font-medium mr-2 text-sm sm:text-base">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed">
                        {option}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex + 1)
                      }
                      className="flex-1 sm:flex-none"
                    >
                      Next
                    </Button>
                  ) : currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={answeredCount < quiz.questions.length}
                      className="flex-1 sm:flex-none"
                    >
                      Submit Quiz
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  Quiz Complete!
                </h2>
                <div className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  {score}%
                </div>
                <Badge
                  variant={
                    score >= quiz.passingScore ? "default" : "destructive"
                  }
                  className="text-base sm:text-lg px-3 sm:px-4 py-1 sm:py-2"
                >
                  {score >= quiz.passingScore ? "Passed!" : "Failed"}
                </Badge>
              </div>

              <div className="mb-6 space-y-2">
                <p className="text-sm sm:text-base text-muted-foreground">
                  You answered{" "}
                  {Math.round((score / 100) * quiz.questions.length)} out of{" "}
                  {quiz.questions.length} questions correctly.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Passing score: {quiz.passingScore}%
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {score < quiz.passingScore && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Retry Quiz
                  </Button>
                )}
                <Button
                  onClick={handleBackToLessons}
                  className="w-full sm:w-auto"
                >
                  Back to Lessons
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizPage() {
  const params = useParams();

  // For iOS builds, render the static version
  if (isStaticExport()) {
    return <StaticQuizPage params={{ unitId: params.unitId as string }} />;
  }

  // For web builds, render the client version
  return <ClientQuizPage />;
}
