"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonBySlug } from "@/utils/lessonLoader";
import { useEffect, useState } from "react";
import { LessonContent } from "@/types/lesson";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Book, Heart, Keyboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { isCorrectAnswer } from "@/utils/typingQuestions";
import { isStaticExport } from "@/utils/platform";
import StaticLessonPage from "./static-page";

// Function to capitalize first letter of Uyghur words
const capitalizeUyghur = (word: string): string => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Function to clean words by removing parts in parentheses and brackets
function cleanWord(word: string): string {
  return word
    .replace(/\([^)]*\)/g, "") // Remove parentheses and their content
    .replace(/\[[^\]]*\]/g, "") // Remove brackets and their content
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove extra whitespace
}

// Function to generate exercises from vocabulary
function generateExercises(
  vocabulary: { uyghur: string; english: string; definition: string }[]
) {
  const exercises = [];

  // Create multiple choice questions for each vocabulary word
  for (const word of vocabulary) {
    // Clean the words for exercises
    const cleanUyghur = cleanWord(word.uyghur);
    const cleanEnglish = cleanWord(word.english);

    // Get 3 random wrong answers from other words (also cleaned)
    const wrongAnswers = vocabulary
      .filter((w) => w.english !== word.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => cleanWord(w.english));

    // Create the exercise
    exercises.push({
      question: `What is the English meaning of "${cleanUyghur}"?`,
      options: [...wrongAnswers, cleanEnglish].sort(() => Math.random() - 0.5),
      correctAnswer: cleanEnglish,
    });
  }

  return exercises;
}

