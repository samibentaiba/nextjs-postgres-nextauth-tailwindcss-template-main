"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    products: 12,
    blogs: 5,
  },
  {
    name: "Feb",
    products: 15,
    blogs: 6,
  },
  {
    name: "Mar",
    products: 18,
    blogs: 7,
  },
  {
    name: "Apr",
    products: 20,
    blogs: 8,
  },
  {
    name: "May",
    products: 22,
    blogs: 9,
  },
  {
    name: "Jun",
    products: 25,
    blogs: 10,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="products" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="blogs" fill="#009688" radius={[4, 4, 0, 0]} className="fill-muted" />
      </BarChart>
    </ResponsiveContainer>
  )
}
