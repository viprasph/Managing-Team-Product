import type { Analysis, Member } from "./types";

// All people and companies below are fictional.

export type Sample = {
  id: "harbor" | "student";
  label: string;
  teamName: string;
  members: Member[];
  transcript?: string;
  example: Analysis; // pre-computed result shown if the API key is not configured
};

const harborMembers: Member[] = [
  {
    id: "h1",
    name: "Maya Chen",
    focus: "Keystone Property Software (property management software for small and mid-size landlords); competitors Hearth PM and Rentwise",
    findings:
      "- Two former Keystone customer-success managers: churn among landlords with under 50 units rose from about 14% to 19% annualized this year.\n- Most of those churned landlords sold their buildings to professional management firms rather than switching software.\n- Keystone's payments product is used on about 35% of units; management's target is 60% by 2028.",
    questions:
      "- Is Hearth PM raising prices downmarket, and would that push customers to Keystone?\n- How sticky is the payments product once a landlord adopts it?",
  },
  {
    id: "h2",
    name: "Daniel Ortiz",
    focus: "Ledgerline Payments (rent and HOA payment processing); software channel partners including Hearth PM and Keystone",
    findings:
      "- Former Ledgerline partnerships lead (call, Oct 14): Hearth PM moved to per-unit pricing in Q3, raising the effective price about 20% for portfolios under 500 units. Ledgerline then saw a jump in support tickets from Hearth customers asking about alternatives.\n- Same call: landlords who collect rent through integrated payments churn about half as often as those who don't.",
    questions:
      "- Is rent payment volume from small landlords still growing, or consolidating into professional managers?\n- Which property management software partners are gaining share in the under-500-unit segment?",
  },
  {
    id: "h3",
    name: "Priya Raman",
    focus: "Brightpath Insurance Systems (core software for property and casualty insurers); implementation timelines; services margin",
    findings:
      "- Brightpath's cloud migrations are averaging 18 to 24 months versus management's guidance of 14.\n- Two insurer customer calls: the bottleneck is scarce certified implementation consultants, not the software itself.\n- Implementation demand from mid-size insurers is the strongest it has been in three years.",
    questions:
      "- Are the systems-integration partners capacity-constrained, and is that getting better or worse?\n- Are insurers pushing back on implementation pricing?",
  },
  {
    id: "h4",
    name: "Sam Whitaker",
    focus: "Arclight Consulting (mid-market IT services and systems integrator); utilization; hiring",
    findings:
      "- Former Arclight practice director (call, Oct 9): the insurance practice has a 9-month backlog and has been under a hiring freeze since summer. Certified Brightpath consultants bill at about a 30% premium.\n- Arclight's mid-market clients are trimming discretionary consulting; renewals are flat year over year.",
    questions:
      "- Are mid-market companies shifting consulting budget toward AI tools?\n- Which Arclight practices are still growing?",
  },
  {
    id: "h5",
    name: "Leo Brandt",
    focus: "Corvid Analytics (AI analytics platform for mid-market operations teams)",
    findings:
      "- Six Corvid customer calls: four buyers said they funded Corvid by cancelling an outside consulting engagement, usually a reporting or BI project.\n- Corvid reports net revenue retention of about 118%.",
    questions:
      "- How do EU data-residency rules affect Corvid's European expansion?\n- Who are Corvid's real competitors: BI software vendors or consultants?",
  },
];

