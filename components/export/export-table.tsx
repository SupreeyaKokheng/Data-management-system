"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/data-context";
import { formatDate } from "@/lib/utils";

export function ExportTable() {
  const { state } = useData();
  const { processedData, columns } = state;

  // Show first 10 rows as preview
  const previewData = processedData.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ตัวอย่างข้อมูลที่จะส่งออก</CardTitle>
        <p className="text-sm text-gray-600">
          แสดง 10 รายการแรกจากทั้งหมด {processedData.length} รายการ
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>RefCode</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>สถานะ</TableHead>
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
                   <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.email || "-"}</TableCell>
                  <TableCell>
                    {row.created_at ? (
                      <span className="text-sm">
                        {new Date(row.created_at).toLocaleDateString("en-CA")}{" "}
                        {/* 👉 yyyy-mm-dd */}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{row.status || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {processedData.length > 10 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            และอีก {processedData.length - 10} รายการ...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
