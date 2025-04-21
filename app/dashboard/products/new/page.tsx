import { DashboardHeader } from "@/components/dashboard/main/dashboard-header"
import { DashboardShell } from "@/components/dashboard/main/dashboard-shell"
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
