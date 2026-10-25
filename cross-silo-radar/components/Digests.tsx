"use client";
import { useState } from "react";
import type { PersonDigest } from "@/lib/types";

function asText(d: PersonDigest, teamName: string): string {
  const list = (items: string[]) => (items.length ? items.map((i) => `- ${i}`).join("\n") : "- Nothing this week.");
  return [
    `Hi ${d.name.split(" ")[0]},`,
    "",
    `Here's your cross-silo digest${teamName ? ` for ${teamName}` : ""} this week.`,
    "",
    "Things your colleagues know that bear on your work:",
    list(d.things_to_know_from_colleagues),
    "",
    "Who could use what you know:",
    list(d.who_could_use_what_you_know),
    "",
    `One conversation this week: ${d.one_conversation_this_week}`,
  ].join("\n");
}

export default function Digests({ digests, teamName }: { digests: PersonDigest[]; teamName: string }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const d = digests[Math.min(active, digests.length - 1)];
  if (!d) return <p className="text-steel">No digests were generated.</p>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText(d, teamName));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist" aria-label="Team members">
        {digests.map((p, i) => (
          <button
            key={p.name}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-md px-3 py-2 text-left text-[15px] ${
              i === active ? "bg-navy text-white" : "text-ink hover:bg-navy-haze"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <article className="rounded-lg border border-rule bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-serif text-2xl">For {d.name}</h3>
          <button className="btn-quiet" onClick={copy}>
            {copied ? "Copied" : "Copy digest"}
          </button>
        </div>
        <h4 className="mb-2 text-sm text-steel">Things your colleagues know that bear on your work</h4>
        <ul className="mb-5 list-disc space-y-1.5 pl-5 leading-relaxed">
          {d.things_to_know_from_colleagues.length ? (
            d.things_to_know_from_colleagues.map((t, i) => <li key={i}>{t}</li>)
          ) : (
            <li className="text-steel">Nothing this week.</li>
          )}
        </ul>
        <h4 className="mb-2 text-sm text-steel">Who could use what you know</h4>
        <ul className="mb-5 list-disc space-y-1.5 pl-5 leading-relaxed">
          {d.who_could_use_what_you_know.length ? (
            d.who_could_use_what_you_know.map((t, i) => <li key={i}>{t}</li>)
          ) : (
            <li className="text-steel">Nothing this week.</li>
          )}
        </ul>
        <div className="rounded-md bg-brass-soft px-4 py-3">
          <h4 className="mb-1 text-sm text-brass">One conversation this week</h4>
          <p className="font-serif text-lg leading-snug">{d.one_conversation_this_week}</p>
        </div>
      </article>
    </div>
  );
}
