import { DashboardHeader } from "@/components/dashboard/main/dashboard-header"
import { DashboardShell } from "@/components/dashboard/main/dashboard-shell"
import { BlogForm } from "@/components/dashboard/blog-form"

export default function NewBlogPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Blog" description="Add a new blog post to your website" />
      <div className="grid gap-8">
        <BlogForm />
      </div>
    </DashboardShell>
  )
}
