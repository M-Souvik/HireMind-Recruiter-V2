// Types for /api/v1/jobs/

export interface Organization {
  id: string
  name: string
  email: string
  about: string
  icon: string
  website_link: string
  status: string
  created_at: string
  updated_at: string
}

export interface CreatedBy {
  id: string
  name: string
  phone: string
  email: string
  organization_id: Organization
  status: string
  created_at: string
  updated_at: string
}

export interface Job {
  _id: string
  name: string
  job_desc: string
  min_salary_range: number
  max_salary_range: number
  organization: Organization
  skills: string[]
  created_by: CreatedBy
  status: "open" | "closed" | "paused"
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

export interface JobsResponse {
  message: string
  data: Job[]
}
