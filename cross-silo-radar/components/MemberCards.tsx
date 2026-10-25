"use client";
import type { Member } from "@/lib/types";

type Props = {
  members: Member[];
  onChange: (members: Member[]) => void;
  onAdd: () => void;
};

export default function MemberCards({ members, onChange, onAdd }: Props) {
  const update = (id: string, key: keyof Member, value: string) =>
    onChange(members.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
  const remove = (id: string) => onChange(members.filter((m) => m.id !== id));

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((m) => (
          <div key={m.id} className="rounded-lg border border-rule bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                aria-label="Name"
                className="field font-serif text-lg"
                placeholder="Name"
                value={m.name}
                onChange={(e) => update(m.id, "name", e.target.value)}
              />
              <button
                type="button"
                onClick={() => remove(m.id)}
                className="shrink-0 rounded-md px-2 py-2 text-sm text-steel hover:text-ink"
                aria-label={`Remove ${m.name || "member"}`}
              >
                Remove
              </button>
            </div>
            <label className="mb-1 block text-sm text-steel">What they own</label>
            <textarea
              className="field mb-3 min-h-[64px]"
              placeholder="Companies, themes, or role"
              value={m.focus}
              onChange={(e) => update(m.id, "focus", e.target.value)}
            />
            <label className="mb-1 block text-sm text-steel">Recent findings or notes</label>
            <textarea
              className="field mb-3 min-h-[96px]"
              placeholder="What they learned recently, with sources"
              value={m.findings}
              onChange={(e) => update(m.id, "findings", e.target.value)}
            />
            <label className="mb-1 block text-sm text-steel">Open questions</label>
            <textarea
              className="field min-h-[72px]"
              placeholder="What they're still trying to figure out"
              value={m.questions}
              onChange={(e) => update(m.id, "questions", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-rule text-steel hover:border-navy hover:text-navy"
        >
          Add team member
        </button>
      </div>
    </div>
  );
}
