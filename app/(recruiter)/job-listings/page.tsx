"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api/client"
import type { Job, JobsResponse } from "@/types/jobs"
import {
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronRightIcon,
  CircleDotIcon,
  CircleOffIcon,
  ClockIcon,
  GitForkIcon,
  PauseCircleIcon,
  Plus,
  SearchIcon,
  WalletIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import JobCard from "@/components/section/jobs/JobCard"

// ── Helpers ──────────────────────────────────────────────────────────────────


// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="jl-card jl-card--skeleton">
      <div className="jl-card-header">
        <div className="jl-skeleton jl-skeleton-avatar" />
        <div className="jl-card-title-group">
          <div className="jl-skeleton jl-skeleton-title" />
          <div className="jl-skeleton jl-skeleton-sub" />
        </div>
        <div className="jl-skeleton jl-skeleton-badge" />
      </div>
      <div className="jl-meta-row">
        <div className="jl-skeleton jl-skeleton-meta" />
        <div className="jl-skeleton jl-skeleton-meta" />
        <div className="jl-skeleton jl-skeleton-meta" />
      </div>
      <div className="jl-skills-row">
        {[1, 2, 3].map((i) => (
          <div key={i} className="jl-skeleton jl-skeleton-skill" />
        ))}
      </div>
      <div className="jl-card-actions">
        <div className="jl-skeleton jl-skeleton-btn" />
        <div className="jl-skeleton jl-skeleton-btn-sm" />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (() => {
          try {
            return JSON.parse(sessionStorage.getItem("token") ?? "{}")
          } catch {
            return undefined
          }
        })()
        : undefined

    console.log("token: ", token)

    apiGet<JobsResponse>("/api/v1/jobs/", token)
      .then((res) => setJobs(res.data))
      .catch(() => setError("Failed to load job listings. Please try again."))
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(
    (j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.organization.name.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="jl-page">
      {/* Page header */}
      <header className="jl-page-header">
        <div className="jl-page-header-left">
          <div className="jl-page-icon-wrap">
            <BriefcaseIcon className="jl-page-icon" />
          </div>
          <div>
            <h1 className="jl-page-title">Job Listings</h1>
            <p className="jl-page-sub">
              {loading ? "Loading..." : `${filtered.length} role${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">

          <div className="jl-search-wrap">
            <SearchIcon className="jl-search-icon" />
            <input
              id="jl-search"
              type="search"
              placeholder="Search by title, org, or skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="jl-search-input"
            />
          </div>
          <Link href={"/job-listings/create"} className="jl-btn jl-btn--primary">
            <Plus size={16} /> Create Job
          </Link>
        </div>

      </header>

      {/* Error */}
      {error && (
        <div className="jl-error" role="alert">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? (
              <div className="jl-empty">
                <BriefcaseIcon size={40} className="jl-empty-icon" />
                <p>No jobs match your search.</p>
              </div>
            )
            : filtered.map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  )
}