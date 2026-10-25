export type Member = {
  id: string;
  name: string;
  focus: string; // companies, themes, workstream
  findings: string; // recent findings or notes
  questions: string; // open questions
};

export type Strength = "high" | "medium";

export type Match = {
  from_person: string;
  to_person: string;
  what_from_knows: string;
  how_it_helps_to: string;
  suggested_question_to_ask: string;
  strength: Strength;
};

export type PersonDigest = {
  name: string;
  things_to_know_from_colleagues: string[];
  who_could_use_what_you_know: string[];
  one_conversation_this_week: string;
};

export type IsolationFlag = { name: string; reason: string; suggestion: string };

export type FlowRow = { name: string; given: number; received: number };

export type Analysis = {
  matches: Match[];
  person_digests: PersonDigest[];
  isolation_flags: IsolationFlag[];
  knowledge_flow: FlowRow[];
};
