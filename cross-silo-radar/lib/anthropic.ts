// Server-only helper for calling the Anthropic Messages API and parsing a JSON reply.
const API_URL = "https://api.anthropic.com/v1/messages";

export class MissingKeyError extends Error {}

export async function callClaudeJSON<T>(system: string, user: string, maxTokens = 6000): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new MissingKeyError("ANTHROPIC_API_KEY is not set");
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${detail.slice(0, 400)}`);
  }
  const data = await res.json();
  const text: string = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");
  return parseJSON<T>(text);
}

export function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.search(/[\[{]/);
  const endObj = cleaned.lastIndexOf("}");
  const endArr = cleaned.lastIndexOf("]");
  const end = Math.max(endObj, endArr);
  if (start === -1 || end === -1) throw new Error("The model did not return JSON.");
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
