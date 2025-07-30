"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, Calendar, FileText } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function RefCodeSummary() {
  const { state } = useData()
  const { processedData } = state

  const summary = processedData.reduce(
    (acc, row) => {
      acc.total += 1

      if (row.created_at) {
        const date = new Date(row.created_at)
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
        acc.byMonth[monthKey] = (acc.byMonth[monthKey] || 0) + 1
      }

      return acc
    },
    { total: 0, byMonth: {} as Record<string, number> },
  )

  const monthCount = Object.keys(summary.byMonth).length
  const avgPerMonth = monthCount > 0 ? Math.round(summary.total / monthCount) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RefCode ทั้งหมด</CardTitle>
         
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>

    </div>
  )
}
