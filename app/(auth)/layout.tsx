import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HireMind – Recruiter Portal",
  description:
    "Sign in or create your HireMind recruiter account to start finding top talent.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
