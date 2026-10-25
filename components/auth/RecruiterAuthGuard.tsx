"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface RecruiterAuthGuardProps {
    children: React.ReactNode
}

/**
 * RecruiterAuthGuard
 *
 * A client-side auth guard that checks sessionStorage for a recruiter session.
 * If no session is found, it redirects the user to /login.
 *
 * Usage: Wrap any recruiter-protected layout or page with this component.
 */
export default function RecruiterAuthGuard({ children }: RecruiterAuthGuardProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const recruiter = sessionStorage.getItem("recruiter")

        if (!recruiter) {
            router.replace("/login")
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    if (!isAuthorized) {
        // Render nothing while checking auth to avoid flash of protected content
        return null
    }

    return <>{children}</>
}