const harborTranscript = `Ruth Alvarez: Morning everyone. Quick round, what you're on and anything you're stuck on. Maya, start us off?
Maya Chen: Sure. Still on Keystone Property Software. I talked to two former customer-success managers last week. Churn for landlords under 50 units went from about 14 percent to 19 percent annualized this year.
Maya Chen: The interesting part is most of them didn't switch software. They sold their buildings to professional management firms.
Maya Chen: Payments is on about 35 percent of units and management wants 60 percent by 2028. Two things I can't figure out. Is Hearth PM raising prices downmarket, which could push people to Keystone? And how sticky is payments once a landlord turns it on?
Ruth Alvarez: Thanks. Daniel?
Daniel Ortiz: I'm on Ledgerline Payments, rent and HOA processing. Had a good call on the 14th with their former partnerships lead.
Daniel Ortiz: He said Hearth PM went to per-unit pricing in Q3. For portfolios under 500 units that's roughly a 20 percent price increase. Ledgerline saw a spike in tickets from Hearth customers asking about alternatives.
Daniel Ortiz: He also said landlords who collect rent through integrated payments churn about half as often.
Daniel Ortiz: My open questions: is small-landlord rent volume still growing or is it consolidating into professional managers? And which software partners are winning under 500 units?
Ruth Alvarez: Priya.
Priya Raman: Brightpath Insurance Systems. Cloud migrations are taking 18 to 24 months, and management guides to 14.
Priya Raman: Two insurer calls both said the problem is finding certified implementation consultants, not the software. Demand from mid-size insurers is the strongest in three years.
Priya Raman: What I want to know is whether the integration partners are capacity-constrained and if it's getting better or worse. And whether insurers are pushing back on implementation pricing.
Ruth Alvarez: Sam?
Sam Whitaker: Arclight Consulting. Former practice director, call on the 9th. Their insurance practice has a nine-month backlog and a hiring freeze since summer. Certified Brightpath people bill at about a 30 percent premium.
Sam Whitaker: Elsewhere it's soft. Mid-market clients are trimming discretionary consulting and renewals are flat.
Sam Whitaker: I'm trying to figure out whether that budget is moving to AI tools, and which practices are actually still growing.
Ruth Alvarez: Leo, last one.
Leo Brandt: Corvid Analytics. I did six customer calls. Four said they paid for Corvid by cancelling an outside consulting project, usually reporting or BI work.
Leo Brandt: Net revenue retention is around 118 percent. Open questions: EU data residency for their European push, and honestly who they compete with. BI vendors or consultants?
Ruth Alvarez: Great. Same time next week.`;

