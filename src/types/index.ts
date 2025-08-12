export interface CompanyInfo {
  company_name: string;
  address: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
}

export interface JobDetails {
  job_level: 'entry' | 'junior' | 'mid' | 'senior' | 'executive';
  employment_type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  location: string;
  department: string;
  remote_option: 'onsite' | 'hybrid' | 'remote';
}

export interface Compensation {
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
}

export interface Requirements {
  education: {
    min_degree: string;
    preferred_major: string[];
  };
  experience: {
    min_years: number;
    preferred_industry: string[];
  };
  skills: {
    technical_skills: string[];
    preferred_skills: string[];
    soft_skills: string[];
  };
  certifications: string[];
  languages: string[];
}

export interface ApplicationInfo {
  deadline?: string;
  application_method: string;
  required_documents: string[];
}

export interface JobData {
  job_title: string;
  company_info: CompanyInfo;
  job_details: JobDetails;
  compensation: Compensation;
  requirements: Requirements;
  responsibilities: string[];
  job_description: string;
  application_info: ApplicationInfo;
}

export interface ValidationResponse {
  status: 'success' | 'incomplete' | 'error';
  message?: string;
  missing_fields?: string[];
  example?: string;
  job_data?: JobData;
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  education: {
    degree: string;
    major: string;
    university: string;
    graduation_year: number;
  };
  experience: {
    total_years: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      responsibilities: string[];
    }>;
  };
  skills: {
    technical_skills: string[];
    soft_skills: string[];
  };
  certifications: string[];
  languages: string[];
  location_preference: string;
}

export interface JobRecommendation {
  job_id: string;
  company_name: string;
  job_title: string;
  match_percentage: number;
  location: string;
  salary_range: string;
  contact_info: {
    email: string;
    phone: string;
  };
  why_matched: string[];
  areas_to_improve: string[];
  application_tips: string;
}

export interface MatchingResponse {
  candidate_profile: CandidateProfile;
  job_recommendations: JobRecommendation[];
  summary: {
    total_jobs_found: number;
    best_match_percentage: number;
    recommended_skills_to_learn: string[];
  };
}

export interface AdminConfig {
  gemini_api_key: string;
  job_processing_prompt: string;
  cv_processing_prompt: string;
  matching_parameters: {
    education_weight: number;
    experience_weight: number;
    technical_skills_weight: number;
    soft_skills_weight: number;
    location_weight: number;
  };
  approval_settings: {
    auto_approve_jobs: boolean;
    auto_approve_cvs: boolean;
    require_captcha: boolean;
  };
}

export interface JobPosting {
  id: string;
  job_data: JobData;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CVSubmission {
  id: string;
  candidate_profile: CandidateProfile;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  file_name: string;
}

export interface CaptchaChallenge {
  question: string;
  answer: number;
}