import { formatDate, formatSalary } from '@/lib/utils'
import { Job } from '@/types/jobs'
import { BuildingIcon, CalendarIcon, ChevronRightIcon, CircleDotIcon, CircleOffIcon, ClockIcon, GitForkIcon, PauseCircleIcon, WalletIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

function SkillPill({ skill }: { skill: string }) {
    return <span className="jl-skill">{skill}</span>
}

function StatusBadge({ status }: { status: Job["status"] }) {
    const map = {
        open: {
            icon: <CircleDotIcon className="jl-badge-icon" />,
            label: "Open",
            cls: "jl-badge--open",
        },
        closed: {
            icon: <CircleOffIcon className="jl-badge-icon" />,
            label: "Closed",
            cls: "jl-badge--closed",
        },
        paused: {
            icon: <PauseCircleIcon className="jl-badge-icon" />,
            label: "Paused",
            cls: "jl-badge--paused",
        },
    }
    const { icon, label, cls } = map[status] ?? map.open
    return (
        <span className={`jl-badge ${cls}`}>
            {icon}
            {label}
        </span>
    )
}

const JobCard = ({ job }: { job: Job }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <article className="jl-card">
            {/* Top row: org logo + title + status */}
            <div className="jl-card-header">
                <div className="jl-org-logo-wrap">
                    {job.organization.icon ? (
                        <Image
                            src={job.organization.icon}
                            alt={job.organization.name}
                            width={44}
                            height={44}
                            className="jl-org-logo"
                            unoptimized
                        />
                    ) : (
                        <div className="jl-org-logo-fallback">
                            <BuildingIcon size={22} />
                        </div>
                    )}
                </div>

                <div className="jl-card-title-group">
                    <h2 className="jl-card-title">{job.name}</h2>
                    <span className="jl-card-org">{job.organization.name}</span>
                </div>

                <StatusBadge status={job.status} />
            </div>

            {/* Meta row */}
            <div className="jl-meta-row">
                <span className="jl-meta-item">
                    <WalletIcon className="jl-meta-icon" />
                    {formatSalary(job.min_salary_range)} &ndash;{" "}
                    {formatSalary(job.max_salary_range)} / yr
                </span>
                <span className="jl-meta-item">
                    <CalendarIcon className="jl-meta-icon" />
                    Posted {formatDate(job.created_at)}
                </span>
                <span className="jl-meta-item">
                    <ClockIcon className="jl-meta-icon" />
                    Closes {formatDate(job.end_time)}
                </span>
            </div>

            {/* Skills */}
            <div className="jl-skills-row">
                {job.skills.map((s) => (
                    <SkillPill key={s} skill={s} />
                ))}
            </div>

            {/* Expandable job description */}
            <div className={`jl-desc-wrap ${expanded ? "jl-desc-wrap--open" : ""}`}>
                <div
                    className="jl-desc"
                    dangerouslySetInnerHTML={{ __html: job.job_desc }}
                />
            </div>
            <button
                className="jl-expand-btn"
                onClick={() => setExpanded((p) => !p)}
                aria-expanded={expanded}
            >
                {expanded ? "Hide description" : "View description"}
                <ChevronRightIcon
                    className={`jl-expand-chevron ${expanded ? "jl-expand-chevron--open" : ""}`}
                />
            </button>

            {/* Actions */}
            <div className="jl-card-actions">
                <Link
                    href={`/job-listings/${job._id}`}
                    className="jl-btn jl-btn--ghost"
                >
                    View Details
                    <ChevronRightIcon size={14} />
                </Link>
                <Link
                    href={`/job-listings/${job._id}/pipeline`}
                    className="jl-btn jl-btn--primary"
                >
                    <GitForkIcon size={15} />
                    Manage Pipeline
                </Link>
            </div>
        </article>
    )
}

export default JobCard