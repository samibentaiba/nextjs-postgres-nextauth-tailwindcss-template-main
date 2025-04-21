"use client"

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorProps {
  title?: string
  description?: string
  error: string
  retry?: () => void
  fullPage?: boolean
  className?: string
}

export function UIError({
  title = "Error loading data",
  description = "We couldn't load the requested data. Please try again.",
  error,
  retry,
  fullPage = false,
  className = "",
}: ErrorProps) {
  const containerClasses = fullPage ? "flex min-h-screen items-center justify-center bg-gray-50 p-4" : "w-full p-4"

  return (
    <div className={`${containerClasses} ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-center text-xl">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-words">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {retry && (
            <Button onClick={retry} variant="default">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
