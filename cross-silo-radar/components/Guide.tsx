export function HowToUse() {
  return (
    <details className="group rounded-lg border border-rule bg-white">
      <summary className="cursor-pointer list-none px-5 py-4 font-serif text-lg marker:hidden">
        <span className="inline-block w-5 text-navy transition-transform group-open:rotate-90">›</span> How to use this with your own team
      </summary>
      <div className="grid gap-6 border-t border-rule px-5 py-5 text-[15px] leading-relaxed md:grid-cols-2">
        <section>
          <h3 className="mb-1 font-medium">1. Get the input</h3>
          <p className="mb-2">
            <strong className="font-medium">From a meeting.</strong> Record a team update meeting where each person says what
            they&rsquo;re working on and what they&rsquo;re stuck on. Then export the transcript:
          </p>
          <ul className="mb-2 list-disc space-y-1 pl-5">
            <li>Zoom: Recordings in the Zoom web portal, open the cloud recording, download the audio transcript (.vtt). Cloud recording and audio transcript must be on.</li>
            <li>Teams: open the meeting in the calendar or chat, go to Recap or Transcript, and download it as .vtt or .docx (paste .docx text).</li>
            <li>Otter or another notetaker: export as .txt with speaker names.</li>
          </ul>
          <p>
            <strong className="font-medium">By hand.</strong> Use team cards when you have no recording, or when people send
            short written updates instead. Three lines each is enough: what they own, what they learned, what they&rsquo;re
            still trying to figure out.
          </p>
        </section>
        <section>
          <h3 className="mb-1 font-medium">2. Review, then find matches</h3>
          <p className="mb-3">
            After a transcript is read, every person appears as an editable card. Fix names, remove anything sensitive, and
            add open questions people forgot to say out loud. Open questions drive the matching, so they matter most.
          </p>
          <h3 className="mb-1 font-medium">3. Read the results</h3>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>Radar: each arrow points from the person who knows something to the person it helps. Thick lines are strong matches. Click a person to focus on them.</li>
            <li>Dashed, hollow circles are people with no matches. That is a prompt to ask what they&rsquo;re learning, not a judgment.</li>
            <li>Digests: copy each person&rsquo;s digest and send it to them privately.</li>
          </ul>
          <h3 className="mb-1 font-medium">A weekly rhythm</h3>
          <p>
            Monday update meeting (15 minutes, recorded). Run the radar that afternoon and send digests. People hold the
            suggested conversations during the week. Next Monday, ask what came of them.
          </p>
        </section>
      </div>
    </details>
  );
}

export function Evidence() {
  const items = [
    {
      who: "Hackman, Collaborative Intelligence",
      what:
        "Hackman studied intelligence analysts who own their own judgments. Their typical failure is not bad group decisions; it is insight that never travels between people who need it. The radar exists to move that insight.",
    },
    {
      who: "Hackman, coacting groups vs. real teams",
      what:
        "Many teams are coacting groups: people work in parallel and own separate outputs. Forcing consensus on them destroys what makes them work. So the tool only recommends conversations, never decisions.",
    },
    {
      who: "Neeley, “Global Teams That Work”",
      what:
        "Social distance grows when people lack visibility into each other’s work. Isolation flags and the give-and-receive chart make that distance visible so a leader can close it.",
    },
    {
      who: "Haas, “5 Challenges of Hybrid Work”",
      what:
        "Coordination and connection are among the first things to break when people work apart. Match cards handle coordination; the weekly conversation in each digest builds connection.",
    },
    {
      who: "Farri & Rosani, “3 Ways AI Can Improve Team Meetings”",
      what:
        "In their “AI sets the table” mode, AI prepares people for better human conversations instead of replacing them, and a human still facilitates. Here the AI suggests who should talk and what to ask; the people have the conversation.",
    },
  ];
  return (
    <section aria-labelledby="evidence">
      <h2 id="evidence" className="mb-4 font-serif text-2xl">Evidence behind the design</h2>
      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {items.map((i) => (
          <div key={i.who}>
            <dt className="mb-1 font-medium">{i.who}</dt>
            <dd className="text-[15px] leading-relaxed text-steel">{i.what}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-sm leading-relaxed text-steel">
      Nothing you enter is stored. Your inputs are sent to an AI model only to run the extraction and analysis, then
      discarded when you close the page. Don&rsquo;t paste confidential material unless your organization allows it.
    </p>
  );
}
