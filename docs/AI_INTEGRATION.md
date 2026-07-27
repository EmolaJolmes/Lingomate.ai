# AI Integration Documentation

LingoMate AI uses the **Lovable AI Gateway** (OpenAI-compatible) to call Google's
`google/gemini-3.6-flash` model. All prompts run server-side via TanStack Start
server functions in [`src/lib/ai.functions.ts`](../src/lib/ai.functions.ts). The
low-level HTTP call lives in [`src/lib/gemini.server.ts`](../src/lib/gemini.server.ts)
and reads `LOVABLE_API_KEY` from the server environment — the key is never
exposed to the browser.

Common request shape:

```json
{
  "model": "google/gemini-3.6-flash",
  "messages": [
    { "role": "system", "content": "<application instructions>" },
    { "role": "user",   "content": "<user prompt>" }
  ]
}
```

The Quiz Generator additionally sets `response_format: { "type": "json_object" }`.

---

## 1. Lesson Generator

**Server function:** `generateLessonFn`
**Route:** `/lessons`

### Input variables

| Variable   | Type   | Example                          |
| ---------- | ------ | -------------------------------- |
| `language` | string | `"Spanish"`                      |
| `level`    | string | `"Beginner"` \| `"Intermediate"` \| `"Advanced"` |
| `topic`    | string | `"Ordering food at a restaurant"` |

### Application instructions (system prompt)

> You are LingoMate AI, an expert language teacher. Produce a clear,
> well-structured lesson in Markdown. Use headings (##), bold, bullet lists, and
> numbered lists. Include: introduction, key vocabulary (5-8 words with
> translations and example sentences), grammar focus, an example dialogue, and
> practice exercises. Be encouraging.

### User prompt template

```
Create a {{level}}-level {{language}} lesson about "{{topic}}".
The learner is a student. Respond in Markdown only.
```

### Expected output format

A single Markdown string containing:

- `##` section headings (Introduction, Vocabulary, Grammar, Dialogue, Practice)
- **Bold** key terms, bullet and numbered lists
- 5–8 vocabulary items with translations and example sentences
- A short example dialogue
- Practice exercises at the end

Rendered client-side by the `<Markdown />` component.

### Complete prompt template

````markdown
**System**
You are LingoMate AI, an expert language teacher. Produce a clear, well-structured
lesson in Markdown. Use headings (##), bold, bullet lists, and numbered lists.
Include: introduction, key vocabulary (5-8 words with translations and example
sentences), grammar focus, an example dialogue, and practice exercises. Be
encouraging.

**User**
Create a {{level}}-level {{language}} lesson about "{{topic}}". The learner is a
student. Respond in Markdown only.
````

---

## 2. Quiz Generator

**Server function:** `generateQuizFn`
**Route:** `/quiz`
**Response mode:** `response_format: { type: "json_object" }`

### Input variables

| Variable     | Type   | Example                           |
| ------------ | ------ | --------------------------------- |
| `language`   | string | `"French"`                        |
| `difficulty` | string | `"Easy"` \| `"Medium"` \| `"Hard"` |
| `topic`      | string | `"Common verbs in the present tense"` |

### Application instructions (system prompt)

> You are LingoMate AI, an expert language quiz author. Respond with STRICT JSON
> only, matching this shape:
> `{"questions":[{"question":string,"options":[string,string,string,string],"answerIndex":number,"explanation":string}]}`.
> Provide exactly 5 questions. `answerIndex` is the 0-based index into
> `options`. No prose, no markdown, no code fences.

### User prompt template

```
Create a {{difficulty}} {{language}} quiz about "{{topic}}" with 5
multiple-choice questions. Questions and options should be in a mix of
{{language}} and English as appropriate for the difficulty.
```

### Expected output format

Strict JSON — parsed with `JSON.parse` and validated on the server:

```json
{
  "questions": [
    {
      "question": "How do you say 'hello' in French?",
      "options": ["Bonjour", "Gracias", "Ciao", "Hallo"],
      "answerIndex": 0,
      "explanation": "'Bonjour' is the standard French greeting."
    }
  ]
}
```

Rules enforced by the app:

- Exactly 5 items in `questions`
- Each `options` array has at least 2 entries (UI renders 4)
- `answerIndex` is a 0-based integer into `options`
- Invalid or empty responses raise a friendly error to the user

### Complete prompt template

````markdown
**System**
You are LingoMate AI, an expert language quiz author. Respond with STRICT JSON
only, matching this shape:
`{"questions":[{"question":string,"options":[string,string,string,string],"answerIndex":number,"explanation":string}]}`.
Provide exactly 5 questions. `answerIndex` is the 0-based index into `options`.
No prose, no markdown, no code fences.

**User**
Create a {{difficulty}} {{language}} quiz about "{{topic}}" with 5 multiple-choice
questions. Questions and options should be in a mix of {{language}} and English
as appropriate for the difficulty.
````

---

## 3. Conversation Practice (Chat)

**Server function:** `chatReplyFn`
**Route:** `/chat`

### Input variables

| Variable   | Type                                                     | Notes                                    |
| ---------- | -------------------------------------------------------- | ---------------------------------------- |
| `messages` | `Array<{ role: "user" \| "assistant"; content: string }>` | Full prior chat history sent every turn. |

The server prepends its own system message and forwards the client history to
the model, so multi-turn context is preserved without any database.

### Application instructions (system prompt)

> You are LingoMate AI, a friendly and patient language tutor. Have a natural
> conversation with the student. Help them practice, correct their mistakes
> gently, explain grammar and vocabulary when useful, and switch languages when
> it helps learning. Keep responses concise and encouraging.

### User prompt template

The user prompt is whatever the learner types. The full message array sent to
Gemini is:

```
[system]    <application instructions above>
[user]      <message 1 from learner>
[assistant] <reply 1 from tutor>
...
[user]      <latest message from learner>
```

### Expected output format

A single plain-text / light-Markdown assistant reply string, returned as
`{ reply: string }` and rendered in the chat bubble via `<Markdown compact />`.
No JSON, no schema — free-form conversational text.

### Complete prompt template

````markdown
**System**
You are LingoMate AI, a friendly and patient language tutor. Have a natural
conversation with the student. Help them practice, correct their mistakes
gently, explain grammar and vocabulary when useful, and switch languages when it
helps learning. Keep responses concise and encouraging.

**Messages** (repeated each turn, in order)
- user: "{{message_1}}"
- assistant: "{{reply_1}}"
- ...
- user: "{{latest_message}}"
````

---

## Error handling (all three features)

Handled centrally in `callGemini` (`src/lib/gemini.server.ts`):

| Status | User-facing message                                             |
| ------ | --------------------------------------------------------------- |
| 429    | "AI is busy right now. Please try again in a moment."           |
| 402    | "AI credits exhausted. Please add credits to continue."         |
| other  | "The AI service returned an error. Please try again."           |
| empty  | "The AI returned an empty response."                            |

Each page (`/lessons`, `/quiz`, `/chat`) shows a loading spinner while the
server function is in flight and surfaces the error message inline on failure.
