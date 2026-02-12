// Curated breach case studies - real, verified incidents
// Each case links to a public source for citation integrity

export interface BreachCase {
  id: string;
  companyName: string;
  industry: string;
  date: string;
  description: string;
  attackVector: string;
  dataCompromised: string;
  estimatedCostGBP: string;
  icoFineGBP?: string;
  sourceUrl: string;
  sourceName: string;
  e5Mitigation: string;
  relevantWorkloads: string[];
  tags: string[];
}

export const BREACH_CASES: BreachCase[] = [
  // Financial Services
  {
    id: "travelex-2020",
    companyName: "Travelex",
    industry: "financial-services",
    date: "2020-01",
    description:
      "Sodinokibi (REvil) ransomware attack forced Travelex to take all systems offline for weeks. The company paid a $2.3M ransom. The attack exploited unpatched Pulse Secure VPN vulnerabilities.",
    attackVector: "Ransomware via unpatched VPN",
    dataCompromised: "Internal systems, customer transaction data",
    estimatedCostGBP: "£25M+ (company entered administration)",
    sourceUrl:
      "https://www.bbc.co.uk/news/business-51017852",
    sourceName: "BBC News",
    e5Mitigation:
      "Defender for Endpoint would have detected lateral movement. Defender Vulnerability Management would have flagged the unpatched VPN. Conditional Access with Entra ID P2 would have enforced device compliance checks before VPN access.",
    relevantWorkloads: [
      "defender-endpoint-p2",
      "defender-vulnerability-mgmt",
      "entra-id-p2",
    ],
    tags: ["ransomware", "unpatched-vulnerability", "financial-services"],
  },
  {
    id: "equifax-2017",
    companyName: "Equifax",
    industry: "financial-services",
    date: "2017-09",
    description:
      "Massive data breach exposing personal data of 147 million people including 15.2 million UK records. Exploited an unpatched Apache Struts vulnerability. ICO fined Equifax £500,000 (maximum under pre-GDPR legislation).",
    attackVector: "Unpatched web application vulnerability",
    dataCompromised: "Names, SSNs, dates of birth, addresses, credit card numbers",
    estimatedCostGBP: "£1.1B+ globally (settlements and remediation)",
    icoFineGBP: "£500,000",
    sourceUrl:
      "https://ico.org.uk/action-weve-taken/enforcement/equifax-ltd/",
    sourceName: "ICO Enforcement Action",
    e5Mitigation:
      "Purview DLP and sensitivity labels would have classified and protected PII data. Defender for Cloud Apps would have detected anomalous data access patterns. Insider Risk Management would have flagged bulk data exfiltration.",
    relevantWorkloads: [
      "purview-dlp-advanced",
      "purview-auto-labelling",
      "defender-cloud-apps",
      "insider-risk",
    ],
    tags: ["data-breach", "unpatched-vulnerability", "financial-services", "ico-fine"],
  },

  // Healthcare
  {
    id: "nhs-wannacry-2017",
    companyName: "NHS (Multiple Trusts)",
    industry: "healthcare",
    date: "2017-05",
    description:
      "WannaCry ransomware disrupted services at 80 NHS organisations, cancelling 19,000 appointments including 139 cancer referrals. Exploited unpatched Windows SMB vulnerability (EternalBlue). Estimated cost to NHS: £92M.",
    attackVector: "Ransomware (WannaCry) via unpatched Windows SMB",
    dataCompromised: "Patient records, operational systems",
    estimatedCostGBP: "£92M",
    sourceUrl:
      "https://www.nao.org.uk/report/investigation-wannacry-cyber-attack-and-the-nhs/",
    sourceName: "National Audit Office",
    e5Mitigation:
      "Defender for Endpoint with attack surface reduction rules would have blocked the exploit. Automated investigation and remediation would have contained the spread. Defender Vulnerability Management would have identified the missing MS17-010 patch across all endpoints.",
    relevantWorkloads: [
      "defender-endpoint-p2",
      "defender-vulnerability-mgmt",
    ],
    tags: ["ransomware", "healthcare", "unpatched-vulnerability", "critical-infrastructure"],
  },
  {
    id: "psych-health-2023",
    companyName: "Vastaamo (Finland)",
    industry: "healthcare",
    date: "2020-10",
    description:
      "Therapy centre's entire patient database of 36,000 psychotherapy records stolen and used to blackmail individual patients. Attacker demanded ransom from the company and then contacted patients directly. CEO was later convicted of GDPR violations.",
    attackVector: "Unauthorized database access (unprotected MySQL)",
    dataCompromised: "36,000 psychotherapy session notes, personal details",
    estimatedCostGBP: "Company declared bankruptcy",
    sourceUrl:
      "https://yle.fi/a/3-11636869",
    sourceName: "Yle News (Finland)",
    e5Mitigation:
      "Purview DLP with sensitivity labels would have enforced encryption on highly sensitive health data. Defender for Cloud Apps would have detected bulk data access. Information Barriers could have restricted access to therapy records.",
    relevantWorkloads: [
      "purview-dlp-advanced",
      "purview-auto-labelling",
      "defender-cloud-apps",
      "information-barriers",
    ],
    tags: ["data-breach", "healthcare", "extortion", "gdpr"],
  },

  // Technology
  {
    id: "solarwinds-2020",
    companyName: "SolarWinds (supply chain attack)",
    industry: "technology",
    date: "2020-12",
    description:
      "State-sponsored attackers compromised SolarWinds Orion software update mechanism, affecting 18,000 organisations worldwide including UK government departments. Attackers had access for months before detection.",
    attackVector: "Supply chain compromise, lateral movement",
    dataCompromised: "Government communications, intellectual property, internal emails",
    estimatedCostGBP: "£100M+ across affected organisations",
    sourceUrl:
      "https://www.ncsc.gov.uk/news/ncsc-statement-solarwinds",
    sourceName: "NCSC Advisory",
    e5Mitigation:
      "Defender for Identity would have detected anomalous authentication patterns. Defender for Cloud Apps would have identified unusual API access. Entra ID P2 risk-based conditional access would have challenged suspicious sign-ins from compromised accounts.",
    relevantWorkloads: [
      "defender-identity",
      "defender-cloud-apps",
      "entra-id-p2",
      "defender-endpoint-p2",
    ],
    tags: ["supply-chain", "apt", "technology", "government"],
  },

  // Retail
  {
    id: "british-airways-2018",
    companyName: "British Airways",
    industry: "retail",
    date: "2018-09",
    description:
      "Payment card details of approximately 500,000 customers stolen via a Magecart-style web skimming attack on the BA website and app. ICO initially proposed £183M fine (later reduced to £20M due to COVID impact).",
    attackVector: "Web skimming (Magecart) via third-party JavaScript",
    dataCompromised: "Payment card details, names, addresses of ~500,000 customers",
    estimatedCostGBP: "£20M ICO fine + £16M+ compensation claims",
    icoFineGBP: "£20,000,000",
    sourceUrl:
      "https://ico.org.uk/action-weve-taken/enforcement/british-airways/",
    sourceName: "ICO Enforcement Action",
    e5Mitigation:
      "Defender for Cloud Apps with session controls could have detected and blocked the malicious JavaScript injection. Purview DLP would have flagged payment card data being transmitted to unauthorized endpoints.",
    relevantWorkloads: [
      "defender-cloud-apps",
      "purview-dlp-advanced",
      "defender-endpoint-p2",
    ],
    tags: ["data-breach", "retail", "web-skimming", "ico-fine", "gdpr"],
  },
  {
    id: "marriott-2018",
    companyName: "Marriott International",
    industry: "retail",
    date: "2018-11",
    description:
      "Starwood guest reservation database breach exposed 339 million guest records globally, including 7 million UK records. Attackers had been in the system since 2014 (pre-Marriott acquisition). ICO fined Marriott £18.4M.",
    attackVector: "Unauthorized database access (compromised credentials)",
    dataCompromised: "Guest names, addresses, phone numbers, passport numbers, payment cards",
    estimatedCostGBP: "£18.4M ICO fine + significant remediation costs",
    icoFineGBP: "£18,400,000",
    sourceUrl:
      "https://ico.org.uk/action-weve-taken/enforcement/marriott-international-inc/",
    sourceName: "ICO Enforcement Action",
    e5Mitigation:
      "Entra ID P2 with Identity Protection would have detected compromised credentials. Privileged Identity Management would have limited standing access to sensitive databases. Access Reviews would have identified dormant accounts from the Starwood acquisition.",
    relevantWorkloads: [
      "entra-id-p2",
      "defender-identity",
      "purview-dlp-advanced",
    ],
    tags: ["data-breach", "retail", "compromised-credentials", "ico-fine", "gdpr"],
  },

  // Legal / Professional Services
  {
    id: "mishcon-2023",
    companyName: "Various UK Law Firms",
    industry: "legal-professional",
    date: "2023-01",
    description:
      "NCSC and SRA issued multiple warnings about ransomware and BEC attacks targeting UK law firms. CL0P ransomware group specifically targeted legal sector via MOVEit Transfer vulnerability. Multiple firms paid ransoms to prevent client data exposure.",
    attackVector: "Ransomware (CL0P) via MOVEit Transfer vulnerability, BEC",
    dataCompromised: "Client records, case files, privileged communications",
    estimatedCostGBP: "£5-50M per firm (varied)",
    sourceUrl:
      "https://www.ncsc.gov.uk/guidance/mitigating-malware-and-ransomware-attacks",
    sourceName: "NCSC Guidance",
    e5Mitigation:
      "Defender for Office 365 P2 would have caught BEC attempts with impersonation protection. Purview DLP with sensitivity labels would have prevented unauthorized sharing of privileged legal documents. Insider Risk Management would have detected unusual file access patterns.",
    relevantWorkloads: [
      "defender-office-p2",
      "purview-dlp-advanced",
      "purview-auto-labelling",
      "insider-risk",
      "defender-endpoint-p2",
    ],
    tags: ["ransomware", "bec", "legal", "moveit"],
  },

  // Education
  {
    id: "harris-federation-2021",
    companyName: "Harris Federation",
    industry: "education",
    date: "2021-03",
    description:
      "Ransomware attack on the Harris Federation, a multi-academy trust running 50 schools in London and Essex. Forced the trust to temporarily disable its email and telephone systems. 37,000 students affected.",
    attackVector: "Ransomware",
    dataCompromised: "Student records, staff payroll data, operational systems",
    estimatedCostGBP: "£3-5M estimated recovery costs",
    sourceUrl:
      "https://www.bbc.co.uk/news/technology-56530010",
    sourceName: "BBC News",
    e5Mitigation:
      "Defender for Endpoint with automated investigation would have detected and contained the attack. Intune device management would have enforced security baselines across all school devices. Defender for Office 365 would have blocked the initial phishing vector.",
    relevantWorkloads: [
      "defender-endpoint-p2",
      "defender-office-p2",
      "intune-endpoint-privilege",
    ],
    tags: ["ransomware", "education", "phishing"],
  },

  // Manufacturing / Energy
  {
    id: "norsk-hydro-2019",
    companyName: "Norsk Hydro",
    industry: "manufacturing",
    date: "2019-03",
    description:
      "LockerGoga ransomware attack shut down operations at the Norwegian aluminium manufacturer across 170 sites in 40 countries. The company refused to pay the ransom and recovered using backups, but suffered significant operational disruption.",
    attackVector: "Ransomware (LockerGoga) via Active Directory compromise",
    dataCompromised: "Operational technology systems, manufacturing control systems",
    estimatedCostGBP: "£55-65M",
    sourceUrl:
      "https://www.bbc.co.uk/news/technology-47624207",
    sourceName: "BBC News",
    e5Mitigation:
      "Defender for Identity would have detected the Active Directory compromise and lateral movement. Entra ID P2 Privileged Identity Management would have limited standing admin access. Endpoint Privilege Management would have removed local admin rights on workstations.",
    relevantWorkloads: [
      "defender-identity",
      "entra-id-p2",
      "intune-endpoint-privilege",
      "defender-endpoint-p2",
    ],
    tags: ["ransomware", "manufacturing", "active-directory", "critical-infrastructure"],
  },

  // Public Sector
  {
    id: "redcar-2020",
    companyName: "Redcar and Cleveland Borough Council",
    industry: "public-sector",
    date: "2020-02",
    description:
      "Ransomware attack took council systems offline for three weeks, forcing staff to use pen and paper. Estimated recovery cost of £10.4M. The council had to rebuild its entire IT infrastructure.",
    attackVector: "Ransomware",
    dataCompromised: "Council records, resident data, operational systems",
    estimatedCostGBP: "£10.4M",
    sourceUrl:
      "https://www.bbc.co.uk/news/uk-england-tees-56314392",
    sourceName: "BBC News",
    e5Mitigation:
      "Defender for Endpoint with automated investigation and remediation would have contained the attack before full encryption. Intune device compliance policies would have enforced security baselines. Defender for Office 365 would have blocked the initial infection vector.",
    relevantWorkloads: [
      "defender-endpoint-p2",
      "defender-office-p2",
      "intune-endpoint-privilege",
    ],
    tags: ["ransomware", "public-sector", "local-government"],
  },
  {
    id: "hackney-2020",
    companyName: "Hackney Council",
    industry: "public-sector",
    date: "2020-10",
    description:
      "Serious cyber-attack significantly impacted services and IT systems. Many services were unavailable for months. Housing benefit payments, planning applications, and land searches were all disrupted. Recovery took over two years.",
    attackVector: "Ransomware (suspected Pysa)",
    dataCompromised: "Resident data, financial records, housing records",
    estimatedCostGBP: "£12M+ (multi-year recovery)",
    sourceUrl:
      "https://www.bbc.co.uk/news/uk-england-london-54534345",
    sourceName: "BBC News",
    e5Mitigation:
      "Defender for Endpoint would have detected and blocked the initial ransomware execution. Defender for Identity would have detected lateral movement through Active Directory. Purview DLP would have prevented mass data exfiltration before encryption.",
    relevantWorkloads: [
      "defender-endpoint-p2",
      "defender-identity",
      "purview-dlp-advanced",
    ],
    tags: ["ransomware", "public-sector", "local-government"],
  },
];

// Helper functions
export function getBreachCasesByIndustry(industryId: string): BreachCase[] {
  return BREACH_CASES.filter((bc) => bc.industry === industryId);
}

export function getBreachCasesByTag(tag: string): BreachCase[] {
  return BREACH_CASES.filter((bc) => bc.tags.includes(tag));
}

export function getBreachCasesByWorkload(workloadId: string): BreachCase[] {
  return BREACH_CASES.filter((bc) =>
    bc.relevantWorkloads.includes(workloadId)
  );
}

export function getBreachCasesWithICOFines(): BreachCase[] {
  return BREACH_CASES.filter((bc) => bc.icoFineGBP);
}
