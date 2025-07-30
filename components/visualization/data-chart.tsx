"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { useData } from "@/contexts/data-context"
import { useState } from "react"

export function DataChart() {
  const { state } = useData()
  const { processedData } = state
  const [chartType, setChartType] = useState("bar")

  // Process data for chart
  const chartData = processedData.reduce(
    (acc, row) => {
      if (row.created_at) {
        const date = new Date(row.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        const monthLabel = date.toLocaleDateString("th-TH", { year: "numeric", month: "short" })

        const existing = acc.find((item) => item.month === monthKey)
        if (existing) {
          existing.count += 1
        } else {
          acc.push({
            month: monthKey,
            monthLabel,
            count: 1,
            date: date.getTime(),
          })
        }
      }
      return acc
    },
    [] as Array<{ month: string; monthLabel: string; count: number; date: number }>,
  )

  // Sort by date
  chartData.sort((a, b) => a.date - b.date)

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </AreaChart>
        )

      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>กราฟสรุปข้อมูลรายเดือน</CardTitle>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "bar" ? "bg-primary  text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            แท่ง
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "line" ? "bg-primary  text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            เส้น
          </button>
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-1 text-sm rounded ${
              chartType === "area" ? "bg-primary  text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            พื้นที่
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {chartData.length === 0 && <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลสำหรับแสดงกราฟ</div>}

        <div className="mt-4 text-sm text-gray-500">
          แสดงข้อมูล {chartData.length} เดือน จากทั้งหมด {processedData.length} รายการ
        </div>
      </CardContent>
    </Card>
  )
}
