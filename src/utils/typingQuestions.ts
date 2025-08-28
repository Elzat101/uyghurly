import { TypingQuestion, VocabularyItem } from "@/types/lesson";

// Function to clean words by removing parts in parentheses and brackets
function cleanWord(word: string): string {
  // Remove content in parentheses () and brackets []
  return word
    .replace(/\([^)]*\)/g, "") // Remove parentheses and their content
    .replace(/\[[^\]]*\]/g, "") // Remove brackets and their content
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove extra whitespace
}

export function generateTypingQuestions(
  vocabulary: VocabularyItem[]
): TypingQuestion[] {
  const typingQuestions: TypingQuestion[] = [];

  for (const word of vocabulary) {
    // Randomly choose between uyghur-to-english or english-to-uyghur
    const isUyghurToEnglish = Math.random() < 0.5;

    if (isUyghurToEnglish) {
      typingQuestions.push({
        question: `Write the English translation for "${cleanWord(
          word.uyghur
        )}":`,
        correctAnswer: cleanWord(word.english).toLowerCase(),
        type: "uyghur-to-english",
        hint: word.definition,
      });
    } else {
      typingQuestions.push({
        question: `Write the Uyghur word for "${cleanWord(word.english)}":`,
        correctAnswer: cleanWord(word.uyghur).toLowerCase(),
        type: "english-to-uyghur",
        hint: word.definition,
      });
    }
  }

  return typingQuestions;
}

export function normalizeAnswer(answer: string): string {
  return cleanWord(answer.toLowerCase().trim());
}

export function isCorrectAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

  // Check if the answers match exactly
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // If not, also check if the user included brackets/parentheses that were removed
  // This allows for flexible matching where users can include or exclude brackets
  const userWithBrackets = userAnswer.toLowerCase().trim();
  const correctWithBrackets = correctAnswer.toLowerCase().trim();

  return userWithBrackets === correctWithBrackets;
}
