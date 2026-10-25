"use client";
import type { Match } from "@/lib/types";

type Props = {
  names: string[];
  matches: Match[];
  isolated: string[];
  selected: string | null;
  onSelect: (name: string | null) => void;
};

const C = 300;
const R = 205;

export default function RadarGraph({ names, matches, isolated, selected, onSelect }: Props) {
  const pos = new Map<string, { x: number; y: number; a: number }>();
  names.forEach((n, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(names.length, 1);
    pos.set(n, { x: C + R * Math.cos(a), y: C + R * Math.sin(a), a });
  });

  const involves = (m: Match) => !selected || m.from_person === selected || m.to_person === selected;

  return (
    <svg
      viewBox="-95 15 790 570"
      className="h-auto w-full"
      role="img"
      aria-label="Radar of team members connected by knowledge matches"
    >
      <defs>
        <marker id="arrow-high" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#1F3461" />
        </marker>
        <marker id="arrow-med" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#8C9AB8" />
        </marker>
        <radialGradient id="sweep" cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#1F3461" stopOpacity="0.12" />
          <stop offset="1" stopColor="#1F3461" stopOpacity="0" />
        </radialGradient>
      </defs>

      {[70, 140, 205, 260].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#D6DAE2" strokeWidth={r === 205 ? 1 : 0.75} strokeDasharray={r === 205 ? "" : "2 5"} />
      ))}
      <line x1={C - 260} y1={C} x2={C + 260} y2={C} stroke="#E6E9EF" />
      <line x1={C} y1={C - 260} x2={C} y2={C + 260} stroke="#E6E9EF" />
      <path className="radar-sweep" d={`M${C},${C} L${C},${C - 260} A260,260 0 0,1 ${C + 184},${C - 184} Z`} fill="#1F3461" opacity="0.05" />

      {matches.map((m, i) => {
        const a = pos.get(m.from_person);
        const b = pos.get(m.to_person);
        if (!a || !b) return null;
        // Curve each line toward the center; offset reverse-direction pairs so both stay visible.
        // Use a canonical direction for the normal so A→B and B→A bow to opposite sides.
        const forward = m.from_person < m.to_person;
        const p1 = forward ? a : b;
        const p2 = forward ? b : a;
        const reverse = forward ? 1 : -1;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const pull = 0.35;
        const cx = mx + (C - mx) * pull + nx * 26 * reverse;
        const cy = my + (C - my) * pull + ny * 26 * reverse;
        // Shorten the end so the arrow stops at the node edge.
        const ex = b.x - ((b.x - cx) / Math.hypot(b.x - cx, b.y - cy)) * 29;
        const ey = b.y - ((b.y - cy) / Math.hypot(b.x - cx, b.y - cy)) * 29;
        const sx = a.x + ((cx - a.x) / Math.hypot(cx - a.x, cy - a.y)) * 27;
        const sy = a.y + ((cy - a.y) / Math.hypot(cx - a.x, cy - a.y)) * 27;
        const high = m.strength === "high";
        const dim = !involves(m);
        return (
          <path
            key={i}
            d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
            fill="none"
            stroke={high ? "#1F3461" : "#8C9AB8"}
            strokeWidth={high ? 3.2 : 1.6}
            strokeLinecap="round"
            markerEnd={`url(#${high ? "arrow-high" : "arrow-med"})`}
            opacity={dim ? 0.12 : 0.9}
          >
            <title>{`${m.from_person} → ${m.to_person} (${m.strength})`}</title>
          </path>
        );
      })}

      {names.map((n) => {
        const p = pos.get(n)!;
        const iso = isolated.includes(n);
        const active = selected === n;
        const lx = C + (R + 40) * Math.cos(p.a);
        const ly = C + (R + 40) * Math.sin(p.a);
        const anchor = Math.abs(Math.cos(p.a)) < 0.3 ? "middle" : Math.cos(p.a) > 0 ? "start" : "end";
        const initials = n
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <g
            key={n}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`Show matches for ${n}`}
            onClick={() => onSelect(active ? null : n)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(active ? null : n);
              }
            }}
            className="cursor-pointer focus:outline-none"
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={24}
              fill={iso ? "#FFFFFF" : active ? "#14213D" : "#1F3461"}
              stroke={iso ? "#9A7A3F" : active ? "#9A7A3F" : "#1F3461"}
              strokeWidth={iso ? 2 : active ? 3 : 1}
              strokeDasharray={iso ? "3 3" : ""}
            />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill={iso ? "#9A7A3F" : "#FFFFFF"}>
              {initials}
            </text>
            <text
              x={lx}
              y={ly + 5}
              textAnchor={anchor}
              fontSize="19"
              fill="#14213D"
              style={{ fontFamily: '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif' }}
            >
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
