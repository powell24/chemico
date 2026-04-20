"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const DATA = [
  { month: "Oct",  automotive: 420, aerospace: 180, industrial: 310 },
  { month: "Nov",  automotive: 390, aerospace: 210, industrial: 290 },
  { month: "Dec",  automotive: 460, aerospace: 195, industrial: 340 },
  { month: "Jan",  automotive: 510, aerospace: 220, industrial: 370 },
  { month: "Feb",  automotive: 475, aerospace: 200, industrial: 355 },
  { month: "Mar",  automotive: 495, aerospace: 185, industrial: 360 },
  { month: "Apr",  automotive: 520, aerospace: 230, industrial: 380 },
]

export function VocChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">VOC Emissions Report</CardTitle>
        <CardDescription>Monthly VOC output by industry segment — lbs/month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220} debounce={300}>
          <BarChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: "0.5rem", border: "1px solid oklch(0.91 0 0)" }}
              formatter={(value, name) => [`${value} lbs`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Bar dataKey="automotive" stackId="a" fill="oklch(0.52 0.15 240)"  radius={[0, 0, 0, 0]} />
            <Bar dataKey="aerospace"  stackId="a" fill="oklch(0.65 0.12 200)"  radius={[0, 0, 0, 0]} />
            <Bar dataKey="industrial" stackId="a" fill="oklch(0.75 0.10 180)"  radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
