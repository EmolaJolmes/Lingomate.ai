import { createServerFn } from "@tanstack/react-start";
import { callGemini } from "./gemini.server";

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export const generateLessonFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const o = input as { language?: string; level?: string; topic?: string };
    if (!o?.language || !o?.level || !o?.topic) throw new Error("Missing fields");
    return { language: String(o.language), level: String(o.level), topic: String(o.topic) };
  })
  .handler(async ({ data }) => {
    const { language, level, topic } = data;
    const content = await callGemini([
      {
        role: "system",
        content:
          "You are LingoMate AI, an expert language teacher. Produce a clear, well-structured lesson in Markdown. Use headings (##), bold, bullet lists, and numbered lists. Include: introduction, key vocabulary (5-8 words with translations and example sentences), grammar focus, an example dialogue, and practice exercises. Be encouraging.",
      },
      {
        role: "user",
        content: `Create a ${level}-level ${language} lesson about "${topic}". The learner is a student. Respond in Markdown only.`,
      },
    ]);
    return { lesson: content };
  });

export const generateQuizFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const o = input as { language?: string; difficulty?: string; topic?: string };
    if (!o?.language || !o?.difficulty || !o?.topic) throw new Error("Missing fields");
    return {
      language: String(o.language),
      difficulty: String(o.difficulty),
      topic: String(o.topic),
    };
  })
  .handler(async ({ data }) => {
    const { language, difficulty, topic } = data;
    const raw = await callGemini(
      [
        {
          role: "system",
          content:
            'You are LingoMate AI, an expert language quiz author. Respond with STRICT JSON only, matching this shape: {"questions":[{"question":string,"options":[string,string,string,string],"answerIndex":number,"explanation":string}]}. Provide exactly 5 questions. answerIndex is the 0-based index into options. No prose, no markdown, no code fences.',
        },
        {
          role: "user",
          content: `Create a ${difficulty} ${language} quiz about "${topic}" with 5 multiple-choice questions. Questions and options should be in a mix of ${language} and English as appropriate for the difficulty.`,
        },
      ],
      { jsonMode: true },
    );

    let parsed: { questions?: QuizQuestion[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Attempt to salvage JSON from code fences if the model wrapped it.
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("The AI response was not valid JSON.");
      parsed = JSON.parse(match[0]);
    }
    const questions = (parsed.questions ?? []).filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.answerIndex === "number",
    );
    if (questions.length === 0) throw new Error("The AI returned no valid questions.");
    return { questions };
  });

export const chatReplyFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const o = input as { messages?: { role?: string; content?: string }[] };
    if (!Array.isArray(o?.messages)) throw new Error("Missing messages");
    const messages = o.messages
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content) }));
    return { messages };
  })
  .handler(async ({ data }) => {
    const reply = await callGemini([
      {
        role: "system",
        content:
          "You are LingoMate AI, a friendly and patient language tutor. Have a natural conversation with the student. Help them practice, correct their mistakes gently, explain grammar and vocabulary when useful, and switch languages when it helps learning. Keep responses concise and encouraging.",
      },
      ...data.messages,
    ]);
    return { reply };
  });
