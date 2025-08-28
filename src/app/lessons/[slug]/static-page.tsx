import { getLessonBySlug } from "@/utils/lessonLoader";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Function to capitalize first letter of Uyghur words
const capitalizeUyghur = (word: string): string => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// This component is used for static export (iOS builds)
// It pre-renders all content without client-side state
export default async function StaticLessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = await getLessonBySlug(params.slug);

  if (!lesson) {
    return (
      <MainLayout hideProgress={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4">Lesson not found.</div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
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

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex-1 text-gray-900 dark:text-gray-100">
                  Vocabulary Practice
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
              <div className="text-center py-8">
                <div className="mb-4">
                  <Keyboard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Interactive Practice
                  </h3>
                  <p className="text-muted-foreground">
                    This lesson contains {lesson.vocabulary.length} vocabulary
                    words and {lesson.exercises.length} exercises.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    For the full interactive experience, please use the web
                    version.
                  </p>
                  <p className="mt-2">
                    This iOS version shows the vocabulary and lesson content for
                    reference.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
