export interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  required_tier: 'any' | 'junior' | 'mid' | 'senior';
  client_name: string;
  unique_link: string;
  created_at: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  required_tier: string;
  client_name: string;
}

export interface CreateJobResponse {
  id: string;
  unique_link: string;
  apply_url: string;
  dashboard_url: string;
}

export interface ApplicationPayload {
  freelancer_name: string;
  skills: string[];
  years_experience: number;
  portfolio_urls: string[];
  bio: string;
  testimonies: string;
  proposed_rate: number;
}

export interface ApplicationResult {
  access_granted: boolean;
  inferred_tier?: string;
  fit_score?: number;
  overall_rank_score?: number;
  rank_position?: number;
  total_applicants?: number;
  ai_reasoning?: string;
  rejection_reason?: string;
}

export interface Applicant {
  id: string;
  job_id: string;
  freelancer_name: string;
  skills: string[];
  years_experience: number;
  inferred_tier: string;
  fit_score: number;
  testimony_score: number;
  price_score: number;
  overall_rank_score: number;
  proposed_rate: number;
  ai_reasoning: string;
  portfolio_urls: string[] | null;
  bio: string | null;
  testimonies: string | null;
  access_granted: boolean;
  rejection_reason: string | null;
  created_at: string;
}

export interface FilterParams {
  tier?: 'junior' | 'mid' | 'senior';
  sort?: 'rank' | 'price' | 'testimony';
}
