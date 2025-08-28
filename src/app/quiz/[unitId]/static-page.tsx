import { getOrGenerateUnitQuiz } from "@/utils/quizGenerator";
import { UnitQuiz } from "@/types/lesson";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target } from "lucide-react";
import Link from "next/link";

// This component is used for static export (iOS builds)
// It pre-renders all content without client-side state
export default async function StaticQuizPage({
  params,
}: {
  params: { unitId: string };
}) {
  let quiz: UnitQuiz | null = null;
  let error: string | null = null;

  try {
    // Get unit title from unitId
    const unitTitle = params.unitId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    quiz = await getOrGenerateUnitQuiz(params.unitId, unitTitle);
  } catch (err) {
    console.error("Error loading quiz:", err);
    error = "Failed to load quiz. Please try again.";
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4 text-sm sm:text-base">
              {error}
            </p>
            <Link href="/lessons">
              <Button className="w-full sm:w-auto">Back to Lessons</Button>
            </Link>
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
            <Link href="/lessons">
              <Button className="w-full sm:w-auto">Back to Lessons</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                {quiz.questions.length} Questions
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quiz Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Questions
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {quiz.questions.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Passing Score
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {quiz.passingScore}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Time Limit
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {quiz.timeLimit} min
                </div>
              </div>
            </div>
          </div>

          {/* Sample Questions Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sample Questions
            </h3>
            {quiz.questions.slice(0, 3).map((question, index) => (
              <div
                key={question.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0">
                    Q{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 mb-2">
                      {question.question}
                    </p>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`text-sm p-2 rounded ${
                            option === question.correctAnswer
                              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                              : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          {option}
                          {option === question.correctAnswer && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                              (Correct)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {quiz.questions.length > 3 && (
              <div className="text-center text-sm text-muted-foreground">
                ... and {quiz.questions.length - 3} more questions
              </div>
            )}
          </div>

          {/* iOS Notice */}
          <div className="text-center py-6 sm:py-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Quiz Preview
              </h2>
              <p className="text-muted-foreground mb-4">
                This is a preview of the quiz content for iOS users.
              </p>
              <Badge variant="outline" className="text-base px-3 py-1">
                iOS Version - Read Only
              </Badge>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm sm:text-base text-muted-foreground">
                For the full interactive quiz experience, please use the web
                version.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                This iOS version shows the quiz content and questions for
                reference.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/lessons">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Lessons
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
