// Normalizes Zoom/Teams/Otter exports (.vtt or .txt) into "Speaker: text" lines.
export function normalizeTranscript(raw: string): string {
  const lines = raw.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let pendingSpeaker: string | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (/^WEBVTT/i.test(line) || /^NOTE\b/.test(line)) continue;
    if (/^\d+$/.test(line)) continue; // cue numbers
    if (/-->/.test(line)) continue; // timestamps
    if (/^[0-9a-f-]{20,}(\/\d+-\d+)?$/i.test(line)) continue; // Teams cue ids

    // Teams VTT: <v Jane Doe>text</v>
    const vTag = line.match(/^<v\s+([^>]+)>(.*?)(<\/v>)?$/);
    if (vTag) {
      out.push(`${vTag[1].trim()}: ${vTag[2].trim()}`);
      continue;
    }
    // Otter style: speaker name on its own line followed by a timestamp line, then text
    const otterSpeaker = line.match(/^([A-Z][\w.'-]*(?:\s[A-Z][\w.'-]*){0,3})\s+\d{1,2}:\d{2}(?::\d{2})?$/);
    if (otterSpeaker) {
      pendingSpeaker = otterSpeaker[1];
      continue;
    }
    // Strip leading [00:01:02] or 00:01:02 timestamps
    line = line.replace(/^\[?\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?\]?\s*/, "");
    if (pendingSpeaker && !/^[^:]{1,40}:\s/.test(line)) {
      out.push(`${pendingSpeaker}: ${line}`);
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

export function detectSpeakers(normalized: string): string[] {
  const counts = new Map<string, number>();
  for (const line of normalized.split("\n")) {
    const m = line.match(/^([^:]{1,40}):\s/);
    if (m) counts.set(m[1].trim(), (counts.get(m[1].trim()) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}
