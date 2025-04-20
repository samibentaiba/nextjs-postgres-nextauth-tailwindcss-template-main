"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductForm } from "@/components/dashboard/product-form"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  status: "active" | "inactive" | "archived"
  price: number
  stock: number
  availableAt: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Product not found",
              description: "The product you're trying to edit doesn't exist.",
              variant: "destructive",
            })
            router.push("/dashboard/products")
            return
          }
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Edit Product" description="Loading product data..." />
        <div className="flex items-center justify-center p-8">
          <p>Loading product data...</p>
        </div>
      </DashboardShell>
    )
  }

  if (!product) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Edit Product" description="Product not found" />
        <div className="flex items-center justify-center p-8">
          <p>Product not found.</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Product" description={`Edit details for ${product.name}`} />
      <div className="grid gap-8">
      <ProductForm product={{ ...product, availableAt: new Date(product.availableAt) }} />
      </div>
    </DashboardShell>
  )
}
