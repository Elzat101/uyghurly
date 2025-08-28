import { getAllLessons } from "./lessonLoader";
import { UnitQuiz, QuizQuestion, VocabularyItem } from "@/types/lesson";

// Generate quiz questions from lesson vocabulary
function generateQuestionsFromVocabulary(
  vocabulary: VocabularyItem[],
  lessonTitle: string
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Generate translation questions (Uyghur to English)
  vocabulary.forEach((item, index) => {
    const wrongAnswers = getRandomWrongAnswers(vocabulary, item.english, 3);
    const options = [item.english, ...wrongAnswers];

    // Ensure all options are unique
    const uniqueOptions = [...new Set(options)];

    // If we don't have enough unique options, add some generic wrong answers
    while (uniqueOptions.length < 4) {
      const genericWrongAnswers = [
        "I don't know",
        "Not sure",
        "Maybe",
        "Different word",
      ];
      const randomGeneric =
        genericWrongAnswers[
          Math.floor(Math.random() * genericWrongAnswers.length)
        ];
      if (!uniqueOptions.includes(randomGeneric)) {
        uniqueOptions.push(randomGeneric);
      }
    }

    questions.push({
      id: `${lessonTitle}_uyghur_to_english_${index}`,
      question: `What does "${item.uyghur}" mean in English?`,
      options: uniqueOptions.sort(() => Math.random() - 0.5), // Shuffle options
      correctAnswer: item.english,
      explanation: `"${item.uyghur}" means "${item.english}" in Uyghur.`,
      type: "multiple-choice",
    });
  });

  // Generate reverse translation questions (English to Uyghur)
  vocabulary.forEach((item, index) => {
    const wrongAnswers = getRandomWrongAnswers(
      vocabulary,
      item.uyghur,
      3,
      "uyghur"
    );
    const options = [item.uyghur, ...wrongAnswers];

    // Ensure all options are unique
    const uniqueOptions = [...new Set(options)];

    // If we don't have enough unique options, add some generic wrong answers
    while (uniqueOptions.length < 4) {
      const genericWrongAnswers = ["يوق", "بىلمەيمەن", "شەكلى", "باشقا"];
      const randomGeneric =
        genericWrongAnswers[
          Math.floor(Math.random() * genericWrongAnswers.length)
        ];
      if (!uniqueOptions.includes(randomGeneric)) {
        uniqueOptions.push(randomGeneric);
      }
    }

    questions.push({
      id: `${lessonTitle}_english_to_uyghur_${index}`,
      question: `What is the Uyghur word for "${item.english}"?`,
      options: uniqueOptions.sort(() => Math.random() - 0.5), // Shuffle options
      correctAnswer: item.uyghur,
      explanation: `"${item.english}" is "${item.uyghur}" in Uyghur.`,
      type: "multiple-choice",
    });
  });

  return questions;
}

// Get random wrong answers for multiple choice questions
function getRandomWrongAnswers(
  vocabulary: VocabularyItem[],
  correctAnswer: string,
  count: number,
  field: "english" | "uyghur" = "english"
): string[] {
  const allAnswers = vocabulary
    .map((item) => item[field])
    .filter((answer) => answer !== correctAnswer);

  // Remove duplicates to ensure unique wrong answers
  const uniqueAnswers = [...new Set(allAnswers)];

  const shuffled = uniqueAnswers.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate a quiz for a specific unit
export async function generateUnitQuiz(
  unitId: string,
  unitTitle: string
): Promise<UnitQuiz> {
  try {
    // Get all lessons
    const allLessons = await getAllLessons();

    // Filter lessons for this unit
    const unitLessons = allLessons.filter(
      (lesson) => lesson.unit.toLowerCase() === unitTitle.toLowerCase()
    );

    if (unitLessons.length === 0) {
      throw new Error(`No lessons found for unit: ${unitTitle}`);
    }

    // Generate all possible questions from all lessons in the unit
    const allQuestions: QuizQuestion[] = [];

    unitLessons.forEach((lesson) => {
      const lessonQuestions = generateQuestionsFromVocabulary(
        lesson.vocabulary,
        lesson.slug
      );
      allQuestions.push(...lessonQuestions);
    });

    // Ensure we have at least one question from each lesson
    const selectedQuestions: QuizQuestion[] = [];
    const questionsPerLesson = Math.max(1, Math.floor(20 / unitLessons.length));

    unitLessons.forEach((lesson) => {
      const lessonQuestions = allQuestions.filter((q) =>
        q.id.startsWith(lesson.slug)
      );
      if (lessonQuestions.length > 0) {
        // Take at least one question from each lesson
        const lessonSelected = lessonQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, questionsPerLesson);
        selectedQuestions.push(...lessonSelected);
      }
    });

    // Fill remaining slots with random questions from the unit
    const remainingSlots = 20 - selectedQuestions.length;
    if (remainingSlots > 0) {
      const availableQuestions = allQuestions.filter(
        (q) => !selectedQuestions.some((selected) => selected.id === q.id)
      );

      const additionalQuestions = availableQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingSlots);

      selectedQuestions.push(...additionalQuestions);
    }

    // Ensure no duplicate questions in final selection
    const uniqueQuestions = selectedQuestions.filter(
      (question, index, self) =>
        index === self.findIndex((q) => q.id === question.id)
    );

    // Shuffle the final questions
    const finalQuestions = uniqueQuestions.sort(() => Math.random() - 0.5);

    return {
      unitId,
      unitTitle,
      title: `${unitTitle} Unit Quiz`,
      description: `Test your knowledge of ${unitTitle.toLowerCase()} vocabulary and phrases`,
      questions: finalQuestions,
      passingScore: 70,
      timeLimit: 20, // 20 minutes for 20 questions
    };
  } catch (error) {
    console.error(`Error generating quiz for unit ${unitId}:`, error);
    throw error;
  }
}

// Get or generate quiz for a unit (with caching)
const quizCache = new Map<string, UnitQuiz>();

export async function getOrGenerateUnitQuiz(
  unitId: string,
  unitTitle: string
): Promise<UnitQuiz> {
  // Check cache first
  if (quizCache.has(unitId)) {
    return quizCache.get(unitId)!;
  }

  // Generate new quiz
  const quiz = await generateUnitQuiz(unitId, unitTitle);

  // Cache the quiz
  quizCache.set(unitId, quiz);

  return quiz;
}

// Clear quiz cache (useful for testing or refreshing quizzes)
export function clearQuizCache(): void {
  quizCache.clear();
}

// Get quiz cache size (for debugging)
export function getQuizCacheSize(): number {
  return quizCache.size;
}
