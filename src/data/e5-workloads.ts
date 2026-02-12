export interface E5Workload {
  id: string;
  name: string;
  category: 'security' | 'compliance' | 'identity' | 'device-management' | 'productivity' | 'ai';
  description: string;
  businessValue: string;
  e3Included: boolean;
  keyCapabilities: string[];
}

export const E5_WORKLOADS: E5Workload[] = [
  // Security
  {
    id: 'defender-endpoint-p2',
    name: 'Microsoft Defender for Endpoint P2',
    category: 'security',
    description: 'Advanced endpoint detection and response (EDR) with automated investigation and remediation.',
    businessValue: 'Replaces standalone EDR tools (CrowdStrike, SentinelOne) - typical cost £5-8/user/month.',
    e3Included: false,
    keyCapabilities: [
      'Endpoint Detection & Response (EDR)',
      'Automated investigation & remediation',
      'Attack surface reduction rules',
      'Threat & vulnerability management',
      'Endpoint behavioural sensors',
      'Threat intelligence integration',
    ],
  },
  {
    id: 'defender-office-p2',
    name: 'Microsoft Defender for Office 365 P2',
    category: 'security',
    description: 'Advanced email and collaboration protection with threat investigation and automated response.',
    businessValue: 'Replaces email security gateways (Proofpoint, Mimecast) - typical cost £3-5/user/month.',
    e3Included: false,
    keyCapabilities: [
      'Safe Attachments & Safe Links',
      'Anti-phishing (impersonation protection)',
      'Threat Explorer & real-time detections',
      'Automated Investigation & Response (AIR)',
      'Attack simulation training',
      'Campaign views',
    ],
  },
  {
    id: 'defender-identity',
    name: 'Microsoft Defender for Identity',
    category: 'security',
    description: 'Cloud-based security solution that leverages on-premises Active Directory signals to detect advanced threats.',
    businessValue: 'Detects lateral movement and identity-based attacks that bypass traditional perimeter security.',
    e3Included: false,
    keyCapabilities: [
      'Identity threat detection',
      'Lateral movement path detection',
      'Compromised credential detection',
      'Active Directory reconnaissance detection',
      'Security posture assessments',
      'Integration with Microsoft 365 Defender',
    ],
  },
  {
    id: 'defender-cloud-apps',
    name: 'Microsoft Defender for Cloud Apps',
    category: 'security',
    description: 'Cloud Access Security Broker (CASB) for visibility, data control, and threat protection across cloud services.',
    businessValue: 'Replaces standalone CASB solutions (Netskope, Zscaler CASB) - typical cost £3-6/user/month.',
    e3Included: false,
    keyCapabilities: [
      'Shadow IT discovery',
      'Cloud app governance',
      'Information protection policies',
      'Threat detection across SaaS apps',
      'Real-time session controls',
      'OAuth app management',
    ],
  },
  {
    id: 'defender-vulnerability-mgmt',
    name: 'Microsoft Defender Vulnerability Management',
    category: 'security',
    description: 'Risk-based vulnerability management for endpoint discovery, assessment, and remediation.',
    businessValue: 'Replaces standalone vulnerability scanning tools (Tenable, Qualys) for endpoint vulnerabilities.',
    e3Included: false,
    keyCapabilities: [
      'Software inventory & vulnerability assessment',
      'Security baselines assessment',
      'Browser extension assessment',
      'Digital certificate assessment',
      'Network share analysis',
      'Threat analytics & exposure scoring',
    ],
  },

  // Compliance
  {
    id: 'purview-dlp-advanced',
    name: 'Microsoft Purview DLP (Advanced)',
    category: 'compliance',
    description: 'Advanced Data Loss Prevention with endpoint DLP, exact data match, and trainable classifiers.',
    businessValue: 'Extends basic DLP with endpoint protection - replaces standalone DLP (Symantec, Digital Guardian).',
    e3Included: false,
    keyCapabilities: [
      'Endpoint DLP',
      'Exact data match (EDM) classifiers',
      'Trainable classifiers',
      'Advanced policy conditions',
      'DLP for Teams messages',
      'Optical Character Recognition (OCR)',
    ],
  },
  {
    id: 'purview-auto-labelling',
    name: 'Sensitivity Labels (Auto-labelling)',
    category: 'compliance',
    description: 'Automatic classification and labelling of sensitive data across Microsoft 365.',
    businessValue: 'Automates data classification at scale - critical for regulatory compliance.',
    e3Included: false,
    keyCapabilities: [
      'Service-side auto-labelling',
      'Automatic policy application',
      'Simulation mode for testing',
      'Label inheritance for containers',
      'Default labels for SharePoint libraries',
      'Integration with Purview DLP',
    ],
  },
  {
    id: 'insider-risk',
    name: 'Microsoft Purview Insider Risk Management',
    category: 'compliance',
    description: 'Detect, investigate, and take action on risky and malicious activities inside your organisation.',
    businessValue: 'Addresses insider threat risk - relevant for IP protection and compliance.',
    e3Included: false,
    keyCapabilities: [
      'Insider risk policies & templates',
      'Activity explorer & investigation',
      'Intelligent detections & alerts',
      'Data theft & leaks detection',
      'Departing employee risk signals',
      'Integration with HR connectors',
    ],
  },
  {
    id: 'ediscovery-premium',
    name: 'Microsoft Purview eDiscovery Premium',
    category: 'compliance',
    description: 'Advanced eDiscovery with intelligent collection, review sets, and analytics.',
    businessValue: 'Reduces legal discovery costs - replaces tools like Relativity for M365 content.',
    e3Included: false,
    keyCapabilities: [
      'Custodian management',
      'Legal hold notifications',
      'Review sets with analytics',
      'Near-duplicate detection',
      'Email threading',
      'Themes & predictive coding',
    ],
  },
  {
    id: 'information-barriers',
    name: 'Information Barriers',
    category: 'compliance',
    description: 'Policies that restrict communication and collaboration between specific groups.',
    businessValue: 'Essential for regulated industries (financial services) with Chinese wall requirements.',
    e3Included: false,
    keyCapabilities: [
      'Communication policies between segments',
      'Teams chat restrictions',
      'SharePoint site access restrictions',
      'OneDrive sharing restrictions',
      'Compliance with regulatory requirements',
      'Segment-based access controls',
    ],
  },
  {
    id: 'communication-compliance',
    name: 'Communication Compliance',
    category: 'compliance',
    description: 'Detect, capture, and take remediation actions for inappropriate messages.',
    businessValue: 'Helps meet regulatory requirements for communications monitoring (FCA, MiFID II).',
    e3Included: false,
    keyCapabilities: [
      'Policy-based message monitoring',
      'Built-in & custom classifiers',
      'Trainable classifiers for threats',
      'Remediation workflows',
      'Integration with Teams, Exchange, Viva Engage',
      'Regulatory compliance templates',
    ],
  },

  // Identity
  {
    id: 'entra-id-p2',
    name: 'Microsoft Entra ID P2',
    category: 'identity',
    description: 'Advanced identity protection, privileged identity management, and access governance.',
    businessValue: 'Replaces standalone PAM/IGA tools (CyberArk, SailPoint) - typical cost £5-15/user/month.',
    e3Included: false,
    keyCapabilities: [
      'Identity Protection (risk-based Conditional Access)',
      'Privileged Identity Management (PIM)',
      'Access Reviews',
      'Entitlement Management',
      'Risk-based sign-in & user policies',
      'Vulnerable accounts detection',
    ],
  },

  // Device Management
  {
    id: 'intune-endpoint-privilege',
    name: 'Intune Endpoint Privilege Management',
    category: 'device-management',
    description: 'Allow users to run as standard users while elevating privileges only when needed.',
    businessValue: 'Reduces risk from local admin rights without impacting productivity.',
    e3Included: false,
    keyCapabilities: [
      'Just-in-time elevation',
      'Rule-based automatic elevation',
      'Support-approved elevation',
      'Elevation audit reporting',
      'Integration with Conditional Access',
      'Reduced attack surface from admin rights',
    ],
  },
  {
    id: 'intune-cloud-pki',
    name: 'Intune Cloud PKI',
    category: 'device-management',
    description: 'Cloud-based certificate authority for device and user certificate management.',
    businessValue: 'Eliminates need for on-premises PKI infrastructure - significant cost and complexity reduction.',
    e3Included: false,
    keyCapabilities: [
      'Cloud-based certificate issuance',
      'SCEP certificate profiles',
      'Certificate lifecycle management',
      'Integration with Conditional Access',
      'Wi-Fi & VPN certificate authentication',
      'No on-premises CA infrastructure needed',
    ],
  },
  {
    id: 'intune-remote-help',
    name: 'Intune Remote Help',
    category: 'device-management',
    description: 'Cloud-based remote assistance with role-based access controls.',
    businessValue: 'Replaces third-party remote support tools (TeamViewer, ConnectWise) with integrated solution.',
    e3Included: false,
    keyCapabilities: [
      'Remote view and full control',
      'Role-based access controls',
      'Conditional Access integration',
      'Session audit & compliance logging',
      'Unattended device access',
      'Entra ID authenticated sessions',
    ],
  },
  {
    id: 'intune-advanced-analytics',
    name: 'Intune Advanced Analytics',
    category: 'device-management',
    description: 'Advanced device analytics with anomaly detection and device timeline.',
    businessValue: 'Proactive endpoint health monitoring reduces support tickets and downtime.',
    e3Included: false,
    keyCapabilities: [
      'Device anomaly detection',
      'Device timeline view',
      'Battery health tracking',
      'Custom device scopes',
      'Enhanced app reliability reporting',
      'Proactive remediation insights',
    ],
  },

  // Productivity
  {
    id: 'teams-phone',
    name: 'Teams Phone Standard',
    category: 'productivity',
    description: 'Cloud-based phone system with PSTN calling capabilities.',
    businessValue: 'Replaces traditional PBX systems and standalone UCaaS (RingCentral, 8x8).',
    e3Included: false,
    keyCapabilities: [
      'Cloud PBX capabilities',
      'Auto attendants & call queues',
      'Voicemail with transcription',
      'Call transfer & forwarding',
      'Music on hold',
      'Requires Calling Plan or Direct Routing for PSTN',
    ],
  },
  {
    id: 'power-bi-pro',
    name: 'Power BI Pro',
    category: 'productivity',
    description: 'Business intelligence and data visualisation with sharing and collaboration.',
    businessValue: 'Included in E5 vs £7.50/user/month standalone - immediate cost saving.',
    e3Included: false,
    keyCapabilities: [
      'Interactive reports & dashboards',
      'Data modelling & DAX',
      'Publish & share reports',
      'Row-level security',
      'Scheduled data refresh',
      'Paginated reports',
    ],
  },
  {
    id: 'viva-suite',
    name: 'Microsoft Viva (selected modules)',
    category: 'productivity',
    description: 'Employee experience platform with insights, learning, and engagement.',
    businessValue: 'Drives employee engagement and productivity measurement.',
    e3Included: false,
    keyCapabilities: [
      'Viva Insights (personal & manager)',
      'Viva Learning integration',
      'Viva Engage (advanced)',
      'Viva Glint (engagement surveys)',
      'Viva Goals (OKR tracking)',
      'Organisational analytics',
    ],
  },

  // AI
  {
    id: 'security-copilot',
    name: 'Microsoft Security Copilot',
    category: 'ai',
    description: 'AI-powered security assistant that helps security teams detect, investigate, and respond to threats faster.',
    businessValue: 'Force-multiplier for security teams - accelerates investigation by up to 65% (Microsoft research).',
    e3Included: false,
    keyCapabilities: [
      'Natural language security queries',
      'Incident summarisation',
      'Threat intelligence analysis',
      'Script & code analysis',
      'KQL query generation',
      'Integration across Microsoft Defender suite',
    ],
  },
];

export const WORKLOAD_CATEGORIES = [
  { id: 'security', name: 'Security', icon: '🛡️' },
  { id: 'compliance', name: 'Compliance & Governance', icon: '📋' },
  { id: 'identity', name: 'Identity & Access', icon: '🔑' },
  { id: 'device-management', name: 'Device Management', icon: '💻' },
  { id: 'productivity', name: 'Productivity', icon: '📊' },
  { id: 'ai', name: 'AI & Copilot', icon: '🤖' },
] as const;

export function getWorkloadsByCategory(category: string): E5Workload[] {
  return E5_WORKLOADS.filter((w) => w.category === category);
}

export function getWorkloadById(id: string): E5Workload | undefined {
  return E5_WORKLOADS.find((w) => w.id === id);
}
