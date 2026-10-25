import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import RecruiterAuthGuard from "@/components/auth/RecruiterAuthGuard"

export const metadata: Metadata = {
    title: "HireMind – Recruiter Portal",
    description:
        "Sign in or create your HireMind recruiter account to start finding top talent.",
}

export default function RecruiterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RecruiterAuthGuard>
            <TooltipProvider>
                <SidebarProvider>
                    <AppSidebar />

                    {/* <AppSidebar /> */}
                    <SidebarInset className="recruiter-inset">

                        {/* Page content */}
                        <main className="recruiter-main">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </RecruiterAuthGuard>
    )
}
