// Server-only AI service. Uses Lovable AI Gateway (OpenAI-compatible) to call
// Google's Gemini models. The API key is read from process.env at request time
// and never sent to the browser.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callGemini(
  messages: ChatMessage[],
  opts: { jsonMode?: boolean } = {},
): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
  }

  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
  };
  if (opts.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    console.error(`AI Gateway error ${res.status}: ${text}`);
    throw new Error("The AI service returned an error. Please try again.");
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI returned an empty response.");
  return content;
}
