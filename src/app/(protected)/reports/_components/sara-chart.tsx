"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const DATA = [
  { chemical: "Sulfuric Acid",    reported: 82,  threshold: 100 },
  { chemical: "Ammonia",          reported: 97,  threshold: 100 },
  { chemical: "Chlorine",         reported: 45,  threshold: 100 },
  { chemical: "Hydrochloric Acid",reported: 113, threshold: 100 },
  { chemical: "Toluene",          reported: 61,  threshold: 100 },
  { chemical: "Methanol",         reported: 78,  threshold: 100 },
  { chemical: "Acetone",          reported: 34,  threshold: 100 },
]

export function SaraChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">SARA Threshold Report</CardTitle>
        <CardDescription>Reported quantities vs. 100-lb threshold — current quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220} debounce={300}>
          <BarChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
            <XAxis
              dataKey="chemical"
              tick={{ fontSize: 10, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={48}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.50 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: "0.5rem", border: "1px solid oklch(0.91 0 0)" }}
              formatter={(value) => [`${value} lbs`, "Reported"]}
            />
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Threshold", position: "right", fontSize: 10, fill: "#ef4444" }} />
            <Bar dataKey="reported" fill="oklch(0.52 0.15 240)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
