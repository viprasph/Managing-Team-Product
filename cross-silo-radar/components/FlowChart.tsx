import type { FlowRow } from "@/lib/types";

export default function FlowChart({ rows }: { rows: FlowRow[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.given, r.received]));
  return (
    <div>
      <div className="mb-4 flex gap-5 text-sm text-steel">
        <span className="flex items-center gap-2"><span className="inline-block h-2.5 w-5 rounded-sm bg-navy" /> Gave insight</span>
        <span className="flex items-center gap-2"><span className="inline-block h-2.5 w-5 rounded-sm bg-brass" /> Received insight</span>
      </div>
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[8rem_1fr] items-center gap-3 sm:grid-cols-[10rem_1fr]">
            <span className="truncate font-serif">{r.name}</span>
            <div className="space-y-1.5">
              {(["given", "received"] as const).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <div className="h-3 flex-1 rounded-sm bg-navy-haze">
                    <div
                      className={`h-3 rounded-sm ${k === "given" ? "bg-navy" : "bg-brass"}`}
                      style={{ width: `${(r[k] / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-sm tabular-nums text-steel">{r[k]}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-steel">
        Someone who gives a lot but receives little may be a natural broker who needs more in return. Someone who receives
        but never gives may hold knowledge that hasn&rsquo;t been surfaced yet. Ask what they&rsquo;re learning.
      </p>
    </div>
  );
}