const harborExample: Analysis = {
  matches: [
    {
      from_person: "Daniel Ortiz",
      to_person: "Maya Chen",
      what_from_knows:
        "From a former Ledgerline partnerships lead: Hearth PM moved to per-unit pricing in Q3, about a 20% effective increase under 500 units, followed by a spike in Hearth customers asking about alternatives. Also: landlords on integrated payments churn about half as often.",
      how_it_helps_to:
        "Answers both of Maya's open questions: whether Hearth is raising prices downmarket, and how sticky payments is once adopted.",
      suggested_question_to_ask:
        "Did your Ledgerline contact say where those Hearth customers ended up, and is the 'half the churn' figure for small landlords specifically?",
      strength: "high",
    },
    {
      from_person: "Maya Chen",
      to_person: "Daniel Ortiz",
      what_from_knows:
        "From two former Keystone customer-success managers: churn among landlords under 50 units rose from about 14% to 19%, and most churned landlords sold to professional management firms rather than switching software.",
      how_it_helps_to:
        "Bears directly on Daniel's question of whether small-landlord rent volume is growing or consolidating into professional managers.",
      suggested_question_to_ask:
        "When those small landlords sell to management firms, do your contacts know whether the rent volume stays with the same payments provider?",
      strength: "high",
    },
    {
      from_person: "Sam Whitaker",
      to_person: "Priya Raman",
      what_from_knows:
        "From a former Arclight practice director: the insurance practice has a 9-month backlog and a hiring freeze since summer, and certified Brightpath consultants bill at about a 30% premium.",
      how_it_helps_to:
        "Directly addresses Priya's question about whether integration partners are capacity-constrained, and suggests it may be getting worse.",
      suggested_question_to_ask:
        "Did your Arclight contact say why the hiring freeze is in place despite the backlog, and whether it is expected to lift?",
      strength: "high",
    },
    {
      from_person: "Leo Brandt",
      to_person: "Sam Whitaker",
      what_from_knows:
        "From six Corvid customer calls: four buyers funded Corvid by cancelling an outside consulting engagement, usually a reporting or BI project.",
      how_it_helps_to:
        "First-hand evidence on Sam's question of whether mid-market companies are shifting consulting budget toward AI tools.",
      suggested_question_to_ask:
        "What size were the consulting projects your Corvid customers cancelled, and were any of them with firms like Arclight?",
      strength: "high",
    },
    {
      from_person: "Priya Raman",
      to_person: "Sam Whitaker",
      what_from_knows:
        "Brightpath implementation demand from mid-size insurers is the strongest in three years, with migrations running 18 to 24 months.",
      how_it_helps_to:
        "Relevant to Sam's question about which Arclight practices are still growing: it points to sustained demand behind the insurance practice backlog.",
      suggested_question_to_ask: "How long do you think the current wave of insurer migrations will last?",
      strength: "medium",
    },
    {
      from_person: "Sam Whitaker",
      to_person: "Leo Brandt",
      what_from_knows:
        "Arclight's mid-market clients are trimming discretionary consulting and renewals are flat.",
      how_it_helps_to:
        "Speaks to Leo's question about whether Corvid's real competitors are BI vendors or consultants, from the consultants' side of the same budget.",
      suggested_question_to_ask:
        "Does Arclight see AI analytics tools as taking its reporting and BI work, and are they responding to it?",
      strength: "medium",
    },
  ],
  person_digests: [
    {
      name: "Maya Chen",
      things_to_know_from_colleagues: [
        "Daniel heard from a former Ledgerline partnerships lead that Hearth PM raised effective prices about 20% under 500 units in Q3.",
        "Daniel's same source says landlords on integrated payments churn about half as often.",
      ],
      who_could_use_what_you_know: [
        "Daniel: your finding that churned small landlords are selling to professional managers bears on his rent-volume question.",
      ],
      one_conversation_this_week: "Talk with Daniel about Hearth's pricing change and payments stickiness.",
    },
    {
      name: "Daniel Ortiz",
      things_to_know_from_colleagues: [
        "Maya found small-landlord churn at Keystone rose from about 14% to 19%, mostly from landlords selling to professional managers.",
      ],
      who_could_use_what_you_know: [
        "Maya: your Hearth pricing and payments-churn findings answer both of her open questions.",
      ],
      one_conversation_this_week: "Talk with Maya about where small-landlord volume is going.",
    },
    {
      name: "Priya Raman",
      things_to_know_from_colleagues: [
        "Sam learned Arclight's insurance practice has a 9-month backlog and a hiring freeze, and certified Brightpath consultants bill at a 30% premium.",
      ],
      who_could_use_what_you_know: [
        "Sam: the strength of insurer implementation demand helps him see which Arclight practices are still growing.",
      ],
      one_conversation_this_week: "Talk with Sam about integration-partner capacity.",
    },
    {
      name: "Sam Whitaker",
      things_to_know_from_colleagues: [
        "Leo found four of six Corvid customers funded it by cancelling outside consulting projects.",
        "Priya sees the strongest insurer implementation demand in three years.",
      ],
      who_could_use_what_you_know: [
        "Priya: your Arclight backlog and hiring-freeze finding answers her capacity question.",
        "Leo: your view of flat consulting renewals helps him size up consultants as competitors.",
      ],
      one_conversation_this_week: "Talk with Leo about consulting budgets moving to AI tools.",
    },
    {
      name: "Leo Brandt",
      things_to_know_from_colleagues: [
        "Sam reports Arclight's mid-market clients are trimming discretionary consulting, with flat renewals.",
      ],
      who_could_use_what_you_know: [
        "Sam: your Corvid customer calls are direct evidence on whether consulting budget is moving to AI tools.",
      ],
      one_conversation_this_week:
        "Talk with Sam about who Corvid really competes with. Your EU data-residency question has no match yet; bring it to the next update.",
    },
  ],
  isolation_flags: [],
  knowledge_flow: [],
};

const studentMembers: Member[] = [
  {
    id: "s1",
    name: "Ana Lopez",
    focus: "Market research: market sizing for a campus food-waste app; campus dining operators; competing apps",
    findings:
      "- About 4,000 US colleges; roughly 60% outsource dining to one of three national contractors.\n- Existing food-rescue apps mostly target restaurants and bakeries, not campuses.",
    questions: "- How many dining halls already donate leftovers, and is that a substitute for us?",
  },
  {
    id: "s2",
    name: "Ben Okafor",
    focus: "Customer discovery: interviews with students and dining staff",
    findings:
      "- 14 interviews (9 students, 5 dining staff). Students like the idea but won't pay more than about $3 a month.\n- Two dining managers said waste-reduction targets are part of their contractor performance reviews, and they have a sustainability budget line.\n- 3 of 5 dining halls have a donation contract with a local food bank, but it only covers sealed, packaged food.",
    questions: "- Who controls purchasing decisions: the university or the dining contractor?",
  },
  {
    id: "s3",
    name: "Chloe Nguyen",
    focus: "Finance: unit economics, pricing model, break-even",
    findings: "- A $4/month student subscription needs about 6,500 paying students to break even.",
    questions: "- Is a business-to-business model (charging dining operators) viable, and what would they pay?",
  },
  {
    id: "s4",
    name: "Dev Patel",
    focus: "Product: MVP, pickup flow, notifications",
    findings: "- Prototype test with 6 students: pickups fail when the pickup window is under 30 minutes.",
    questions:
      "- Which notification channel do students actually check?\n- What food-safety rules limit what dining halls can list?",
  },
];

