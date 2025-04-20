"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentProducts } from "@/components/dashboard/recent-products"

export default function ProductsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Products" description="Manage your product inventory and details.">
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </DashboardHeader>
      <RecentProducts />
    </DashboardShell>
  )
}
