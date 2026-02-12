export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  description: string;
  relevantIndustries: string[];
  e5Capabilities: string[];
  ukRelevance: 'mandatory' | 'recommended' | 'optional';
}

export const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'cyber-essentials',
    name: 'Cyber Essentials',
    shortName: 'CE',
    description: 'UK government-backed scheme to help organisations protect against common cyber attacks. Required for many government contracts.',
    relevantIndustries: ['all'],
    ukRelevance: 'recommended',
    e5Capabilities: [
      'defender-endpoint-p2',
      'entra-id-p2',
      'intune-endpoint-privilege',
      'defender-office-p2',
    ],
  },
  {
    id: 'cyber-essentials-plus',
    name: 'Cyber Essentials Plus',
    shortName: 'CE+',
    description: 'Enhanced version with hands-on technical verification. Increasingly required for government supply chain.',
    relevantIndustries: ['all'],
    ukRelevance: 'recommended',
    e5Capabilities: [
      'defender-endpoint-p2',
      'entra-id-p2',
      'intune-endpoint-privilege',
      'defender-office-p2',
      'defender-vulnerability-mgmt',
    ],
  },
  {
    id: 'nis2',
    name: 'Network and Information Security Directive 2',
    shortName: 'NIS2',
    description: 'EU directive expanding cybersecurity requirements to more sectors. Affects UK companies trading with or operating in the EU.',
    relevantIndustries: ['energy', 'healthcare', 'transport', 'financial-services', 'public-sector', 'manufacturing'],
    ukRelevance: 'mandatory',
    e5Capabilities: [
      'defender-endpoint-p2',
      'defender-office-p2',
      'defender-identity',
      'entra-id-p2',
      'insider-risk',
      'purview-dlp-advanced',
      'defender-cloud-apps',
    ],
  },
  {
    id: 'dora',
    name: 'Digital Operational Resilience Act',
    shortName: 'DORA',
    description: 'EU regulation on digital operational resilience for the financial sector. Applies to UK financial services firms operating in the EU.',
    relevantIndustries: ['financial-services'],
    ukRelevance: 'mandatory',
    e5Capabilities: [
      'defender-endpoint-p2',
      'defender-office-p2',
      'defender-identity',
      'defender-cloud-apps',
      'entra-id-p2',
      'insider-risk',
      'communication-compliance',
      'information-barriers',
      'ediscovery-premium',
    ],
  },
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001',
    shortName: 'ISO 27001',
    description: 'International standard for information security management systems (ISMS). Widely recognised globally.',
    relevantIndustries: ['all'],
    ukRelevance: 'recommended',
    e5Capabilities: [
      'defender-endpoint-p2',
      'defender-office-p2',
      'defender-identity',
      'defender-cloud-apps',
      'entra-id-p2',
      'purview-dlp-advanced',
      'purview-auto-labelling',
      'insider-risk',
      'intune-endpoint-privilege',
    ],
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    shortName: 'SOC 2',
    description: 'Service Organisation Control report focusing on security, availability, processing integrity, confidentiality, and privacy.',
    relevantIndustries: ['technology', 'professional-services', 'financial-services'],
    ukRelevance: 'optional',
    e5Capabilities: [
      'defender-endpoint-p2',
      'defender-cloud-apps',
      'entra-id-p2',
      'purview-dlp-advanced',
      'insider-risk',
      'ediscovery-premium',
      'communication-compliance',
    ],
  },
  {
    id: 'nist-csf',
    name: 'NIST Cybersecurity Framework',
    shortName: 'NIST CSF',
    description: 'Voluntary framework for managing cybersecurity risk. Widely adopted as best practice globally.',
    relevantIndustries: ['all'],
    ukRelevance: 'optional',
    e5Capabilities: [
      'defender-endpoint-p2',
      'defender-office-p2',
      'defender-identity',
      'defender-cloud-apps',
      'defender-vulnerability-mgmt',
      'entra-id-p2',
      'purview-dlp-advanced',
      'insider-risk',
    ],
  },
];

export function getFrameworkById(id: string): ComplianceFramework | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

export function getFrameworksForIndustry(industryId: string): ComplianceFramework[] {
  return FRAMEWORKS.filter(
    (f) => f.relevantIndustries.includes('all') || f.relevantIndustries.includes(industryId)
  );
}
