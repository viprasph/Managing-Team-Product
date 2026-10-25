"use client";
import type { Match } from "@/lib/types";

export default function MatchCards({ matches, selected }: { matches: Match[]; selected: string | null }) {
  const shown = matches
    .filter((m) => !selected || m.from_person === selected || m.to_person === selected)
    .sort((a, b) => (a.strength === b.strength ? 0 : a.strength === "high" ? -1 : 1));

  if (shown.length === 0) {
    return (
      <p className="text-steel">
        {selected ? `No matches involve ${selected} yet. See the isolation note for ideas.` : "No matches were found."}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {shown.map((m, i) => (
        <li
          key={i}
          className={`rounded-lg border bg-white p-5 ${m.strength === "high" ? "border-navy/40" : "border-rule"}`}
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-lg text-ink">
              {m.from_person} can help {m.to_person}
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs ${
                m.strength === "high" ? "bg-navy text-white" : "bg-navy-haze text-navy"
              }`}
            >
              {m.strength === "high" ? "Strong match" : "Worth a conversation"}
            </span>
          </div>
          <dl className="grid gap-3 text-[15px] leading-relaxed sm:grid-cols-[9rem_1fr]">
            <dt className="text-steel">{m.from_person.split(" ")[0]} knows</dt>
            <dd>{m.what_from_knows}</dd>
            <dt className="text-steel">Why it matters</dt>
            <dd>{m.how_it_helps_to}</dd>
            <dt className="text-steel">Ask</dt>
            <dd className="font-serif italic text-navy">&ldquo;{m.suggested_question_to_ask}&rdquo;</dd>
          </dl>
        </li>
      ))}
    </ul>
  );
}
