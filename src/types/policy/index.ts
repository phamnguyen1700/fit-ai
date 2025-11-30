export interface Policy {
  id: string;
  policyType: string;
  title: string;
  version: string;
  content: string;
  isActive: boolean;
  lastCreate?: string;
  lastUpdate?: string;
}

export interface PolicyParams {
  policyType?: string;
  isActive?: boolean;
}

export interface CreatePolicyRequest {
  policyType: string;
  title: string;
  version: string;
  content: string;
}

export interface UpdatePolicyRequest {
  title: string;
  content: string;
  isActive: boolean;
}

