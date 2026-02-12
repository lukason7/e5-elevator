export interface Question {
  id: string;
  stage: number;
  text: string;
  type: "text" | "number" | "select" | "multi-select" | "radio" | "url";
  options?: { value: string; label: string }[];
  required: boolean;
  showIf?: { questionId: string; values: string[] };
  helpText?: string;
  placeholder?: string;
}

export const QUESTIONS: Question[] = [
  // Stage 2: Current Licensing
  {
    id: "current-license",
    stage: 2,
    text: "What is your current Microsoft 365 licensing tier?",
    type: "select",
    required: true,
    options: [
      { value: "e1", label: "Microsoft 365 E1" },
      { value: "e3", label: "Microsoft 365 E3" },
      { value: "business-premium", label: "Microsoft 365 Business Premium" },
      { value: "business-basic", label: "Microsoft 365 Business Basic" },
      { value: "other", label: "Other / Mixed" },
    ],
  },
  {
    id: "per-user-cost",
    stage: 2,
    text: "What is your current per-user monthly cost?",
    type: "text",
    required: false,
    placeholder: "e.g. £22.00",
    helpText: "Your current per-user/month price. Leave blank if unsure.",
  },
  {
    id: "licensed-users",
    stage: 2,
    text: "How many licensed users do you have?",
    type: "number",
    required: true,
    placeholder: "e.g. 350",
  },
  {
    id: "addon-licenses",
    stage: 2,
    text: "Do you have any add-on licenses?",
    type: "multi-select",
    required: false,
    helpText: "Select any standalone add-ons you currently pay for.",
    options: [
      { value: "defender-p1", label: "Defender for Endpoint P1" },
      { value: "defender-p2", label: "Defender for Endpoint P2" },
      { value: "defender-office-p1", label: "Defender for Office 365 P1" },
      { value: "defender-office-p2", label: "Defender for Office 365 P2" },
      { value: "entra-p1", label: "Entra ID P1" },
      { value: "entra-p2", label: "Entra ID P2" },
      { value: "intune", label: "Intune standalone" },
      { value: "intune-suite", label: "Intune Suite" },
      { value: "purview", label: "Purview add-on" },
      { value: "power-bi-pro", label: "Power BI Pro" },
      { value: "teams-phone", label: "Teams Phone" },
      { value: "none", label: "None" },
    ],
  },

  // Stage 3: Security Landscape
  {
    id: "current-security-tools",
    stage: 3,
    text: "What security tools do you currently use outside of Microsoft?",
    type: "multi-select",
    required: false,
    helpText: "Select categories — we'll ask for vendor names next.",
    options: [
      { value: "edr", label: "EDR / Endpoint Protection (e.g. CrowdStrike, SentinelOne)" },
      { value: "siem", label: "SIEM / Log Management (e.g. Splunk, Sentinel, QRadar)" },
      { value: "email-security", label: "Email Security Gateway (e.g. Proofpoint, Mimecast)" },
      { value: "dlp", label: "DLP (e.g. Symantec, Digital Guardian)" },
      { value: "identity", label: "PAM / Identity (e.g. CyberArk, SailPoint)" },
      { value: "casb", label: "CASB (e.g. Netskope, Zscaler)" },
      { value: "vulnerability", label: "Vulnerability Scanner (e.g. Tenable, Qualys)" },
      { value: "none", label: "None — we rely on Microsoft built-in" },
    ],
  },
  {
    id: "security-vendor-names",
    stage: 3,
    text: "Which specific vendors/products are you using?",
    type: "text",
    required: false,
    placeholder: "e.g. CrowdStrike Falcon, Proofpoint Essentials, Tenable.io",
    helpText: "List the specific products — this helps us calculate vendor consolidation savings.",
    showIf: {
      questionId: "current-security-tools",
      values: ["edr", "siem", "email-security", "dlp", "identity", "casb", "vulnerability"],
    },
  },
  {
    id: "security-incident",
    stage: 3,
    text: "Has your organisation experienced a security incident in the past 24 months?",
    type: "radio",
    required: true,
    options: [
      { value: "yes-major", label: "Yes — significant incident requiring response" },
      { value: "yes-minor", label: "Yes — minor incidents (phishing, malware blocked)" },
      { value: "no", label: "No known incidents" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "cyber-insurance",
    stage: 3,
    text: "Does your organisation have cyber insurance?",
    type: "radio",
    required: true,
    options: [
      { value: "yes-conditions", label: "Yes — with specific security requirements" },
      { value: "yes-basic", label: "Yes — basic policy" },
      { value: "no-considering", label: "No — but considering it" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "dora-status",
    stage: 3,
    text: "What is your DORA compliance status?",
    type: "select",
    required: false,
    helpText: "DORA applies to financial services firms operating in the EU.",
    showIf: { questionId: "industry", values: ["financial-services"] },
    options: [
      { value: "compliant", label: "Already compliant" },
      { value: "in-progress", label: "Working towards compliance" },
      { value: "not-started", label: "Not started" },
      { value: "not-applicable", label: "Not applicable to us" },
    ],
  },
  {
    id: "nis2-status",
    stage: 3,
    text: "Is NIS2 relevant to your organisation?",
    type: "select",
    required: false,
    helpText: "NIS2 applies to essential and important services in the EU, and may affect UK companies trading with the EU.",
    showIf: { questionId: "industry", values: ["energy", "healthcare", "public-sector", "manufacturing"] },
    options: [
      { value: "essential", label: "Yes — we're classified as an essential entity" },
      { value: "important", label: "Yes — we're classified as an important entity" },
      { value: "supply-chain", label: "Yes — we're in the supply chain of an essential entity" },
      { value: "not-applicable", label: "Not applicable" },
    ],
  },
  {
    id: "cyber-essentials-status",
    stage: 3,
    text: "What is your Cyber Essentials certification status?",
    type: "select",
    required: false,
    options: [
      { value: "ce-plus", label: "Cyber Essentials Plus certified" },
      { value: "ce", label: "Cyber Essentials certified" },
      { value: "working-towards", label: "Working towards certification" },
      { value: "considering", label: "Considering it" },
      { value: "no", label: "No plans currently" },
    ],
  },
  {
    id: "compliance-frameworks",
    stage: 3,
    text: "Which compliance frameworks are you working towards or maintaining?",
    type: "multi-select",
    required: false,
    options: [
      { value: "iso-27001", label: "ISO 27001" },
      { value: "soc2", label: "SOC 2" },
      { value: "nist-csf", label: "NIST CSF" },
      { value: "pci-dss", label: "PCI DSS" },
      { value: "gdpr", label: "GDPR (beyond basics)" },
      { value: "none", label: "None specifically" },
    ],
  },

  // Stage 4: Business Priorities
  {
    id: "evaluation-drivers",
    stage: 4,
    text: "What is driving this E5 evaluation?",
    type: "multi-select",
    required: true,
    helpText: "Select all that apply. This shapes the tone and focus of your business case.",
    options: [
      { value: "board-pressure", label: "Board/leadership pressure to improve security" },
      { value: "compliance-deadline", label: "Upcoming compliance deadline" },
      { value: "incident-response", label: "Response to a security incident" },
      { value: "cost-reduction", label: "Cost reduction through vendor consolidation" },
      { value: "vendor-consolidation", label: "Simplify security stack" },
      { value: "insurance-requirements", label: "Cyber insurance requirements" },
      { value: "contract-renewal", label: "Upcoming Microsoft EA/contract renewal" },
      { value: "digital-transformation", label: "Broader digital transformation initiative" },
    ],
  },
  {
    id: "presentation-audience",
    stage: 4,
    text: "Who will this business case be presented to?",
    type: "multi-select",
    required: true,
    helpText: "This adjusts the report tone — technical, financial, or strategic.",
    options: [
      { value: "cto", label: "CTO / CIO" },
      { value: "cfo", label: "CFO / Finance Director" },
      { value: "ciso", label: "CISO / Security Director" },
      { value: "board", label: "Board of Directors" },
      { value: "it-director", label: "IT Director / Head of IT" },
      { value: "procurement", label: "Procurement" },
    ],
  },
  {
    id: "budget-cycle",
    stage: 4,
    text: "When is your next budget cycle?",
    type: "select",
    required: false,
    helpText: "Helps set urgency context in the report.",
    options: [
      { value: "q1", label: "Q1 (Jan–Mar)" },
      { value: "q2", label: "Q2 (Apr–Jun)" },
      { value: "q3", label: "Q3 (Jul–Sep)" },
      { value: "q4", label: "Q4 (Oct–Dec)" },
      { value: "anytime", label: "Budget can be approved anytime" },
      { value: "unknown", label: "Don't know" },
    ],
  },

  // Stage 6: Pricing Input
  {
    id: "e5-quoted-price",
    stage: 6,
    text: "What E5 per-user/month price have you been quoted?",
    type: "text",
    required: false,
    placeholder: "e.g. £50.00",
    helpText: "Leave blank if you haven't received a quote yet. We'll use list pricing for calculations.",
  },
  {
    id: "agreement-type",
    stage: 6,
    text: "What type of Microsoft agreement do you have?",
    type: "select",
    required: false,
    options: [
      { value: "ea", label: "Enterprise Agreement (EA)" },
      { value: "csp", label: "CSP (Cloud Solution Provider)" },
      { value: "direct", label: "Direct (Microsoft)" },
      { value: "other", label: "Other" },
      { value: "unknown", label: "Don't know" },
    ],
  },
  {
    id: "contract-term",
    stage: 6,
    text: "What contract term are you considering?",
    type: "radio",
    required: false,
    options: [
      { value: "annual", label: "Annual commitment" },
      { value: "3-year", label: "3-year term" },
      { value: "monthly", label: "Monthly (CSP)" },
      { value: "unknown", label: "Haven't decided" },
    ],
  },
];

export function getQuestionsByStage(stage: number): Question[] {
  return QUESTIONS.filter((q) => q.stage === stage);
}

export function shouldShowQuestion(
  question: Question,
  answers: Record<string, string | string[]>
): boolean {
  if (!question.showIf) return true;

  const answer = answers[question.showIf.questionId];
  if (!answer) return false;

  if (Array.isArray(answer)) {
    return question.showIf.values.some((v) => answer.includes(v));
  }

  return question.showIf.values.includes(answer as string);
}
