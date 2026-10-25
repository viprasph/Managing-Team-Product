import { NextResponse } from "next/server";
import { callClaudeJSON, MissingKeyError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You read transcripts of team update meetings. The team works in independent silos: each person owns a separate workstream (for example, different companies they cover, or different roles on a project).

For every person who speaks, extract what they are working on so a leader can find overlaps between silos later.

Return JSON only, no prose and no Markdown fences, in exactly this shape:
{"members":[{"name":"","focus":"","findings":"","questions":""}]}

Field rules:
- name: the speaker's name as it appears in the transcript.
- focus: their current workstream, companies, themes, or role. Semicolon-separated short phrases.
- findings: concrete things they recently learned, with specifics (numbers, sources, names of companies) when stated. One finding per line, each starting with "- ".
- questions: open questions, uncertainties, or things they said they are trying to figure out. One per line, each starting with "- ".
- Only use what the transcript says. If a field has nothing, use an empty string.
- Skip people who only facilitate and share no work of their own, unless they also report on a workstream.`;

export async function POST(req: Request) {
  try {
    const { transcript } = (await req.json()) as { transcript?: string };
    if (!transcript || transcript.trim().length < 40) {
      return NextResponse.json({ error: "Paste a transcript with at least a few lines of dialogue." }, { status: 400 });
    }
    const clipped = transcript.slice(0, 120_000);
    const result = await callClaudeJSON<{ members: { name: string; focus: string; findings: string; questions: string }[] }>(
      SYSTEM,
      `Transcript:\n\n${clipped}`,
      4000
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof MissingKeyError) {
      return NextResponse.json({ error: "missing_key" }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
