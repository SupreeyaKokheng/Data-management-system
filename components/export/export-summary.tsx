"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, CheckCircle, Hash } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function ExportSummary() {
  const { state } = useData()
  const { processedData, fileName } = state

  const summary = processedData.reduce(
    (acc, row) => {
      acc.total += 1
      acc.withRefCode += row.refCode ? 1 : 0

      const hasIssues = row.issues?.missing.length || row.issues?.null.length || row.issues?.duplicate
      acc.processed += hasIssues ? 1 : 0

      return acc
    },
    { total: 0, withRefCode: 0, processed: 0 },
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ข้อมูลทั้งหมด</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ไฟล์ต้นฉบับ</CardTitle>
          <Download className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold truncate">{fileName || "ไม่ระบุ"}</div>
          <p className="text-xs text-muted-foreground">ชื่อไฟล์</p>
        </CardContent>
      </Card>
    </div>
  )
}
