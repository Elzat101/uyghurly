import fs from "fs";
import path from "path";

interface VocabularyItem {
  uyghur: string;
  english: string;
  definition: string;
}

interface Lesson {
  title: string;
  slug: string;
  description: string;
  unit: string;
  vocabulary: VocabularyItem[];
  exercises: unknown[];
}

// Function to remove parentheses and their contents from a string
function removeParentheses(text: string): string {
  return text.replace(/\([^)]*\)/g, "").trim();
}

// Function to clean a lesson file
function cleanLessonFile(filePath: string): void {
  try {
    console.log(`Processing: ${filePath}`);

    // Read the file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lessons = JSON.parse(fileContent);

    let cleanedCount = 0;

    // Process each lesson
    lessons.forEach((lesson: Lesson) => {
      if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
        lesson.vocabulary.forEach((vocab: VocabularyItem) => {
          if (vocab.uyghur) {
            const original = vocab.uyghur;
            const cleaned = removeParentheses(original);
            if (original !== cleaned) {
              console.log(`  Cleaned: "${original}" -> "${cleaned}"`);
              vocab.uyghur = cleaned;
              cleanedCount++;
            }
          }
        });
      }
    });

    // Write the cleaned data back to the file
    fs.writeFileSync(filePath, JSON.stringify(lessons, null, 2), "utf8");
    console.log(`  ✅ Cleaned ${cleanedCount} words in ${filePath}\n`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

// Main function to clean all lesson files
export function cleanAllLessonFiles(): void {
  const lessonsDir = path.join(process.cwd(), "src", "lessons_by_unit_bundle");

  // List of lesson files to process
  const lessonFiles = [
    "basics_lessons.json",
    "basics_pt2_lessons.json",
    "basic_vocabulary_lessons.json",
    "daily_life_lessons.json",
    "describing_lessons.json",
    "food_lessons.json",
    "health_lessons.json",
    "home_lessons.json",
    "nature_and_environment_lessons.json",
    "people_lessons.json",
    "school_lessons.json",
    "shopping_and_money_lessons.json",
    "travel_lessons.json",
  ];

  console.log("🧹 Starting lesson data cleaning...\n");

  lessonFiles.forEach((fileName) => {
    const filePath = path.join(lessonsDir, fileName);
    if (fs.existsSync(filePath)) {
      cleanLessonFile(filePath);
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  });

  console.log("🎉 Lesson data cleaning completed!");
}

// Run the cleaning if this file is executed directly
if (require.main === module) {
  cleanAllLessonFiles();
}
