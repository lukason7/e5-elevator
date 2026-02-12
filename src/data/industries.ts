export interface IndustryProfile {
  id: string;
  name: string;
  sicCodePrefixes: string[];
  riskLevel: 'high' | 'medium' | 'low';
  relevantFrameworks: string[];
  commonBreachTypes: string[];
  regulatoryPressure: string;
  averageBreachCostGBP: string;
  frontlineWorkers: boolean;
}

export const INDUSTRIES: IndustryProfile[] = [
  {
    id: 'financial-services',
    name: 'Financial Services',
    sicCodePrefixes: ['64', '65', '66'],
    riskLevel: 'high',
    relevantFrameworks: ['cyber-essentials', 'dora', 'iso-27001', 'soc2', 'nist-csf'],
    commonBreachTypes: ['phishing', 'credential-theft', 'insider-threat', 'ransomware'],
    regulatoryPressure: 'FCA, PRA, DORA compliance. Heavy regulatory scrutiny with significant fines for data breaches.',
    averageBreachCostGBP: '£4.5M',
    frontlineWorkers: false,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    sicCodePrefixes: ['86', '87', '88'],
    riskLevel: 'high',
    relevantFrameworks: ['cyber-essentials', 'nis2', 'iso-27001', 'nist-csf'],
    commonBreachTypes: ['ransomware', 'phishing', 'data-exfiltration', 'legacy-system-exploit'],
    regulatoryPressure: 'NHS DSPT requirements, ICO enforcement for patient data breaches, NIS2 essential services.',
    averageBreachCostGBP: '£3.8M',
    frontlineWorkers: true,
  },
  {
    id: 'legal',
    name: 'Legal Services',
    sicCodePrefixes: ['69'],
    riskLevel: 'high',
    relevantFrameworks: ['cyber-essentials', 'iso-27001', 'soc2'],
    commonBreachTypes: ['phishing', 'data-exfiltration', 'credential-theft', 'business-email-compromise'],
    regulatoryPressure: 'SRA requirements for client data protection. High-value target due to sensitive legal documents.',
    averageBreachCostGBP: '£3.2M',
    frontlineWorkers: false,
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    sicCodePrefixes: ['47', '45', '46'],
    riskLevel: 'medium',
    relevantFrameworks: ['cyber-essentials', 'iso-27001', 'nist-csf'],
    commonBreachTypes: ['ransomware', 'payment-card-theft', 'phishing', 'supply-chain-attack'],
    regulatoryPressure: 'PCI DSS for payment data, ICO enforcement for customer data, GDPR.',
    averageBreachCostGBP: '£2.5M',
    frontlineWorkers: true,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    sicCodePrefixes: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33'],
    riskLevel: 'medium',
    relevantFrameworks: ['cyber-essentials', 'nis2', 'iso-27001'],
    commonBreachTypes: ['ransomware', 'supply-chain-attack', 'ip-theft', 'ot-attack'],
    regulatoryPressure: 'NIS2 for essential services, supply chain security requirements from customers.',
    averageBreachCostGBP: '£2.8M',
    frontlineWorkers: true,
  },
  {
    id: 'education',
    name: 'Education',
    sicCodePrefixes: ['85'],
    riskLevel: 'medium',
    relevantFrameworks: ['cyber-essentials', 'iso-27001', 'nist-csf'],
    commonBreachTypes: ['ransomware', 'phishing', 'data-breach', 'credential-stuffing'],
    regulatoryPressure: 'DfE cyber standards, Jisc guidance, ICO enforcement for student data.',
    averageBreachCostGBP: '£1.5M',
    frontlineWorkers: false,
  },
  {
    id: 'public-sector',
    name: 'Public Sector',
    sicCodePrefixes: ['84'],
    riskLevel: 'high',
    relevantFrameworks: ['cyber-essentials', 'cyber-essentials-plus', 'nis2', 'nist-csf'],
    commonBreachTypes: ['ransomware', 'phishing', 'nation-state', 'insider-threat'],
    regulatoryPressure: 'Mandatory Cyber Essentials for government contracts, NCSC CAF, NIS2.',
    averageBreachCostGBP: '£2.0M',
    frontlineWorkers: true,
  },
  {
    id: 'technology',
    name: 'Technology',
    sicCodePrefixes: ['62', '63'],
    riskLevel: 'medium',
    relevantFrameworks: ['iso-27001', 'soc2', 'nist-csf', 'cyber-essentials'],
    commonBreachTypes: ['supply-chain-attack', 'credential-theft', 'api-exploitation', 'insider-threat'],
    regulatoryPressure: 'Customer-driven security requirements, SOC 2 / ISO 27001 for enterprise sales.',
    averageBreachCostGBP: '£3.5M',
    frontlineWorkers: false,
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    sicCodePrefixes: ['35', '36', '37', '38', '39'],
    riskLevel: 'high',
    relevantFrameworks: ['nis2', 'cyber-essentials', 'iso-27001', 'nist-csf'],
    commonBreachTypes: ['nation-state', 'ransomware', 'ot-attack', 'supply-chain-attack'],
    regulatoryPressure: 'NIS2 essential services, Ofgem requirements, CNI protection obligations.',
    averageBreachCostGBP: '£4.0M',
    frontlineWorkers: true,
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    sicCodePrefixes: ['70', '71', '72', '73', '74'],
    riskLevel: 'medium',
    relevantFrameworks: ['cyber-essentials', 'iso-27001', 'soc2'],
    commonBreachTypes: ['phishing', 'business-email-compromise', 'data-exfiltration', 'credential-theft'],
    regulatoryPressure: 'Client-driven security requirements, professional body standards.',
    averageBreachCostGBP: '£2.2M',
    frontlineWorkers: false,
  },
];

export function getIndustryById(id: string): IndustryProfile | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

export function getIndustryBySicCode(sicCode: string): IndustryProfile | undefined {
  return INDUSTRIES.find((i) =>
    i.sicCodePrefixes.some((prefix) => sicCode.startsWith(prefix))
  );
}
