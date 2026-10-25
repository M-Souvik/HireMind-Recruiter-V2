// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  recruiter?: {
    id: string
    email: string
    name?: string
  }
}
