"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { SiteScoreSample } from "@/lib/supabase/queries/reports"

function scoreColor(score: number) {
  if (score >= 80) return "oklch(0.56 0.15 150)"
  if (score >= 60) return "oklch(0.72 0.17 75)"
  return "oklch(0.57 0.20 25)"
}

interface Props {
  sites: SiteScoreSample[]
}

export function SiteComplianceChart({ sites }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Site Compliance Report</CardTitle>
        <CardDescription>Lowest-scoring sites — current compliance score</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220} debounce={300}>
          <BarChart data={sites} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
              width={88}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: "0.5rem", border: "1px solid oklch(0.91 0 0)" }}
              formatter={(value) => [`${value}%`, "Score"]}
            />
            <Bar dataKey="score" radius={[0, 3, 3, 0]}>
              {sites.map((s, i) => (
                <Cell key={i} fill={scoreColor(s.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
