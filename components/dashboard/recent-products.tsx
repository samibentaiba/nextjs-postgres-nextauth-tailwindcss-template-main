'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import ClientTime from './client-time';
import { ScrollArea } from '../ui/scroll-area';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'archived';
  price: string;
  stock: number;
  availableAt: string;
}

export function RecentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError('Error fetching products.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  async function deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <Card>
      <CardContent className=' '>
        {loading ? (
          <div className="flex justify-center py-8">Loading products...</div>
        ) : error ? (
          <div className="flex justify-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="relative ">
            {/* Sticky header */}
            <div className="flex flex-col justify-center items-center  ">
              <Table className="bg-transparent">
                <TableHeader className="sticky top-0 z-10 shadow-sm">
                  <TableRow className="">
                    <TableHead  className="p-0  w-[23%]">
                      <span>Name</span>
                    </TableHead>
                    <TableHead className='p-0 w-[17%]'>
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className='p-0 w-[14%]'>
                      <div className="flex items-center space-x-1">
                        <span>Price</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className='p-0  w-[10%]'>
                      <div className="flex items-center space-x-1">
                        <span>Stock</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className='p-0 w-[1%]'>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              </div>

            {/* Scrollable body */}
            <ScrollArea className="h-[30rem]">
              <Table>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === 'active'
                                ? 'default'
                                : product.status === 'inactive'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ${parseFloat(product.price).toFixed(2)}
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <ClientTime date={product.availableAt} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/products/${product.id}`}
                                >
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteProduct(product.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
