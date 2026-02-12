// AI Prompt Templates for Report Sections
// Each section gets a focused, citation-enforcing prompt

import { type IndustryProfile } from "@/data/industries";
import { type E5Workload } from "@/data/e5-workloads";
import { type ComplianceFramework } from "@/data/frameworks";

export interface ReportContext {
  companyName: string;
  industry: IndustryProfile;
  employeeCount: string;
  revenueBand: string;
  currentLicense: string;
  licensedUsers: string;
  perUserCost: string;
  addonLicenses: string[];
  securityTools: string[];
  securityVendors: string;
  selectedWorkloads: E5Workload[];
  relevantFrameworks: ComplianceFramework[];
  evaluationDrivers: string[];
  presentationAudience: string[];
  securityIncident: string;
  cyberInsurance: string;
  complianceFrameworks: string[];
  e5QuotedPrice: string;
  agreementType: string;
  contractTerm: string;
}

const CITATION_INSTRUCTION = `
CRITICAL INSTRUCTION ON CITATIONS:
- Every factual claim MUST include a source citation in the format [Source: Name, URL, Date].
- Use only real, verifiable sources. If you cannot cite a specific source, write "Industry estimates suggest..." and note it as an approximation.
- Do NOT fabricate URLs, company names, or statistics.
- Preferred sources: Microsoft documentation, IBM Cost of a Data Breach Report, Verizon DBIR, ICO enforcement actions, NCSC advisories, Gartner/Forrester reports.
- All monetary values should be in GBP (£).
`;

export function buildExecutiveSummaryPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  const audienceMap: Record<string, string> = {
    cto: "CTO/CIO (technical leadership)",
    cfo: "CFO/Finance Director (cost-focused)",
    ciso: "CISO/Security Director (risk-focused)",
    board: "Board of Directors (strategic, high-level)",
    "it-director": "IT Director (operational)",
    procurement: "Procurement (value and terms)",
  };
  const audienceDesc = ctx.presentationAudience
    .map((a) => audienceMap[a] || a)
    .join(", ");

  return {
    systemPrompt: `You are an expert Microsoft 365 licensing consultant writing a professional business case document.
Your output will be used in a board-level report. Write in a formal but accessible UK English style.
Be specific, data-driven, and persuasive without being salesy.
${CITATION_INSTRUCTION}`,

    prompt: `Write an executive summary (400-600 words) for a business case recommending ${ctx.companyName} upgrade from Microsoft 365 ${ctx.currentLicense} to E5.

COMPANY CONTEXT:
- Company: ${ctx.companyName}
- Industry: ${ctx.industry.name} (risk level: ${ctx.industry.riskLevel})
- Size: ${ctx.licensedUsers} licensed users, ${ctx.employeeCount} employee range
- Current license: ${ctx.currentLicense}
- Current per-user cost: ${ctx.perUserCost || "not disclosed"}
- Add-on licenses: ${ctx.addonLicenses.length > 0 ? ctx.addonLicenses.join(", ") : "none"}

SECURITY POSTURE:
- External security tools: ${ctx.securityTools.length > 0 ? ctx.securityTools.join(", ") : "none — relying on Microsoft built-in"}
- Specific vendors: ${ctx.securityVendors || "not specified"}
- Security incidents (24 months): ${ctx.securityIncident}
- Cyber insurance: ${ctx.cyberInsurance}
- Average breach cost for ${ctx.industry.name}: ${ctx.industry.averageBreachCostGBP}

SELECTED E5 WORKLOADS:
${ctx.selectedWorkloads.map((w) => `- ${w.name}: ${w.businessValue}`).join("\n")}

EVALUATION DRIVERS:
${ctx.evaluationDrivers.join(", ")}

TARGET AUDIENCE: ${audienceDesc}

INSTRUCTIONS:
1. Open with the strategic imperative (why now, why E5)
2. Summarise the key financial argument (consolidation savings, risk reduction ROI)
3. Highlight 3-4 most relevant E5 capabilities for this specific company
4. Reference the industry threat landscape with specific data points
5. Close with a clear recommendation and next steps
6. Tailor the tone to the target audience
7. Include specific citations for all factual claims`,
  };
}

