"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calendar, Database } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function ChartSummary() {
  const { state } = useData()
  const { processedData } = state

  const summary = processedData.reduce(
    (acc, row) => {
      acc.total += 1

      if (row.created_at) {
        const date = new Date(row.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        acc.byMonth[monthKey] = (acc.byMonth[monthKey] || 0) + 1

        if (!acc.dateRange.start || date < acc.dateRange.start) {
          acc.dateRange.start = date
        }
        if (!acc.dateRange.end || date > acc.dateRange.end) {
          acc.dateRange.end = date
        }
      }

      return acc
    },
    {
      total: 0,
      byMonth: {} as Record<string, number>,
      dateRange: { start: null as Date | null, end: null as Date | null },
    },
  )

  const monthCount = Object.keys(summary.byMonth).length
  const maxMonth = Math.max(...Object.values(summary.byMonth))
  const avgPerMonth = monthCount > 0 ? Math.round(summary.total / monthCount) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ข้อมูลทั้งหมด</CardTitle>
          <Database className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">สูงสุดต่อเดือน</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maxMonth}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">เฉลี่ยต่อเดือน</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgPerMonth}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>
    </div>
  )
}
