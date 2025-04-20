import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductForm } from "@/components/dashboard/product-form"

export default function NewProductPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Product" description="Add a new product to your inventory" />
      <div className="grid gap-8">
        <ProductForm />
      </div>
    </DashboardShell>
  )
}
