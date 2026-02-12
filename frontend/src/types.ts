export type Role = 'Admin' | 'Security Analyst' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Risk {
  _id: string;
  threatType:
    | 'Phishing'
    | 'Malware'
    | 'Data Breach'
    | 'Insider Threat'
    | 'Weak Password'
    | 'Network Attack';
  description: string;
  affectedAsset: 'Server' | 'Database' | 'Network' | 'Employee Device' | 'Web App';
  likelihood: number;
  impact: number;
  riskScore: number;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Closed';
  archived?: boolean;
  archivedAt?: string;
  reportedBy: {
    _id: string;
    name: string;
    email: string;
    role: Role;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RiskSummary {
  total: number;
  open: number;
  closed: number;
  highSeverity: number;
  severityDistribution: {
    Low: number;
    Medium: number;
    High: number;
  };
  statusDistribution: {
    Open: number;
    Investigating: number;
    Mitigated: number;
    Closed: number;
  };
  recent: Risk[];
}

