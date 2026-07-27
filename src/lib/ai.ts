// Placeholder for Gemini API integration.
// Replace these mock implementations with real Gemini API calls when ready.
// Example: use `@google/generative-ai` on a server route with GEMINI_API_KEY.

async function fakeDelay(ms = 900) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateLesson(input: {
  language: string;
  level: string;
  topic: string;
}): Promise<string> {
  await fakeDelay();
  const { language, level, topic } = input;
  return `# ${topic} — ${language} (${level})

## Introduction
Welcome! In this lesson you will learn about **${topic}** in ${language}. This lesson is tailored to the *${level}* level.

## Key Vocabulary
- **Word 1** — meaning and example sentence.
- **Word 2** — meaning and example sentence.
- **Word 3** — meaning and example sentence.
- **Word 4** — meaning and example sentence.
- **Word 5** — meaning and example sentence.

## Grammar Focus
A short explanation of a grammar point related to *${topic}*, with three example sentences you can practice out loud.

## Example Dialogue
> **A:** A natural opening line about ${topic}.
> **B:** A natural response using today's vocabulary.
> **A:** A follow-up question.
> **B:** A closing reply.

## Practice
1. Translate three sentences using today's vocabulary.
2. Write a short paragraph (3–5 sentences) about ${topic}.
3. Record yourself speaking the dialogue above.

## Tip
Consistency beats intensity — 15 focused minutes daily compounds fast.

*(This is placeholder content — connect the Gemini API to generate real lessons.)*`;
}

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export async function generateQuiz(input: {
  language: string;
  topic: string;
  difficulty: string;
}): Promise<QuizQuestion[]> {
  await fakeDelay();
  const { language, topic, difficulty } = input;
  const base = `${topic} in ${language} (${difficulty})`;
  return Array.from({ length: 5 }).map((_, i) => ({
    question: `Sample question ${i + 1} about ${base}?`,
    options: [
      `Option A for Q${i + 1}`,
      `Option B for Q${i + 1}`,
      `Option C for Q${i + 1}`,
      `Option D for Q${i + 1}`,
    ],
    answerIndex: i % 4,
    explanation: `The correct answer relates to ${topic}. (Placeholder explanation — replace with Gemini output.)`,
  }));
}

export async function generateChatReply(
  history: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  await fakeDelay(700);
  const last = history[history.length - 1]?.content ?? "";
  return `That's a great point! Let's practice. You said: "${last}". Try saying it a slightly different way, and I'll help you refine it. (Placeholder reply — connect Gemini API for real conversation.)`;
}
