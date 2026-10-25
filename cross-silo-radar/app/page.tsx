"use client";

import { useMemo, useRef, useState } from "react";
import MemberCards from "@/components/MemberCards";
import RadarGraph from "@/components/RadarGraph";
import MatchCards from "@/components/MatchCards";
import Digests from "@/components/Digests";
import FlowChart from "@/components/FlowChart";
import { Evidence, HowToUse, PrivacyNote } from "@/components/Guide";
import { SAMPLES, type Sample } from "@/lib/samples";
import { computeFlow, uid } from "@/lib/flow";
import { detectSpeakers, normalizeTranscript } from "@/lib/transcript";
import type { Analysis, Member } from "@/lib/types";

type Mode = "transcript" | "cards";
type ResultTab = "matches" | "digests";

const blankMember = (): Member => ({ id: uid(), name: "", focus: "", findings: "", questions: "" });

const KEY_HELP =
  "The AI isn't connected yet. Whoever deployed this app needs to add an ANTHROPIC_API_KEY environment variable (in Vercel: Project Settings, Environment Variables) and redeploy. The two samples still work and show example results.";

export default function Home() {
  const [mode, setMode] = useState<Mode>("transcript");
  const [transcript, setTranscript] = useState("");
  const [members, setMembers] = useState<Member[]>([blankMember(), blankMember()]);
  const [teamName, setTeamName] = useState("");
  const [sample, setSample] = useState<Sample | null>(null);
  const [sampleEdited, setSampleEdited] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzedMembers, setAnalyzedMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<ResultTab>("matches");
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const speakers = useMemo(() => detectSpeakers(normalizeTranscript(transcript)), [transcript]);

  const loadSample = (s: Sample) => {
    setSample(s);
    setSampleEdited(false);
    setTeamName(s.teamName);
    setMembers(s.members.map((m) => ({ ...m })));
    setTranscript(s.transcript || "");
    setMode("cards");
    setAnalysis(null);
    setError(null);
    setNotice(null);
    setSelected(null);
  };

  const editMembers = (next: Member[]) => {
    setMembers(next);
    if (sample) setSampleEdited(true);
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTranscript(String(reader.result || ""));
      setSample(null);
    };
    reader.readAsText(file);
  };

  const extract = async () => {
    setError(null);
    setNotice(null);
    setExtracting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript: normalizeTranscript(transcript) }),
      });
      const data = await res.json();
      if (!res.ok) {
        const harbor = SAMPLES.find((s) => s.id === "harbor")!;
        if (data.error === "missing_key" && transcript.trim() === harbor.transcript?.trim()) {
          loadSample(harbor);
          setNotice("Showing pre-extracted cards for the sample transcript, because the AI isn't connected yet.");
          return;
        }
        throw new Error(data.error === "missing_key" ? KEY_HELP : data.error || "Extraction failed.");
      }
      const extracted: Member[] = (data.members || []).map((m: Omit<Member, "id">) => ({ ...m, id: uid() }));
      if (extracted.length === 0) throw new Error("No team members were found. Check that the transcript has speaker names.");
      setMembers(extracted);
      setMode("cards");
      setNotice(`Found ${extracted.length} people. Review their cards, fix anything that's off, then find matches.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setExtracting(false);
    }
  };

  const showResults = (a: Analysis, used: Member[]) => {
    setAnalysis({ ...a, knowledge_flow: computeFlow(used, a.matches) });
    setAnalyzedMembers(used);
    setSelected(null);
    setTab("matches");
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const analyze = async () => {
    const used = members.filter((m) => m.name.trim());
    if (used.length < 2) {
      setError("Add at least two team members with names.");
      return;
    }
    setError(null);
    setNotice(null);
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ members: used }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "missing_key" && sample && !sampleEdited) {
          showResults(sample.example, used);
          setNotice("These are example results for the sample team. Connect an API key to run your own data live.");
          return;
        }
        throw new Error(data.error === "missing_key" ? KEY_HELP : data.error || "Analysis failed.");
      }
      showResults(data as Analysis, used);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const isolatedNames = analysis?.isolation_flags.map((f) => f.name) || [];
  const strongCount = analysis?.matches.filter((m) => m.strength === "high").length || 0;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <header className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h1 className="mb-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">Cross-Silo Radar</h1>
          <p className="max-w-prose text-lg leading-relaxed text-steel">
            For teams where everyone owns their own work and their own decisions. Find the places where one person&rsquo;s
            knowledge answers another person&rsquo;s open question, and turn them into a short list of conversations worth
            having this week.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <span className="text-sm text-steel">Try it with a fictional team</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button key={s.id} className="btn-quiet" onClick={() => loadSample(s)}>
                Load {s.label.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mb-10">
        <HowToUse />
      </div>

      <section aria-labelledby="step1" className="mb-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 id="step1" className="font-serif text-3xl">1. Add your team</h2>
          <label className="flex items-center gap-2 text-sm text-steel">
            Team name
            <input className="field w-56 py-1.5" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Optional" />
          </label>
        </div>

        <div className="mb-6 flex gap-6 border-b border-rule" role="tablist" aria-label="Input method">
          <button role="tab" aria-selected={mode === "transcript"} className={`tab ${mode === "transcript" ? "tab-active" : ""}`} onClick={() => setMode("transcript")}>
            From a meeting transcript
          </button>
          <button role="tab" aria-selected={mode === "cards"} className={`tab ${mode === "cards" ? "tab-active" : ""}`} onClick={() => setMode("cards")}>
            Team cards ({members.filter((m) => m.name.trim()).length})
          </button>
        </div>

        {mode === "transcript" ? (
          <div>
            <textarea
              className="field min-h-[280px] font-mono text-sm"
              placeholder={"Paste a transcript with speaker names, for example:\n\nJordan Lee: I'm still on the Acme account. The renewal call surfaced a pricing issue...\nSam Park: I've been looking at onboarding drop-off..."}
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                setSample(null);
              }}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button className="btn-primary" onClick={extract} disabled={extracting || transcript.trim().length < 40}>
                {extracting ? "Reading transcript…" : "Read transcript"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.vtt,text/plain,text/vtt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              <button className="btn-quiet" onClick={() => fileRef.current?.click()}>
                Upload .txt or .vtt
              </button>
              <button
                className="btn-quiet"
                onClick={() => {
                  setTranscript(SAMPLES[0].transcript || "");
                  setSample(null);
                }}
              >
                Paste sample transcript
              </button>
              {speakers.length > 0 && (
                <span className="text-sm text-steel">Speakers detected: {speakers.join(", ")}</span>
              )}
            </div>
          </div>
        ) : (
          <MemberCards members={members} onChange={editMembers} onAdd={() => editMembers([...members, blankMember()])} />
        )}
      </section>

      {notice && <p className="mb-6 rounded-md border border-navy/20 bg-navy-haze px-4 py-3 text-[15px]">{notice}</p>}
      {error && (
        <p role="alert" className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-[15px] text-red-900">
          {error}
        </p>
      )}

      <section aria-labelledby="step2" className="mb-16 flex flex-col gap-4 border-y border-rule py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="step2" className="mb-1 font-serif text-3xl">2. Find matches</h2>
          <p className="max-w-prose text-steel">The AI suggests conversations only. It never recommends a decision.</p>
        </div>
        <button className="btn-primary px-6 py-3 text-base" onClick={analyze} disabled={analyzing}>
          {analyzing ? "Finding matches…" : "Find matches"}
        </button>
      </section>

      <div ref={resultsRef} className="scroll-mt-6">
        {analysis && (
          <section aria-labelledby="results" className="mb-20">
            <h2 id="results" className="mb-2 font-serif text-3xl">
              {teamName ? `${teamName}: ` : ""}
              {analysis.matches.length} {analysis.matches.length === 1 ? "match" : "matches"} across{" "}
              {analyzedMembers.length} people
            </h2>
            <p className="mb-8 text-steel">
              {strongCount} strong. {isolatedNames.length ? `${isolatedNames.length} ${isolatedNames.length === 1 ? "person" : "people"} not yet connected.` : "Everyone is connected to at least one colleague."}
            </p>

            <div className="mb-12 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
              <div className="self-start rounded-lg border border-rule bg-white p-3 sm:p-5">
                <RadarGraph
                  names={analyzedMembers.map((m) => m.name)}
                  matches={analysis.matches}
                  isolated={isolatedNames}
                  selected={selected}
                  onSelect={setSelected}
                />
                <p className="px-2 pb-1 text-sm text-steel">
                  Arrows point from the person who knows to the person it helps. Click a name to focus.
                  {selected && (
                    <button className="ml-2 text-navy underline" onClick={() => setSelected(null)}>
                      Show everyone
                    </button>
                  )}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-serif text-xl">Not yet connected</h3>
                  {analysis.isolation_flags.length === 0 ? (
                    <p className="text-[15px] text-steel">Nobody is isolated this week.</p>
                  ) : (
                    <ul className="space-y-3">
                      {analysis.isolation_flags.map((f) => (
                        <li key={f.name} className="rounded-lg border border-dashed border-brass/60 bg-white p-4 text-[15px] leading-relaxed">
                          <p className="mb-1 font-serif text-lg">{f.name}</p>
                          <p className="mb-2 text-steel">{f.reason}</p>
                          <p>{f.suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="mb-3 font-serif text-xl">Knowledge flow</h3>
                  <FlowChart rows={analysis.knowledge_flow} />
                </div>
              </div>
            </div>

            <div className="mb-6 flex gap-6 border-b border-rule" role="tablist" aria-label="Results">
              {(
                [
                  ["matches", selected ? `Matches for ${selected}` : "Match cards"],
                  ["digests", "Personal digests"],
                ] as [ResultTab, string][]
              ).map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? "tab-active" : ""}`} onClick={() => setTab(k)}>
                  {label}
                </button>
              ))}
            </div>
            {tab === "matches" && <MatchCards matches={analysis.matches} selected={selected} />}
            {tab === "digests" && <Digests digests={analysis.person_digests} teamName={teamName} />}
          </section>
        )}
      </div>

      <div className="mb-12">
        <Evidence />
      </div>
      <footer className="border-t border-rule pt-6">
        <PrivacyNote />
      </footer>
    </main>
  );
}
