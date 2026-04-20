"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const DATA = [
  { period: "Q2 '24", detroit: 72, houston: 68, chicago: 81, losangeles: 75 },
  { period: "Q3 '24", detroit: 75, houston: 71, chicago: 79, losangeles: 77 },
  { period: "Q4 '24", detroit: 74, houston: 73, chicago: 83, losangeles: 80 },
  { period: "Q1 '25", detroit: 78, houston: 76, chicago: 85, losangeles: 82 },
  { period: "Q2 '25", detroit: 80, houston: 74, chicago: 84, losangeles: 85 },
  { period: "Q3 '25", detroit: 83, houston: 79, chicago: 87, losangeles: 83 },
  { period: "Q4 '25", detroit: 81, houston: 82, chicago: 88, losangeles: 86 },
]

const COLORS = [
  "oklch(0.52 0.15 240)",
  "oklch(0.65 0.15 150)",
  "oklch(0.60 0.18 30)",
  "oklch(0.55 0.16 290)",
]

export function AuditHistoryChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Audit History</CardTitle>
        <CardDescription>Audit scores by quarter — top 4 sites</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220} debounce={300}>
          <LineChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[60, 95]}
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: "0.5rem", border: "1px solid oklch(0.91 0 0)" }}
              formatter={(value, name) => [`${value}/100`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="detroit"    stroke={COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="houston"    stroke={COLORS[1]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="chicago"    stroke={COLORS[2]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="losangeles" stroke={COLORS[3]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="L.A." />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