export function buildRiskQuantificationPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a cybersecurity risk analyst writing a quantified risk assessment for a board-level business case.
Use the FAIR (Factor Analysis of Information Risk) methodology where appropriate.
All figures must be sourced and in GBP.
${CITATION_INSTRUCTION}`,

    prompt: `Write a risk quantification section (500-800 words) for ${ctx.companyName}'s E5 business case.

COMPANY: ${ctx.companyName}
INDUSTRY: ${ctx.industry.name}
EMPLOYEES: ${ctx.employeeCount} range, ${ctx.licensedUsers} licensed users
RISK LEVEL: ${ctx.industry.riskLevel}
REGULATORY PRESSURE: ${ctx.industry.regulatoryPressure}
COMMON BREACH TYPES: ${ctx.industry.commonBreachTypes.join(", ")}
AVERAGE BREACH COST: ${ctx.industry.averageBreachCostGBP}
SECURITY INCIDENT HISTORY: ${ctx.securityIncident}
CYBER INSURANCE: ${ctx.cyberInsurance}

CURRENT SECURITY TOOLS: ${ctx.securityTools.join(", ") || "Microsoft built-in only"}
CURRENT LICENSE: ${ctx.currentLicense}

INSTRUCTIONS:
1. Quantify the annual expected loss from key threat scenarios relevant to the ${ctx.industry.name} sector
2. Reference the IBM Cost of a Data Breach Report and Verizon DBIR for industry-specific statistics
3. Calculate risk reduction estimates from E5 capabilities vs current posture
4. Include a simple risk matrix (likelihood x impact) for top 3 threats
5. Factor in regulatory penalties relevant to this industry
6. Show the cost of inaction vs the cost of E5 investment
7. All figures in GBP with sources cited`,
  };
}

export function buildVendorConsolidationPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a Microsoft 365 licensing specialist helping companies calculate vendor consolidation savings from moving to E5.
Be precise about which E5 capabilities replace which third-party tools.
All costs in GBP.
${CITATION_INSTRUCTION}`,

    prompt: `Write a vendor consolidation analysis (400-600 words) for ${ctx.companyName}.

CURRENT THIRD-PARTY TOOLS: ${ctx.securityTools.join(", ") || "none identified"}
SPECIFIC VENDORS: ${ctx.securityVendors || "not specified"}
CURRENT LICENSE: ${ctx.currentLicense}
ADD-ON LICENSES: ${ctx.addonLicenses.join(", ") || "none"}
LICENSED USERS: ${ctx.licensedUsers}

E5 CAPABILITIES THAT REPLACE TOOLS:
${ctx.selectedWorkloads.map((w) => `- ${w.name}: ${w.businessValue}`).join("\n")}

INSTRUCTIONS:
1. Map each current third-party tool to its E5 equivalent
2. Provide typical per-user/month cost ranges for the third-party tools being replaced
3. Calculate estimated annual savings from consolidation
4. Note any tools that E5 does NOT fully replace (be honest)
5. Include operational benefits (single pane of glass, reduced vendor management, faster incident response)
6. Cite sources for all pricing estimates`,
  };
}

export function buildBreachCaseStudiesPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a cybersecurity analyst compiling real-world breach case studies for a board-level business case.
Every case study MUST be a real, documented incident with verifiable sources.
Do NOT invent or fabricate any breach incidents.
${CITATION_INSTRUCTION}`,

    prompt: `Write 3-4 breach case studies (600-900 words total) relevant to ${ctx.companyName}'s industry for their E5 business case.

INDUSTRY: ${ctx.industry.name}
COMMON BREACH TYPES: ${ctx.industry.commonBreachTypes.join(", ")}
AVERAGE BREACH COST: ${ctx.industry.averageBreachCostGBP}
COMPANY SIZE: ${ctx.employeeCount} employees, ${ctx.licensedUsers} licensed users

SELECTED E5 WORKLOADS:
${ctx.selectedWorkloads.map((w) => `- ${w.name}`).join("\n")}

INSTRUCTIONS:
1. Present 3-4 real breach incidents from the ${ctx.industry.name} sector (or closely related sectors)
2. For each case:
   - Company name (real, documented)
   - Date of incident
   - What happened (attack vector, data compromised)
   - Financial impact (fines, remediation costs, revenue loss)
   - Source citation with URL