function ClientLessonPage() {
  const params = useParams();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [typingAnswer, setTypingAnswer] = useState("");
  const [typingFeedback, setTypingFeedback] = useState<{
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
  } | null>(null);
  const [allQuestions, setAllQuestions] = useState<
    Array<{
      type: "multiple-choice" | "typing";
      index: number;
    }>
  >([]);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (
    array: Array<{ type: "multiple-choice" | "typing"; index: number }>
  ): Array<{ type: "multiple-choice" | "typing"; index: number }> => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const slug = params.slug as string;
        const loadedLesson = await getLessonBySlug(slug);

        if (!loadedLesson) {
          setError("Lesson not found. Please check the URL and try again.");
          return;
        }

        // Generate exercises if none exist
        if (loadedLesson.exercises.length === 0) {
          loadedLesson.exercises = generateExercises(loadedLesson.vocabulary);
        }

        // Create combined array of exercises and typing questions
        const allQuestions = [];

        // Add multiple choice exercises
        for (let i = 0; i < loadedLesson.exercises.length; i++) {
          allQuestions.push({ type: "multiple-choice" as const, index: i });
        }

        // Add typing questions
        for (let i = 0; i < loadedLesson.typingQuestions.length; i++) {
          allQuestions.push({ type: "typing" as const, index: i });
        }

        // Shuffle all questions
        const shuffledQuestions = shuffleArray(allQuestions);

        setLesson(loadedLesson);
        setAllQuestions(shuffledQuestions);
      } catch (err) {
        setError("Failed to load lesson. Please try again later.");
        console.error("Error loading lesson:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [params.slug]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple answers

    setSelectedAnswer(answer);
    const currentQuestion = allQuestions[currentExerciseIndex];

    if (currentQuestion.type === "multiple-choice") {
      const currentExercise = lesson?.exercises[currentQuestion.index];
      const isCorrect = answer === currentExercise?.correctAnswer;

      if (isCorrect) {
        setScore((prev) => prev + 1);
      } else {
        const newLives = lives - 1;
        setLives(newLives);

        // Check if game over immediately
        if (newLives <= 0) {
          // Save progress and show game over
          const lessonStatus = {
            completed: true,
            score: score,
            totalQuestions: allQuestions.length,
            completedAt: new Date().toISOString(),
          };
          localStorage.setItem(
            `lesson-${params.slug}`,
            JSON.stringify(lessonStatus)
          );

          setTimeout(() => {
            setGameOver(true);
          }, 1000);
          return;
        }
      }
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      if (currentExerciseIndex < allQuestions.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setTypingAnswer("");
      } else {
        // Lesson completed - save progress
        const finalScore =
          currentQuestion.type === "multiple-choice" &&
          answer === lesson?.exercises[currentQuestion.index]?.correctAnswer
            ? score + 1
            : score;
        const lessonStatus = {
          completed: true,
          score: finalScore,
          totalQuestions: allQuestions.length,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `lesson-${params.slug}`,
          JSON.stringify(lessonStatus)
        );

        setShowResults(true);
      }
    }, 1000);
  };

  const handleTypingAnswer = () => {
    if (!typingAnswer.trim()) return;

    const currentQuestion = allQuestions[currentExerciseIndex];
    const currentTypingQuestion =
      lesson?.typingQuestions[currentQuestion.index];
    const isCorrect = isCorrectAnswer(
      typingAnswer,
      currentTypingQuestion?.correctAnswer || ""
    );

    // Set feedback for typing question
    setTypingFeedback({
      isCorrect,
      userAnswer: typingAnswer,
      correctAnswer: currentTypingQuestion?.correctAnswer || "",
    });

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);

      // Check if game over immediately
      if (newLives <= 0) {
        // Save progress and show game over
        const lessonStatus = {
          completed: true,
          score: score,
          totalQuestions: allQuestions.length,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `lesson-${params.slug}`,
          JSON.stringify(lessonStatus)
        );

        setTimeout(() => {
          setGameOver(true);
        }, 1000);
        return;
      }
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      if (currentExerciseIndex < allQuestions.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setTypingAnswer("");
        setTypingFeedback(null);
      } else {
        // Lesson completed - save progress
        const finalScore = isCorrect ? score + 1 : score;
        const lessonStatus = {
          completed: true,
          score: finalScore,
          totalQuestions: allQuestions.length,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `lesson-${params.slug}`,
          JSON.stringify(lessonStatus)
        );

        setShowResults(true);
      }
    }, 1000);
  };

  const resetExercise = () => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setLives(3);
    setShowResults(false);
    setGameOver(false);
    setTypingAnswer("");
    setTypingFeedback(null);

    // Re-shuffle the exercise order for a new attempt
    if (lesson) {
      const allQuestions = [];

      // Add multiple choice exercises
      for (let i = 0; i < lesson.exercises.length; i++) {
        allQuestions.push({ type: "multiple-choice" as const, index: i });
      }

      // Add typing questions
      for (let i = 0; i < lesson.typingQuestions.length; i++) {
        allQuestions.push({ type: "typing" as const, index: i });
      }

      // Shuffle all questions
      const shuffledQuestions = shuffleArray(allQuestions);
      setAllQuestions(shuffledQuestions);
    }
  };

  if (isLoading) {
    return (
      <MainLayout hideProgress={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">Loading lesson...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout hideProgress={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!lesson) {
    return (
      <MainLayout hideProgress={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4">Lesson not found.</div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideProgress={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground mt-2">{lesson.description}</p>
        </div>

        {lesson.exercises.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No exercises available for this lesson yet.
            </p>
          </div>
        ) : showResults ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Exercise Complete!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Your score: {score} out of {allQuestions.length}
            </p>
            <div className="space-x-4">
              <Button onClick={resetExercise}>Try Again</Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Lesson
              </Button>
            </div>
          </div>
        ) : gameOver ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Game Over!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              You ran out of lives. Final score: {score} out of{" "}
              {allQuestions.length}
            </p>
            <div className="space-x-4">
              <Button onClick={resetExercise}>Try Again</Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Lessons
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Question {currentExerciseIndex + 1} of {allQuestions.length}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, index) => (
                    <Heart
                      key={index}
                      className={`h-5 w-5 ${
                        index < lives
                          ? "text-red-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentExerciseIndex + 1) / allQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex-1 text-gray-900 dark:text-gray-100">
                    {(() => {
                      const currentQuestion =
                        allQuestions[currentExerciseIndex];
                      if (currentQuestion.type === "multiple-choice") {
                        return lesson.exercises[currentQuestion.index].question;
                      } else {
                        return lesson.typingQuestions[currentQuestion.index]
                          .question;
                      }
                    })()}
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-4">
                        <Book className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-100">
                          Vocabulary
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                        {lesson.vocabulary.map((word, index) => (
                          <Card
                            key={index}
                            className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          >
                            <CardHeader>
                              <div className="flex-1">
                                <CardTitle className="text-2xl mb-3 font-bold text-gray-900 dark:text-gray-100">
                                  {capitalizeUyghur(word.uyghur)}
                                </CardTitle>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 pl-3">
                                  {word.english}
                                </p>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-3">
                                {word.definition}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const currentQuestion = allQuestions[currentExerciseIndex];
                  if (currentQuestion.type === "multiple-choice") {
                    return lesson.exercises[currentQuestion.index].options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedAnswer === option ? "default" : "outline"
                          }
                          className={`w-full justify-start ${
                            selectedAnswer
                              ? option ===
                                lesson.exercises[currentQuestion.index]
                                  .correctAnswer
                                ? "bg-green-500 hover:bg-green-600"
                                : selectedAnswer === option
                                ? "bg-red-500 hover:bg-red-600"
                                : ""
                              : ""
                          }`}
                          onClick={() => handleAnswer(option)}
                          disabled={!!selectedAnswer}
                        >
                          <span className="mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                          {selectedAnswer &&
                            option ===
                              lesson.exercises[currentQuestion.index]
                                .correctAnswer && (
                              <CheckCircle2 className="ml-2 h-4 w-4" />
                            )}
                          {selectedAnswer === option &&
                            option !==
                              lesson.exercises[currentQuestion.index]
                                .correctAnswer && (
                              <XCircle className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                      )
                    );
                  } else {
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Keyboard className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-muted-foreground">
                            Type your answer below
                          </span>
                        </div>
                        <Input
                          type="text"
                          placeholder="Enter your answer..."
                          value={typingAnswer}
                          onChange={(e) => setTypingAnswer(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleTypingAnswer();
                            }
                          }}
                          className="text-lg"
                          disabled={!!typingFeedback}
                        />
                        <Button
                          onClick={handleTypingAnswer}
                          disabled={!typingAnswer.trim() || !!typingFeedback}
                          className="w-full"
                        >
                          Submit Answer
                        </Button>

                        {/* Typing Feedback */}
                        {typingFeedback && (
                          <div
                            className={`p-4 rounded-lg border-2 ${
                              typingFeedback.isCorrect
                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {typingFeedback.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                              <span
                                className={`font-medium ${
                                  typingFeedback.isCorrect
                                    ? "text-green-800 dark:text-green-200"
                                    : "text-red-800 dark:text-red-200"
                                }`}
                              >
                                {typingFeedback.isCorrect
                                  ? "Correct!"
                                  : "Incorrect"}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <div>
                                <span className="font-medium">
                                  Your answer:
                                </span>{" "}
                                {typingFeedback.userAnswer}
                              </div>
                              {!typingFeedback.isCorrect && (
                                <div>
                                  <span className="font-medium">
                                    Correct answer:
                                  </span>{" "}
                                  {typingFeedback.correctAnswer}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function LessonPage() {
  const params = useParams();

  // For iOS builds, render the static version
  if (isStaticExport()) {
    return <StaticLessonPage params={{ slug: params.slug as string }} />;
  }

  // For web builds, render the client version
  return <ClientLessonPage />;
}
