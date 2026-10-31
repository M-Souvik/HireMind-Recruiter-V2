// Types for /api/v1/round/{job_id} — rounds list

export type RoundType =
  | "ai_screen"
  | "technical"
  | "hr"
  | "assignment"
  | "culture_fit"
  | "final"
  | string

export type RoundStatus =
  | "IN_PROGRESS"
  | "in_progress"
  | "active"
  | "ENDED"
  | "ended"
  | "completed"
  | "SCHEDULED"
  | "scheduled"
  | "cancelled"
  | string

export interface Round {
  _id: string
  type: RoundType
  job: { id: string; collection: string }
  start_time: string
  end_time: string
  joining_link: string
  status: RoundStatus
  order: number
  created_by: { id: string; collection: string }
  created_at: string
  updated_at: string
}

export interface RoundsResponse {
  data: Round[]
}

// Types for candidates-per-round response

export interface CandidateProfile {
  id: string
  name: string
  email: string
  phone: number
  resume_link: string
  linkedin_profile: string | null
  github_profile: string | null
  projects: unknown[] | null
  status: string
}

export type Verdict = "Recommended" | "Not Recommended" | "On Hold" | string

export interface AiEvaluation {
  overall_score: number
  resume_match:   { score: number; remarks: string; matching_elements?: string[]; missing_elements?: string[] }
  linkedin_match: { score: number; remarks: string }
  github_match:   { score: number; remarks: string; notable_repositories?: string[] }
  projects_match: { score: number; remarks: string }
  skills_match:   { score: number; remarks: string; matched_skills?: string[]; missing_skills?: string[] }
  strengths: string[]
  weaknesses: string[]
  verdict: Verdict
}

export interface PipelineCandidate {
  id: string
  candidate_id: CandidateProfile
  job_id: string
  resume_link: string
  skills: string[]
  cover_letter: string
  description: string
  linkedin_profile: string | null
  github_profile: string | null
  projects: unknown[] | null
  ai_score: number
  ai_evaluation: AiEvaluation
  current_round_id: string
  status: "pending" | "passed" | "failed" | "shortlisted" | string
  submitted_at: string
}

export interface CandidatesResponse {
  message: string
  candidates: PipelineCandidate[]
}

export interface AssessmentQuestion {
  question: string
  options: string[]
  answer: string
  marks: number
}

export interface AssessmentQuestionList {
  id: string
  name: string
  total_marks: number
  total_questions: number
  questions: AssessmentQuestion[]
  uploaded_at: string
  uploaded_by: string | null
}

export interface QuestionListResponse {
  success: boolean
  count: number
  data: AssessmentQuestionList[]
}

