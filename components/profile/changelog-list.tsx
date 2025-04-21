"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { PackageIcon, FileTextIcon, PlusIcon, PencilIcon, ArchiveIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UIError } from "@/components/ui-error"

type ChangelogItemType = "product" | "blog"
type ChangelogAction = "create" | "update" | "archive"

interface ChangelogItem {
  id: number
  type: ChangelogItemType
  action: ChangelogAction
  itemId: number
  itemName: string
  timestamp: string
  user: {
    id: number
    name: string
  }
}

interface ChangelogListProps {
  type: "all" | "products" | "blogs"
  limit?: number
}

export function ChangelogList({ type = "all", limit = 10 }: ChangelogListProps) {
  const [logs, setLogs] = useState<ChangelogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Mock API call - replace with your actual API endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockLogs: ChangelogItem[] = [
          {
            id: 1,
            type: "product",
            action: "create",
            itemId: 101,
            itemName: "Premium Headphones",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            user: { id: 1, name: "Admin User" },
          },
          {
            id: 2,
            type: "blog",
            action: "update",
            itemId: 201,
            itemName: "Top 10 Tech Gadgets of 2023",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            user: { id: 1, name: "Admin User" },
          },
          {
            id: 3,
            type: "product",
            action: "update",
            itemId: 102,
            itemName: "Wireless Keyboard",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            user: { id: 1, name: "Admin User" },
          },
          {
            id: 4,
            type: "blog",
            action: "create",
            itemId: 202,
            itemName: "How to Choose the Right Headphones",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            user: { id: 1, name: "Admin User" },
          },
          {
            id: 5,
            type: "product",
            action: "archive",
            itemId: 103,
            itemName: "Bluetooth Speaker",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            user: { id: 1, name: "Admin User" },
          },
          {
            id: 6,
            type: "blog",
            action: "archive",
            itemId: 203,
            itemName: "The Future of Smart Home Devices",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            user: { id: 1, name: "Admin User" },
          },
        ]

        // Filter logs based on type
        const filteredLogs =
          type === "all"
            ? mockLogs
            : type === "products"
              ? mockLogs.filter((log) => log.type === "product")
              : mockLogs.filter((log) => log.type === "blog")

        setLogs(filteredLogs.slice(0, limit))
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch changelog"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [type, limit])

  if (isLoading) {
    return <ChangelogSkeleton />
  }

  if (error) {
    return (
      <UIError
        title="Failed to load changelog"
        description="We couldn't load the activity log. Please try again."
        error={error.message}
        retry={() => window.location.reload()}
      />
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No activity found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start space-x-4 rounded-lg border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {log.type === "product" ? (
              <PackageIcon className="h-5 w-5 text-primary" />
            ) : (
              <FileTextIcon className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{log.itemName}</p>
              <ActionBadge action={log.action} />
            </div>
            <p className="text-sm text-muted-foreground">
              {log.type === "product" ? "Product" : "Blog post"} {getActionText(log.action)} by {log.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActionBadge({ action }: { action: ChangelogAction }) {
  const variants = {
    create: "bg-green-100 text-green-800 hover:bg-green-100",
    update: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    archive: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  }

  const icons = {
    create: <PlusIcon className="mr-1 h-3 w-3" />,
    update: <PencilIcon className="mr-1 h-3 w-3" />,
    archive: <ArchiveIcon className="mr-1 h-3 w-3" />,
  }

  return (
    <Badge variant="outline" className={`flex items-center ${variants[action]}`}>
      {icons[action]}
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </Badge>
  )
}

function getActionText(action: ChangelogAction): string {
  switch (action) {
    case "create":
      return "created"
    case "update":
      return "updated"
    case "archive":
      return "archived"
    default:
      return action
  }
}

function ChangelogSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start space-x-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )
}
