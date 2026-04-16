"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const TREND_DATA = [
  { date: "Mar 18", score: 66 },
  { date: "Mar 21", score: 65 },
  { date: "Mar 24", score: 67 },
  { date: "Mar 27", score: 68 },
  { date: "Mar 30", score: 69 },
  { date: "Apr 2",  score: 68 },
  { date: "Apr 5",  score: 70 },
  { date: "Apr 8",  score: 71 },
  { date: "Apr 11", score: 72 },
  { date: "Apr 14", score: 74 },
  { date: "Apr 17", score: 74 },
]

export function ComplianceTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Compliance Trend</CardTitle>
        <CardDescription>Overall compliance score — last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={TREND_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(0.52 0.15 240)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.52 0.15 240)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              domain={[55, 85]}
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: "0.5rem",
                border: "1px solid oklch(0.91 0 0)",
                boxShadow: "0 1px 4px oklch(0 0 0 / 0.08)",
              }}
              formatter={(value) => [`${value}/100`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="oklch(0.52 0.15 240)"
              strokeWidth={2}
              fill="url(#scoreGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "oklch(0.52 0.15 240)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
