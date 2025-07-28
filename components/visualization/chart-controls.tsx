"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, BarChart3 } from "lucide-react"

interface ChartControlsProps {
  onDateRangeChange?: (range: { start: string; end: string }) => void
  onChartTypeChange?: (type: string) => void
}

export function ChartControls({ onDateRangeChange, onChartTypeChange }: ChartControlsProps) {
  const [chartType, setChartType] = useState("bar")
  const [dateRange, setDateRange] = useState("all")

  const handleChartTypeChange = (type: string) => {
    setChartType(type)
    onChartTypeChange?.(type)
  }

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    // Calculate actual date range based on selection
    const now = new Date()
    let start = new Date()

    switch (range) {
      case "3months":
        start.setMonth(now.getMonth() - 3)
        break
      case "6months":
        start.setMonth(now.getMonth() - 6)
        break
      case "1year":
        start.setFullYear(now.getFullYear() - 1)
        break
      default:
        start = new Date(2020, 0, 1) // Far back date for 'all'
    }

    onDateRangeChange?.({
      start: start.toISOString(),
      end: now.toISOString(),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>ตัวเลือกการแสดงผล</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">ประเภทกราฟ</label>
            <Select value={chartType} onValueChange={handleChartTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">กราฟแท่ง</SelectItem>
                <SelectItem value="line">กราฟเส้น</SelectItem>
                <SelectItem value="area">กราฟพื้นที่</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">ช่วงเวลา</label>
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="3months">3 เดือนล่าสุด</SelectItem>
                <SelectItem value="6months">6 เดือนล่าสุด</SelectItem>
                <SelectItem value="1year">1 ปีล่าสุด</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant={chartType === "bar" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleChartTypeChange("bar")}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            แท่ง
          </Badge>
          <Badge
            variant={chartType === "line" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleChartTypeChange("line")}
          >
            <Calendar className="w-3 h-3 mr-1" />
            เส้น
          </Badge>
          <Badge
            variant={chartType === "area" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleChartTypeChange("area")}
          >
            พื้นที่
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