const studentExample: Analysis = {
  matches: [
    {
      from_person: "Ben Okafor",
      to_person: "Ana Lopez",
      what_from_knows:
        "From interviews: 3 of 5 dining halls have a food-bank donation contract, but it only covers sealed, packaged food.",
      how_it_helps_to:
        "Directly answers Ana's question about whether existing donations are a substitute: they are only a partial one, since cooked leftovers aren't covered.",
      suggested_question_to_ask: "Did any dining staff say what happens to cooked leftovers today?",
      strength: "high",
    },
    {
      from_person: "Ana Lopez",
      to_person: "Ben Okafor",
      what_from_knows: "About 60% of US colleges outsource dining to one of three national contractors.",
      how_it_helps_to:
        "Bears on Ben's question of who controls purchasing: at most campuses it is likely the contractor, not the university.",
      suggested_question_to_ask: "Do you know which contractors run the dining halls I interviewed?",
      strength: "high",
    },
    {
      from_person: "Ben Okafor",
      to_person: "Chloe Nguyen",
      what_from_knows:
        "Students won't pay more than about $3 a month, while dining managers have waste-reduction targets and a sustainability budget line.",
      how_it_helps_to:
        "Tests the $4 student price in Chloe's model and gives early evidence for her business-to-business question.",
      suggested_question_to_ask: "Did either dining manager give a sense of how big that sustainability budget is?",
      strength: "high",
    },
    {
      from_person: "Ana Lopez",
      to_person: "Chloe Nguyen",
      what_from_knows: "Dining is concentrated among three national contractors.",
      how_it_helps_to:
        "Relevant to Chloe's business-to-business model: a few large buyers means fewer, bigger deals and more negotiating power on their side.",
      suggested_question_to_ask: "Do you have any data on how those contractors buy software today?",
      strength: "medium",
    },
  ],
  person_digests: [
    {
      name: "Ana Lopez",
      things_to_know_from_colleagues: [
        "Ben found most dining-hall donation contracts cover only sealed food, so they are a partial substitute at most.",
      ],
      who_could_use_what_you_know: [
        "Ben: contractor concentration helps answer who controls purchasing.",
        "Chloe: a few large buyers changes how a business-to-business model works.",
      ],
      one_conversation_this_week: "Talk with Ben about donation contracts and who buys.",
    },
    {
      name: "Ben Okafor",
      things_to_know_from_colleagues: [
        "Ana found about 60% of colleges outsource dining to three national contractors.",
      ],
      who_could_use_what_you_know: [
        "Ana: your donation-contract finding answers her substitute question.",
        "Chloe: student willingness to pay and dining budgets test her pricing model.",
      ],
      one_conversation_this_week: "Talk with Chloe about willingness to pay before she finalizes the model.",
    },
    {
      name: "Chloe Nguyen",
      things_to_know_from_colleagues: [
        "Ben heard students cap out around $3 a month, below your $4 assumption.",
        "Ben heard dining managers have sustainability budgets.",
        "Ana found dining is concentrated among three contractors.",
      ],
      who_could_use_what_you_know: [],
      one_conversation_this_week: "Talk with Ben about what dining managers might pay.",
    },
    {
      name: "Dev Patel",
      things_to_know_from_colleagues: [],
      who_could_use_what_you_know: [],
      one_conversation_this_week:
        "Ask Ben to add your food-safety question to his next dining-staff interviews.",
    },
  ],
  isolation_flags: [
    {
      name: "Dev Patel",
      reason:
        "Neither of Dev's open questions (notification channels, food-safety rules) is touched by anyone else's work, and his pickup-window finding hasn't reached the people it affects.",
      suggestion:
        "Ben could add food-safety and notification questions to his next interviews, and Dev could share the 30-minute pickup finding with Chloe, since it limits how many meals can be rescued per day.",
    },
  ],
  knowledge_flow: [],
};

export const SAMPLES: Sample[] = [
  {
    id: "harbor",
    label: "Investment team",
    teamName: "Harbor Ridge Capital",
    members: harborMembers,
    transcript: harborTranscript,
    example: harborExample,
  },
  {
    id: "student",
    label: "Student venture team",
    teamName: "Second Helpings",
    members: studentMembers,
    example: studentExample,
  },
];
