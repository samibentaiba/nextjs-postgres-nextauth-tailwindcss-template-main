'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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

interface Blog {
  id: number;
  title: string;
  content: string;
  status: 'active' | 'inactive' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        setError('Error fetching blogs.');
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  async function deleteBlog(id: number) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete blog');

      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  return (
    <Card>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading blogs...</div>
        ) : error ? (
          <div className="flex justify-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="relative">
            {/* Sticky Header */}
            <div className="flex flex-col justify-center items-center">
              <Table className="bg-transparent">
                <TableHeader className="sticky top-0 z-10 shadow-sm bg-background">
                  <TableRow>
                    <TableHead className="w-[28%]">Title</TableHead>
                    <TableHead className="w-[15%]">
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[24%]">Published</TableHead>
                    <TableHead className="w-[20%]">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Table Body */}
            <ScrollArea className="h-[30rem]">
              <Table>
                <TableBody>
                  {blogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No blogs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">{blog.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              blog.status === 'active'
                                ? 'default'
                                : blog.status === 'inactive'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(blog.publishedAt), {
                            addSuffix: true
                          })}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(blog.updatedAt), {
                            addSuffix: true
                          })}
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
                                <Link href={`/dashboard/blogs/${blog.id}`}>
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteBlog(blog.id)}
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
