"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

// Define schema for advanced settings
const advancedSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  debugMode: z.boolean(),
  cacheEnabled: z.boolean(),
  analyticsId: z.string().optional().or(z.literal("")),
  customCss: z.string().optional().or(z.literal("")),
  customJs: z.string().optional().or(z.literal("")),
})

// Define type based on schema
type AdvancedSettings = z.infer<typeof advancedSettingsSchema>

// Sample initial data
const defaultValues: AdvancedSettings = {
  maintenanceMode: false,
  debugMode: false,
  cacheEnabled: true,
  analyticsId: "UA-XXXXXXXXX-X",
  customCss: "",
  customJs: "",
}

export function AdvancedSettingsForm() {
  // Set up the form
  const form = useForm<AdvancedSettings>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues,
  })

  // Handle form submission
  async function onSubmit(data: AdvancedSettings) {
    // In a real app, you would save this data to your backend
    console.log("Advanced settings submitted:", data)

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Advanced settings saved",
      description: "Your advanced settings have been saved successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Configure advanced settings for your website.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <FormDescription>Enable maintenance mode to show a maintenance page to visitors.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="debugMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Debug Mode</FormLabel>
                      <FormDescription>Enable debug mode for development purposes.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cacheEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Cache Enabled</FormLabel>
                      <FormDescription>Enable caching for better performance.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="analyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="UA-XXXXXXXXX-X" {...field} />
                  </FormControl>
                  <FormDescription>Your Google Analytics tracking ID.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customCss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom CSS</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom CSS" {...field} />
                  </FormControl>
                  <FormDescription>Custom CSS to be added to your website.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customJs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom JavaScript</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom JavaScript" {...field} />
                  </FormControl>
                  <FormDescription>Custom JavaScript to be added to your website.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
