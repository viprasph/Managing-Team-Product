import { NextResponse } from "next/server";
import { callClaudeJSON, MissingKeyError } from "@/lib/anthropic";
import type { Analysis, Member } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You help a team whose members work independently in separate silos and own their own decisions. Your job is to find specific, non-obvious places where one person's knowledge would help another person's work, so insight travels between silos.

You never push the team toward consensus and you never recommend a decision (no buy, sell, pivot, or "you should conclude"). You only recommend conversations.

A match exists only when something one person knows (a finding, a source, a data point, a contact, a method) bears directly on a specific open question or focus area of another person. Ground every match in the inputs. Do not invent facts. Do not create vague matches such as "you both work on tech" or "you could share notes." Prefer fewer, sharper matches over many weak ones. A pair of people can have a match in each direction.

Return JSON only, with no prose and no Markdown fences, in exactly this shape:
{
  "matches": [{"from_person":"","to_person":"","what_from_knows":"","how_it_helps_to":"","suggested_question_to_ask":"","strength":"high"}],
  "person_digests": [{"name":"","things_to_know_from_colleagues":[""],"who_could_use_what_you_know":[""],"one_conversation_this_week":""}],
  "isolation_flags": [{"name":"","reason":"","suggestion":""}],
  "knowledge_flow": [{"name":"","given":0,"received":0}]
}

Field rules:
- what_from_knows: the specific thing from_person knows, with its source if given (one or two sentences).
- how_it_helps_to: name the exact open question or focus area of to_person it bears on, and why.
- suggested_question_to_ask: one question to_person can ask from_person, written in to_person's voice.
- strength: "high" if it directly answers or changes an open question; otherwise "medium". Omit anything weaker than medium.
- person_digests: one per member, addressed to that person in second person ("you"). Max 3 items in each list; each item names the colleague. one_conversation_this_week names one colleague and the topic.
- isolation_flags: members with no matches in either direction, or only very thin ones. reason says what is missing; suggestion is a gentle, concrete way to connect them (for example, a question they could bring to the next team update). Use an empty array if nobody is isolated.
- knowledge_flow: one row per member, counting matches given (as from_person) and received (as to_person).
- Use people's names exactly as given.`;

function render(members: Member[]): string {
  return members
    .map(
      (m) =>
        `### ${m.name}\nFocus: ${m.focus || "(none given)"}\nRecent findings or notes:\n${m.findings || "(none given)"}\nOpen questions:\n${m.questions || "(none given)"}`
    )
    .join("\n\n");
}

export async function POST(req: Request) {
  try {
    const { members } = (await req.json()) as { members?: Member[] };
    const usable = (members || []).filter((m) => m.name?.trim());
    if (usable.length < 2) {
      return NextResponse.json({ error: "Add at least two team members with names." }, { status: 400 });
    }
    const result = await callClaudeJSON<Analysis>(SYSTEM, `Team members:\n\n${render(usable).slice(0, 100_000)}`);
    return NextResponse.json({
      matches: result.matches || [],
      person_digests: result.person_digests || [],
      isolation_flags: result.isolation_flags || [],
      knowledge_flow: result.knowledge_flow || [],
    });
  } catch (err) {
    if (err instanceof MissingKeyError) {
      return NextResponse.json({ error: "missing_key" }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
