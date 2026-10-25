import type { FlowRow, Match, Member } from "./types";

// Knowledge flow is computed from the matches themselves, so the chart always agrees with the match cards.
export function computeFlow(members: Member[], matches: Match[]): FlowRow[] {
  const rows = new Map<string, FlowRow>();
  for (const m of members) rows.set(m.name, { name: m.name, given: 0, received: 0 });
  for (const match of matches) {
    const from = rows.get(match.from_person) || { name: match.from_person, given: 0, received: 0 };
    const to = rows.get(match.to_person) || { name: match.to_person, given: 0, received: 0 };
    from.given += 1;
    to.received += 1;
    rows.set(from.name, from);
    rows.set(to.name, to);
  }
  return Array.from(rows.values());
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
