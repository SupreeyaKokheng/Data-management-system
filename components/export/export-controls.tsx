"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

export function ExportControls() {
  const { state } = useData()
  const { processedData, columns } = state
  const [exportFormat, setExportFormat] = useState("xlsx")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (processedData.length === 0) {
      toast({
        title: "ไม่มีข้อมูลสำหรับส่งออก",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Prepare data for export (exclude internal fields)
      const exportData = processedData.map((row) => {
        const cleanRow: any = {}

        // Add RefCode first
        if (row.refCode) {
          cleanRow["RefCode"] = row.refCode
        }

        // Add original columns
        columns.forEach((col) => {
          cleanRow[col] = row[col] || ""
        })

        // Add created date if exists
        if (row.created_at) {
          cleanRow["วันที่สร้าง"] = new Date(row.created_at).toLocaleDateString("th-TH")
        }

        return cleanRow
      })

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `exported-data-${timestamp}`

      if (exportFormat === "csv") {
        exportToCSV(exportData, `${filename}.csv`)
      } else {
        // Export to Excel
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data")
        XLSX.writeFile(wb, `${filename}.xlsx`)
      }

      toast({
        title: "ส่งออกข้อมูลสำเร็จ",
        description: `ดาวน์โหลดไฟล์ ${filename}.${exportFormat} เรียบร้อยแล้ว`,
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกข้อมูลได้",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>ส่งออกข้อมูล</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">รูปแบบไฟล์</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel (.xlsx)</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>CSV (.csv)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting || processedData.length === 0}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "กำลังส่งออก..." : "ดาวน์โหลด"}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">ข้อมูลที่จะส่งออก:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• RefCode (รหัสอ้างอิง)</li>
            <li>• ข้อมูลต้นฉบับทั้งหมด ({columns.length} คอลัมน์)</li>
            <li>• วันที่สร้าง</li>
            <li>• ข้อมูลที่ผ่านการตรวจสอบและแก้ไขแล้ว</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
