"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { formatDate } from "@/lib/utils";
import { formatThaiDate } from "@/lib/utils";

export function RefCodeTable() {
  const { state, dispatch } = useData();
  const { processedData, columns } = state;
  const [editingRefCode, setEditingRefCode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditRefCode = (rowId: string, currentRefCode: string) => {
    setEditingRefCode(rowId);
    setEditValue(currentRefCode);
  };

  const handleSaveRefCode = (rowId: string) => {
    dispatch({
      type: "UPDATE_ROW",
      payload: {
        id: rowId,
        data: { refCode: editValue },
      },
    });
    setEditingRefCode(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingRefCode(null);
    setEditValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลพร้อม RefCode</CardTitle>
        <p className="text-sm text-gray-600">
          รูปแบบ RefCode: YYMMXXX (ปี-เดือน-ลำดับ)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-32">RefCode</TableHead>
                {/* <TableHead className="w-32">วันที่สร้าง</TableHead> */}
                {columns.slice(0, 3).map((column) => (
                  <TableHead key={column} className="whitespace-nowrap">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {editingRefCode === row.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-24"
                          maxLength={7}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveRefCode(row.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono">
                          {row.refCode}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleEditRefCode(row.id, row.refCode || "")
                          }
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  {columns.slice(0, 3).map((column) => (
                    <TableCell key={column} className="truncate max-w-32">
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

        <div className="mt-4 text-sm text-gray-500">
          ทั้งหมด {processedData.length} รายการ
        </div>
      </CardContent>
    </Card>
  );
}
