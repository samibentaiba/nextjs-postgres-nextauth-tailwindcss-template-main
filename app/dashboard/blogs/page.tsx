"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/main/dashboard-header"
import { DashboardShell } from "@/components/dashboard/main/dashboard-shell"
import { RecentBlogs } from "@/components/dashboard/recent-blogs"

export default function BlogsPage() {
  return (
    <DashboardShell >
      <DashboardHeader heading="Blogs" description="Manage your blog posts and content.">
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Link>
        </Button>
      </DashboardHeader>
      <RecentBlogs />
    </DashboardShell>
  )
}
