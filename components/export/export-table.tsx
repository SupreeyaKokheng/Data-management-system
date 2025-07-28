"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/data-context"
import { formatDate } from "@/lib/utils"

export function ExportTable() {
  const { state } = useData()
  const { processedData, columns } = state

  // Show first 10 rows as preview
  const previewData = processedData.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>ตัวอย่างข้อมูลที่จะส่งออก</CardTitle>
        <p className="text-sm text-gray-600">แสดง 10 รายการแรกจากทั้งหมด {processedData.length} รายการ</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-32">RefCode</TableHead>
                {/* <TableHead className="w-32">วันที่สร้าง</TableHead> */}
                {columns.slice(0, 4).map((column) => (
                  <TableHead key={column} className="whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
                <TableHead className="w-20">สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {row.refCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.created_at ? (
                      <span className="text-sm">{formatDate(new Date(row.created_at))}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  {columns.slice(0, 4).map((column) => (
                    <TableCell key={column} className="truncate max-w-32">
                      {row[column] || "-"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      พร้อมส่งออก
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {processedData.length > 10 && (
          <div className="mt-4 text-center text-sm text-gray-500">และอีก {processedData.length - 10} รายการ...</div>
        )}
      </CardContent>
    </Card>
  )
}
