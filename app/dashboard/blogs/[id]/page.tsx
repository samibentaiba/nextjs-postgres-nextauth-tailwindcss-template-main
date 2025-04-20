"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BlogForm } from "@/components/dashboard/blog-form"
import { toast } from "@/hooks/use-toast"

interface Blog {
  id: number
  title: string
  content: string
  status: "active" | "inactive" | "archived"
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Blog not found",
              description: "The blog you're trying to edit doesn't exist.",
              variant: "destructive",
            })
            router.push("/dashboard/blogs")
            return
          }
          throw new Error("Failed to fetch blog")
        }

        const data = await response.json()
        setBlog(data)
      } catch (error) {
        console.error("Error fetching blog:", error)
        toast({
          title: "Error",
          description: "Failed to load blog data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBlog()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Edit Blog" description="Loading blog data..." />
        <div className="flex items-center justify-center p-8">
          <p>Loading blog data...</p>
        </div>
      </DashboardShell>
    )
  }

  if (!blog) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Edit Blog" description="Blog not found" />
        <div className="flex items-center justify-center p-8">
          <p>Blog not found.</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Blog" description={`Edit details for ${blog.title}`} />
      <div className="grid gap-8">
        <BlogForm blog={blog} />
      </div>
    </DashboardShell>
  )
}
