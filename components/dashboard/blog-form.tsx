"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/dashboard-ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/dashboard-ui/form"
import { Input } from "@/components/dashboard-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard-ui/select"
import { Textarea } from "@/components/dashboard-ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/dashboard-ui/card"

const blogFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  status: z.enum(["active", "inactive", "archived"], {
    required_error: "Please select a status.",
  }),
})

type BlogFormValues = z.infer<typeof blogFormSchema>

interface BlogFormProps {
  blog?: BlogFormValues & { id: number }
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: Partial<BlogFormValues> = {
    title: blog?.title || "",
    content: blog?.content || "",
    status: blog?.status || "active",
  }

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
  })

  async function onSubmit(data: BlogFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch(blog?.id ? `/api/blogs/${blog.id}` : "/api/blogs", {
        method: blog?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save blog")
      }

      toast({
        title: "Success",
        description: blog?.id ? "Blog updated successfully" : "Blog created successfully",
      })

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog title" {...field} />
                  </FormControl>
                  <FormDescription>The title of your blog post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your blog content here..." className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormDescription>The main content of your blog post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The current status of your blog post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <span>Saving...</span> : blog?.id ? "Update Blog" : "Create Blog"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
