"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import { useData } from "@/contexts/data-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataChart() {
  const { state, } = useData();
  const { processedData } = state;

  const [chartType, setChartType] = useState("bar");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

const now = new Date()
let startDate: Date | null = null

switch (dateRangeFilter) {
  case "3months":
    startDate = new Date(now)
    startDate.setDate(1)
    startDate.setMonth(now.getMonth() - 2) // รวมปัจจุบัน = 3 เดือน
    break

  case "6months":
    startDate = new Date(now)
    startDate.setDate(1)
    startDate.setMonth(now.getMonth() - 5) // รวมปัจจุบัน = 6 เดือน
    break

  case "1year":
    startDate = new Date(now)
    startDate.setDate(1)
    startDate.setFullYear(now.getFullYear() - 1)
    break

  default:
    startDate = null
}

  // Filter data by status
  const filteredData = processedData.filter((row) => {
    const status = row.status?.toLowerCase() || null;
    const createdAt = row.created_at ? new Date(row.created_at) : null;

    const statusOk =
      statusFilter === "all"
        ? true
        : statusFilter === "null"
        ? !status
        : status === statusFilter;

    const dateOk = !startDate || (createdAt && createdAt >= startDate);

    return statusOk && dateOk;
  });

  // Group by month
  const chartData = filteredData.reduce((acc, row) => {
    if (row.created_at) {
      const date = new Date(row.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
      });

      const existing = acc.find((item) => item.month === monthKey);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          month: monthKey,
          monthLabel,
          count: 1,
          date: date.getTime(),
        });
      }
    }
    return acc;
  }, [] as Array<{ month: string; monthLabel: string; count: number; date: number }>);

  // Sort by date
  chartData.sort((a, b) => a.date - b.date);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

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
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <CardTitle>กราฟสรุปข้อมูลรายเดือน</CardTitle>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 text-sm rounded ${
                chartType === "bar"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              แท่ง
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 text-sm rounded ${
                chartType === "line"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              เส้น
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1 text-sm rounded ${
                chartType === "area"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              พื้นที่
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">สถานะ</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="เลือกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="null">ไม่มีสถานะ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">ช่วงเวลา</p>
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="เลือกช่วงเวลา" />
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
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {chartData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่มีข้อมูลสำหรับแสดงกราฟ
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          แสดงข้อมูล {chartData.length} เดือน จากทั้งหมด {filteredData.length}{" "}
          รายการ
        </div>
      </CardContent>
    </Card>
  );
}
