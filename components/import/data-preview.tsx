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
import { useData } from "@/contexts/data-context";
import { Badge } from "@/components/ui/badge";
import { formatThaiDate } from "@/lib/utils";
export function DataPreview() {
  const { state } = useData();
  const { rawData, columns } = state;

  if (rawData.length === 0) {
    return null;
  }

  const previewData = rawData.slice(0, 5);
  const totalIssues = rawData.reduce(
    (acc, row) => {
      acc.missing += row.issues?.missing.length || 0;
      acc.null += row.issues?.null.length || 0;
      acc.duplicate += row.issues?.duplicate ? 1 : 0;
      return acc;
    },
    { missing: 0, null: 0, duplicate: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>ตัวอย่างข้อมูล</span>
          <div className="flex space-x-2">
            <Badge variant="secondary">ทั้งหมด {rawData.length} รายการ</Badge>
            {totalIssues.missing > 0 && (
              <Badge variant="destructive">
                Missing: {totalIssues.missing}
              </Badge>
            )}
            {totalIssues.null > 0 && (
              <Badge className="bg-yellow-500">Null: {totalIssues.null}</Badge>
            )}
            {totalIssues.duplicate > 0 && (
              <Badge className="bg-blue-500">
                Duplicate: {totalIssues.duplicate}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column} className="whitespace-nowrap">
                      {/* {row[column] || "-"} */}
                      {column.toLowerCase().includes("date") ||
                      column.toLowerCase().includes("created")
                        ? formatThaiDate(row[column])
                        : row[column] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rawData.length > 5 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            แสดง 5 รายการแรกจากทั้งหมด {rawData.length} รายการ
          </p>
        )}
      </CardContent>
    </Card>
  );
}