3. After each case, add "How E5 Would Have Helped:" explaining which selected E5 workloads would have prevented or mitigated the breach
4. Focus on UK/European cases where possible, but include global cases if more relevant
5. Include the ICO fine amount where applicable
6. Every single claim must have a source citation`,
  };
}

export function buildTCOComparisonPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a Microsoft 365 licensing cost analyst building a Total Cost of Ownership comparison.
Be precise with calculations. Show your working. All figures in GBP.
${CITATION_INSTRUCTION}`,

    prompt: `Write a TCO comparison section (500-700 words) for ${ctx.companyName}'s E5 business case.

CURRENT STATE:
- License: ${ctx.currentLicense}
- Per-user cost: ${ctx.perUserCost || "standard list price"}
- Licensed users: ${ctx.licensedUsers}
- Add-on licenses: ${ctx.addonLicenses.join(", ") || "none"}
- Third-party tools: ${ctx.securityTools.join(", ") || "none identified"}
- Specific vendors: ${ctx.securityVendors || "not specified"}

E5 PRICING:
- Quoted price: ${ctx.e5QuotedPrice || "standard list price (~£49.20/user/month)"}
- Agreement type: ${ctx.agreementType || "not specified"}
- Contract term: ${ctx.contractTerm || "annual"}

INSTRUCTIONS:
1. Calculate current annual cost:
   - Base license cost (per-user × users × 12)
   - Add-on license costs (use typical UK pricing if not specified)
   - Third-party tool costs (use typical per-user pricing ranges)
   - Hidden costs: vendor management overhead, integration maintenance, training on multiple platforms
2. Calculate E5 annual cost:
   - E5 per-user × users × 12
   - Note what is included that replaces add-ons and third-party tools
3. Show the delta (savings or additional investment)
4. Present as a clear comparison table in markdown format
5. Include a 3-year TCO view showing cumulative savings
6. Cite Microsoft list pricing and typical third-party tool costs with sources`,
  };
}

export function buildFrameworkGapAnalysisPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a compliance consultant mapping Microsoft 365 E5 capabilities to regulatory framework requirements.
Be specific about which E5 features satisfy which controls. All claims must be sourced.
${CITATION_INSTRUCTION}`,

    prompt: `Write a compliance framework gap analysis (600-900 words) for ${ctx.companyName}'s E5 business case.

COMPANY: ${ctx.companyName}
INDUSTRY: ${ctx.industry.name}
REGULATORY PRESSURE: ${ctx.industry.regulatoryPressure}

RELEVANT FRAMEWORKS:
${ctx.relevantFrameworks.map((f) => `- ${f.name} (${f.shortName}): ${f.description} [UK relevance: ${f.ukRelevance}]`).join("\n")}

COMPLIANCE FRAMEWORKS THE COMPANY IS PURSUING:
${ctx.complianceFrameworks.join(", ") || "not specified"}

SELECTED E5 WORKLOADS:
${ctx.selectedWorkloads.map((w) => `- ${w.name}: ${w.keyCapabilities.join(", ")}`).join("\n")}

FRAMEWORK-TO-E5 MAPPINGS:
${ctx.relevantFrameworks.map((f) => `- ${f.shortName} maps to: ${f.e5Capabilities.join(", ")}`).join("\n")}

INSTRUCTIONS:
1. For each relevant framework, show:
   - Current gap (what the company likely lacks without E5)
   - How E5 closes the gap (specific capabilities → specific controls)
   - Compliance acceleration (time saved vs manual/third-party approaches)
2. Use a framework-by-framework structure
3. Highlight mandatory frameworks (e.g., NIS2 for essential services) vs recommended ones
4. Include specific control references where possible (e.g., "ISO 27001 A.8.2 - Information Classification")
5. Note that E5 helps with compliance but does not guarantee certification
6. Cite Microsoft compliance documentation for capability-to-control mappings`,
  };
}

export function buildPeerBenchmarkingPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a market analyst providing peer benchmarking data on Microsoft 365 E5 adoption.
Use only real adoption data and industry reports. Be transparent about data limitations.
${CITATION_INSTRUCTION}`,

    prompt: `Write a peer benchmarking section (300-500 words) for ${ctx.companyName}'s E5 business case.

COMPANY: ${ctx.companyName}
INDUSTRY: ${ctx.industry.name}
SIZE: ${ctx.employeeCount} employees

INSTRUCTIONS:
1. Present E5 adoption trends:
   - Overall Microsoft 365 E5 adoption rates among enterprise customers
   - Industry-specific adoption trends for ${ctx.industry.name}
   - Adoption by company size (reference their size bracket)
2. Reference analyst reports (Gartner, Forrester, IDC) on the security platform consolidation trend
3. Include the "what competitors are doing" angle — peer pressure is a real board-level motivator
4. Note any ${ctx.industry.name}-specific Microsoft case studies or success stories
5. Be honest about what data is available vs what requires approximation
6. All claims must be sourced — do NOT fabricate survey results or percentages`,
  };
}

export function buildInvestmentRoadmapPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a Microsoft 365 deployment consultant creating a phased rollout plan.
Be practical and realistic about deployment timelines and prerequisites.
${CITATION_INSTRUCTION}`,

    prompt: `Write an investment roadmap section (400-600 words) for ${ctx.companyName}'s E5 business case.

COMPANY: ${ctx.companyName}
INDUSTRY: ${ctx.industry.name}
SIZE: ${ctx.licensedUsers} licensed users, ${ctx.employeeCount} employees

SELECTED E5 WORKLOADS:
${ctx.selectedWorkloads.map((w) => `- ${w.name} (${w.category})`).join("\n")}

CURRENT STATE:
- License: ${ctx.currentLicense}
- Add-ons: ${ctx.addonLicenses.join(", ") || "none"}
- Third-party tools: ${ctx.securityTools.join(", ") || "none"}

INSTRUCTIONS:
1. Create a phased rollout plan with 3-4 phases:
   - Phase 1: Quick wins (features that can be enabled immediately)
   - Phase 2: Core security (Defender suite, identity protection)
   - Phase 3: Compliance & governance (Purview, insider risk)
   - Phase 4: Advanced capabilities (analytics, AI/Copilot)
2. For each phase:
   - What to deploy
   - Prerequisites and dependencies
   - Expected outcomes
   - Success metrics
3. Factor in change management and training requirements
4. Note that Defender workloads should run in parallel with existing tools during transition
5. Include a recommendation on phased vs big-bang licensing approach
6. Reference Microsoft's own deployment guidance where relevant`,
  };
}

export function buildROIProjectionPrompt(ctx: ReportContext): {
  systemPrompt: string;
  prompt: string;
} {
  return {
    systemPrompt: `You are a financial analyst calculating the ROI of a Microsoft 365 E5 investment.
Show clear calculations with assumptions stated. All figures in GBP. Be conservative in estimates.
${CITATION_INSTRUCTION}`,

    prompt: `Write an ROI projection section (400-600 words) for ${ctx.companyName}'s E5 business case.

COMPANY: ${ctx.companyName}
INDUSTRY: ${ctx.industry.name}
SIZE: ${ctx.licensedUsers} licensed users

CURRENT COSTS:
- Per-user license cost: ${ctx.perUserCost || "standard E3 list price (~£30.40/user/month)"}
- Add-ons: ${ctx.addonLicenses.join(", ") || "none"}
- Third-party tools: ${ctx.securityTools.join(", ") || "none"}

E5 PRICING:
- Quoted price: ${ctx.e5QuotedPrice || "standard list price (~£49.20/user/month)"}
- Contract term: ${ctx.contractTerm || "annual"}

INDUSTRY RISK DATA:
- Average breach cost: ${ctx.industry.averageBreachCostGBP}
- Risk level: ${ctx.industry.riskLevel}

INSTRUCTIONS:
1. Calculate the investment required (E5 cost minus current costs, annualised)
2. Calculate benefits:
   - Vendor consolidation savings (quantified)
   - Risk reduction value (breach probability × average cost × reduction factor)
   - Operational efficiency gains (reduced admin, fewer tools to manage)
   - Compliance acceleration value (faster audit prep, reduced consulting costs)
3. Present the ROI calculation:
   - Year 1 ROI (may include migration costs)
   - Year 2-3 ROI (ongoing savings)
   - Payback period
4. State all assumptions clearly
5. Present conservative, moderate, and optimistic scenarios
6. Reference the Forrester TEI study on M365 E5 (229% ROI) as a benchmark
7. All figures in GBP with sources cited`,
  };
}
