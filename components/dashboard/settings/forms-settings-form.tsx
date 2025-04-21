"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Trash, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

// Define schema for form item
const formItemSchema = z.object({
  name: z.string().min(2, { message: "Form name must be at least 2 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  active: z.boolean(),
})

// Define schema for forms settings
const formsSettingsSchema = z.object({
  forms: z.array(formItemSchema),
})

// Define types based on schemas
type FormItemType = z.infer<typeof formItemSchema>
type FormsSettings = z.infer<typeof formsSettingsSchema>

// Sample initial data
const defaultValues: FormsSettings = {
  forms: [
    {
      name: "Contact Form",
      url: "https://forms.google.com/contact",
      active: true,
    },
    {
      name: "Feedback Form",
      url: "https://forms.google.com/feedback",
      active: true,
    },
    {
      name: "Support Request",
      url: "https://forms.google.com/support",
      active: false,
    },
  ],
}

export function FormsSettingsForm() {
  // State for forms
  const [forms, setForms] = useState<FormItemType[]>(defaultValues.forms)

  // Set up the form
  const form = useForm<FormsSettings>({
    resolver: zodResolver(formsSettingsSchema),
    defaultValues,
  })

  // Handle form submission
  async function onSubmit(data: FormsSettings) {
    // In a real app, you would save this data to your backend
    console.log("Forms settings submitted:", data)

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Forms settings saved",
      description: "Your external forms settings have been saved successfully.",
    })
  }

  // Add a new form
  function addForm() {
    const newForm: FormItemType = { name: "", url: "", active: true }
    const newForms = [...forms, newForm]
    setForms(newForms)
    form.setValue("forms", newForms)
  }

  // Remove a form
  function removeForm(index: number) {
    const newForms = [...forms]
    newForms.splice(index, 1)
    setForms(newForms)
    form.setValue("forms", newForms)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Forms</CardTitle>
        <CardDescription>Manage external form links such as Google Forms.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {forms.map((formItem, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Form {index + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeForm(index)}
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove form</span>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`forms.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact Form" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`forms.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://forms.google.com/example" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`forms.${index}.active`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>Enable or disable this form on your website.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addForm} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Form
            </Button>
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
