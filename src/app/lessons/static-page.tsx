import { getAllLessons, getAllUnits } from "@/utils/lessonLoader";
import { Circle, PlayCircle } from "lucide-react";
import { getOrGenerateUnitQuiz } from "@/utils/quizGenerator";
import { Button } from "@/components/ui/button";
import type { UnitQuiz } from "@/types/lesson";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This component is used for static export (iOS builds)
// It pre-renders all content without client-side state
export default async function StaticLessonsPage() {
  // Load data at build time
  const lessons = await getAllLessons();
  const units = await getAllUnits();

  if (!lessons || lessons.length === 0 || !units || units.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-2 text-gray-900 dark:text-gray-100">
              No lessons available.
            </div>
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
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base bg-yellow-500 dark:bg-yellow-600 text-white">
                  {index + 1}
                </div>

                {/* Unit content */}
                <div className="flex-grow min-w-0">
                  <div className="w-full text-left p-3 sm:p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          Unit {index + 1}: {unit}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {
                            lessons.filter((lesson) => lesson.unit === unit)
                              .length
                          }{" "}
                          lessons
                        </p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Lessons grid */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {lessons
                      .filter((lesson) => lesson.unit === unit)
                      .map((lesson) => (
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          key={lesson.slug}
                        >
                          <Card className="h-full transition-all hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                {lesson.vocabulary.length} vocabulary words
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>

                  {/* Quiz Card */}
                  <div className="mt-8">
                    <StaticQuizCard unit={unit} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Static Quiz Card component
async function StaticQuizCard({ unit }: { unit: string }) {
  let quiz: UnitQuiz | null = null;

  try {
    const unitId = unit.toLowerCase().replace(/ /g, "_");
    quiz = await getOrGenerateUnitQuiz(unitId, unit);
  } catch (error) {
    console.error(`Error loading quiz for unit ${unit}:`, error);
  }

  if (!quiz) return null;

  return (
    <Card className="transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <PlayCircle className="h-5 w-5 text-yellow-500" />
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
          <Link href={`/quiz/${quiz.unitId}`}>
            <Button className="w-full">Take Quiz</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
