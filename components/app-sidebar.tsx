"use client"

import * as React from "react"
import { useState, useEffect } from "react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BrainCircuitIcon,
  LayoutDashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  BarChart3Icon,
  Settings2Icon,
  FileTextIcon,
} from "lucide-react"

// Navigation data
const data = {
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      name: "Job Listings",
      url: "/job-listings",
      icon: <BriefcaseIcon />,
    },
    {
      name: "Candidates",
      url: "#",
      icon: <UsersIcon />,
    },
    {
      name: "Interviews",
      url: "#",
      icon: <CalendarCheckIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <BarChart3Icon />,
    },
    {
      name: "Documents",
      url: "#",
      icon: <FileTextIcon />,
    },
    {
      name: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string }>({
    name: "",
    email: "",
    avatar: "",
  })

  useEffect(() => {
    const stored = sessionStorage.getItem("recruiter")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      {/* -- Brand Header ------------------------------------------------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="sidebar-brand-btn"
              render={<a href="/dashboard" />}
            >
              {/* Logo icon */}
              <div className="sidebar-brand-logo">
                <BrainCircuitIcon className="sidebar-brand-icon" />
              </div>

              {/* Brand name — hidden when sidebar is collapsed to icon */}
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">HireMind</span>
                <span className="sidebar-brand-tagline">Recruiter Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* -- Nav Items --------------------------------------------------- */}
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>

      {/* -- User Footer ------------------------------------------------- */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
