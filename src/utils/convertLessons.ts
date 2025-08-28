import {
  LessonContent,
  VocabularyItem,
  Exercise,
  TypingQuestion,
} from "@/types/lesson";

interface RawVocabularyItem {
  Unit: string;
  "Lesson Title": string;
  Uyghur: string;
  English: string;
  Definition: string;
}

interface LessonGroup {
  unit: string;
  lessonTitle: string;
  vocabulary: VocabularyItem[];
}

export function convertRawLessonsToStructuredLessons(
  rawData: RawVocabularyItem[]
): LessonContent[] {
  // Group vocabulary by unit and lesson title
  const lessonGroups = new Map<string, LessonGroup>();

  rawData.forEach((item) => {
    const key = `${item.Unit}-${item["Lesson Title"]}`;
    if (!lessonGroups.has(key)) {
      lessonGroups.set(key, {
        unit: item.Unit,
        lessonTitle: item["Lesson Title"],
        vocabulary: [],
      });
    }

    lessonGroups.get(key)!.vocabulary.push({
      uyghur: item.Uyghur,
      english: item.English,
      definition: item.Definition,
    });
  });

  // Convert each group to a LessonContent object
  const lessons: LessonContent[] = [];

  lessonGroups.forEach((group) => {
    // Create slug from lesson title
    const slug = group.lessonTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s\-_]/g, "") // Allow hyphens and underscores
      .replace(/[\(\)]/g, "") // Remove parentheses
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Generate exercises from vocabulary
    const exercises = generateExercisesFromVocabulary(group.vocabulary);

    // Generate typing questions from vocabulary
    const typingQuestions = generateTypingQuestionsFromVocabulary(
      group.vocabulary
    );

    const lesson: LessonContent = {
      title: group.lessonTitle,
      slug: slug,
      description: `Learn ${group.lessonTitle.toLowerCase()} in Uyghur`,
      unit: group.unit,
      vocabulary: group.vocabulary,
      exercises: exercises,
      typingQuestions: typingQuestions,
    };

    lessons.push(lesson);
  });

  return lessons;
}

// Function to clean text by removing brackets and parentheses
function cleanText(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "") // Remove parentheses and their content
    .replace(/\[[^\]]*\]/g, "") // Remove brackets and their content
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove extra whitespace
}

function generateExercisesFromVocabulary(
  vocabulary: VocabularyItem[]
): Exercise[] {
  const exercises: Exercise[] = [];

  vocabulary.forEach((item, index) => {
    // Randomly choose between Uyghur to English or English to Uyghur
    const isUyghurToEnglish = Math.random() < 0.5;

    const otherItems = vocabulary.filter((_, i) => i !== index);

    if (isUyghurToEnglish) {
      // Create Uyghur to English question
      const cleanEnglish = cleanText(item.english);
      const cleanUyghur = cleanText(item.uyghur);
      const options = [cleanEnglish];

      // Add 3 random wrong options
      const shuffledOthers = otherItems.sort(() => Math.random() - 0.5);
      for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
        options.push(cleanText(shuffledOthers[i].english));
      }

      // Shuffle options
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      exercises.push({
        question: `What is the English translation of "${cleanUyghur}"?`,
        options: shuffledOptions,
        correctAnswer: cleanEnglish,
      });
    } else {
      // Create English to Uyghur question
      const cleanEnglish = cleanText(item.english);
      const cleanUyghur = cleanText(item.uyghur);
      const reverseOptions = [cleanUyghur];
      const shuffledOthersForReverse = otherItems.sort(
        () => Math.random() - 0.5
      );
      for (let i = 0; i < 3 && i < shuffledOthersForReverse.length; i++) {
        reverseOptions.push(cleanText(shuffledOthersForReverse[i].uyghur));
      }

      const shuffledReverseOptions = reverseOptions.sort(
        () => Math.random() - 0.5
      );

      exercises.push({
        question: `What is the Uyghur translation of "${cleanEnglish}"?`,
        options: shuffledReverseOptions,
        correctAnswer: cleanUyghur,
      });
    }
  });

  return exercises;
}

function generateTypingQuestionsFromVocabulary(
  vocabulary: VocabularyItem[]
): TypingQuestion[] {
  const typingQuestions: TypingQuestion[] = [];

  vocabulary.forEach((item) => {
    // Randomly choose between Uyghur to English or English to Uyghur
    const isUyghurToEnglish = Math.random() < 0.5;

    if (isUyghurToEnglish) {
      // Uyghur to English typing question
      const cleanUyghur = cleanText(item.uyghur);
      typingQuestions.push({
        question: `Type the English translation of "${cleanUyghur}":`,
        correctAnswer: item.english.toLowerCase(),
        type: "uyghur-to-english",
        hint: item.definition,
      });
    } else {
      // English to Uyghur typing question
      const cleanEnglish = cleanText(item.english);
      typingQuestions.push({
        question: `Type the Uyghur translation of "${cleanEnglish}":`,
        correctAnswer: item.uyghur.toLowerCase(),
        type: "english-to-uyghur",
        hint: item.definition,
      });
    }
  });

  return typingQuestions;
}
