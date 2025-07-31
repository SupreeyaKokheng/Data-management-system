"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, RotateCcw, Eraser } from "lucide-react";
import { DataRow, useData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";
import { formatThaiDate } from "@/lib/utils";

// export function ValidationTable() {
interface ValidationTableProps {
  searchQuery: string;
  filterType: string;
  markSmartDuplicateRows: (rows: DataRow[]) => void;
}
export function ValidationTable({
  searchQuery,
  filterType,
  markSmartDuplicateRows,
}: ValidationTableProps) {
  const { state, dispatch } = useData();
  const { processedData, columns } = state;
  const visibleColumns = columns.filter((col) => col !== "id");
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    column: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const isMissingValue = (val: any) => {
    const norm = String(val).trim().toLowerCase();
    return (
      norm === "" ||
      norm === "-" ||
      norm === "-," ||
      norm === "- ," ||
      /^-+$/.test(norm) || // เช่น "--", "---"
      /^-+[,\s]*$/.test(norm) // เช่น "-,", "--, ", "-   ,"
    );
  };

  const validateData = (data: any[]) => {
    return data.map((row) => {
      const issues = {
        missing: [] as string[],
        null: [] as string[],
        duplicate: row.issues?.duplicate || false,
        autoRemoveSuggestion: row.issues?.autoRemoveSuggestion || false,
      };

      columns.forEach((column) => {
        const value = row[column];
        if (value === undefined || value === null || isMissingValue(value)) {
          issues.missing.push(column);
        } else if (String(value).toLowerCase() === "null") {
          issues.null.push(column);
        }
      });

      return { ...row, issues };
    });
  };

  const handleManualDelete = (row: DataRow) => {
    const newRows = state.processedData.filter((r) => r.id !== row.id);
    dispatch({ type: "DELETE_ROW", payload: row.id });

    setTimeout(() => {
      markSmartDuplicateRows(newRows);
    }, 0);
  };

  const canDeleteRow = (row: any) => {
    const hasMissing = row.issues?.missing?.length > 0;
    const isDuplicate = row.issues?.duplicate === true;
    return hasMissing || isDuplicate;
  };

  const validatedData = useMemo(() => {
    return validateData(processedData);
  }, [processedData, columns]);

  // ✅ ค่อย filter จาก validatedData
  const filteredData = useMemo(() => {
    let filtered = validatedData;

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) =>
          String(row[col] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    switch (filterType) {
      case "issues":
        return filtered.filter(
          (row) =>
            row.issues?.missing?.length > 0 ||
            row.issues?.null?.length > 0 ||
            row.issues?.duplicate
        );
      case "duplicate":
        return filtered
          .filter((row) => row.issues?.duplicate)
          .sort((a, b) => {
            const nameA = (a.name || "").toLowerCase();
            const nameB = (b.name || "").toLowerCase();
            const emailA = (a.email || "").toLowerCase();
            const emailB = (b.email || "").toLowerCase();

            if (nameA === nameB) {
              return emailA.localeCompare(emailB);
            }
            return nameA.localeCompare(nameB);
          });
      case "missing":
        return filtered.filter((row) => row.issues?.missing?.length > 0);
      case "null":
        return filtered.filter((row) => row.issues?.null?.length > 0);
      // case "duplicate":
      //   return filtered.filter((row) => row.issues?.duplicate);
      case "clean":
        return filtered.filter(
          (row) =>
            !row.issues?.missing?.length &&
            !row.issues?.null?.length &&
            !row.issues?.duplicate
        );
      default:
        return filtered;
    }
  }, [validatedData, columns, searchQuery, filterType]);

  // อัปเดตข้อมูลที่ปรับแก้แล้วกลับไปที่ state หลัก
  useEffect(() => {
    if (filteredData.length > 0) {
      const updatedData = validateData(filteredData);
      // dispatch({ type: "UPDATE_VALIDATED_DATA", payload: updatedData });
    }
  }, [filteredData]);

  const normalize = (val: any) =>
    String(val).trim().replace(/,+$/g, "").replace(/^-+$/, "-").toLowerCase();

  const isEditable = (row: any, column: string) => {
    const value = row[column];
    const norm = normalize(value);

    const isMissingOrNull =
      value === undefined ||
      value === null ||
      ["", "-", "-,", "null"].includes(norm);

    const wasOriginallyMissingOrNull =
      row.issues?.missing?.includes(column) ||
      row.issues?.null?.includes(column);

    return wasOriginallyMissingOrNull && isMissingOrNull;
  };

  const handleCellEdit = (rowId: string, column: string, currentValue: any) => {
    const row = validatedData.find((r) => r.id === rowId);
    if (row && isEditable(row, column)) {
      setEditingCell({ rowId, column });
      setEditValue(String(currentValue || ""));
    }
  };

  // const handleCellEdit = (rowId: string, column: string, currentValue: any) => {
  //   setEditingCell({ rowId, column });
  //   setEditValue(String(currentValue || ""));
  // };

  const handleSaveEdit = () => {
    if (editingCell) {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          id: editingCell.rowId,
          data: { [editingCell.column]: editValue },
        },
      });
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // const handleDeleteRow = (rowId: string) => {
  //   dispatch({ type: "DELETE_ROW", payload: rowId });
  // };
  const handleDeleteGroup = (targetRow: any) => {
    const name = targetRow.name?.trim().toLowerCase() || "";
    const email = targetRow.email?.trim().toLowerCase() || "";
    const key = `${name}||${email}`;

    const group = processedData.filter((row) => {
      const rowKey = `${(row.name || "").trim().toLowerCase()}||${(
        row.email || ""
      )
        .trim()
        .toLowerCase()}`;
      return rowKey === key;
    });

    if (group.length <= 1) return;

    // const bestRow = group.reduce((prev, curr) => {
    const getPriority = (status: string) => {
      const p: Record<string, number> = {
        active: 3,
        inactive: 2,
        null: 1,
        missing: 0,
      };
      return p[status?.toLowerCase()] ?? -1;
    };
    //   return getPriority(curr.status) > getPriority(prev.status) ? curr : prev;
    //  });

    const maxPriority = Math.max(
      ...group.map((row) => getPriority(row.status))
    );
    const bestRows = group.filter(
      (row) => getPriority(row.status) === maxPriority
    );

    let keepRow: DataRow;

    if (bestRows.length === 1) {
      keepRow = bestRows[0];
    } else {
      // มีหลายตัวที่ดีที่สุด
      if (bestRows.some((r) => r.id !== targetRow.id)) {
        // ถ้า targetRow ไม่ใช่ best → เก็บ best ตัวอื่น
        keepRow = bestRows.find((r) => r.id !== targetRow.id)!;
      } else {
        // ถ้า targetRow คือหนึ่งใน best → เก็บ best ตัวอื่นที่ id ไม่ซ้ำ
        keepRow = bestRows.find((r) => r.id !== targetRow.id) || bestRows[0];
      }
    }

    const idsToDelete = group
      .filter((row) => row.id !== keepRow.id)
      .map((row) => row.id);

    // ✅ ลบทั้งหมดที่ไม่ใช่แถวดีที่สุด
    idsToDelete.forEach((id) => {
      dispatch({ type: "DELETE_ROW", payload: id });
    });

    setTimeout(() => {
      const newRows = state.processedData.filter(
        (r) => !idsToDelete.includes(r.id)
      );
      markSmartDuplicateRows(newRows);
    }, 0);
  };

  const handleReplaceWithRandom = (rowId: string, column: string) => {
    // Find a random non-empty value from the same column
    const validValues = processedData
      .map((row) => row[column])
      .filter(
        (val) =>
          val !== null &&
          val !== undefined &&
          val !== "" &&
          String(val).toLowerCase() !== "null"
      );

    if (validValues.length > 0) {
      const randomValue =
        validValues[Math.floor(Math.random() * validValues.length)];
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          id: rowId,
          data: { [column]: randomValue },
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลที่ต้องตรวจสอบ</CardTitle>
        {/* <div className="flex flex-col sm:flex-row gap-4">
        </div> */}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded mr-2 bg-red-50 border border-red-200"></span>
            <span className="text-sm text-gray-700">
              แถวที่มีข้อมูลขาดหาย (Missing)
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded mr-2 bg-yellow-50 border border-yellow-200"></span>
            <span className="text-sm text-gray-700">แถวที่มีค่า NULL</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded mr-2 bg-blue-50 border border-blue-200"></span>
            <span className="text-sm text-gray-700">
              แถวที่มีข้อมูลซ้ำ (Duplicate)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>{" "}
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className="whitespace-nowrap min-w-32"
                  >
                    {column}
                  </TableHead>
                ))}
                <TableHead className="w-20">สถานะ</TableHead>
                <TableHead className="w-32">การจัดการ</TableHead>
                <TableHead className="w-32">ลบอัตโนมัติ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={
                    // ตรวจสอบ Missing Value แล้วทำให้แถวเป็นสีแดงทั้งแถว
                    row.issues?.missing &&
                    Array.isArray(row.issues.missing) &&
                    row.issues.missing.length > 0
                      ? "bg-red-50"
                      : // ตรวจสอบ Null Value แล้วทำให้แถวเป็นสีเหลืองทั้งแถว
                      row.issues?.null &&
                        Array.isArray(row.issues.null) &&
                        row.issues.null.length > 0
                      ? "bg-yellow-50"
                      : // ตรวจสอบ Duplicate แล้วทำให้แถวเป็นสีน้ำเงินทั้งแถว
                      row.issues?.duplicate === true
                      ? "bg-blue-50"
                      : ""
                  }
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column} className="relative">
                      {editingCell?.rowId === row.id &&
                      editingCell?.column === column ? (
                        <div className="flex space-x-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <Button size="sm" onClick={handleSaveEdit}>
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <span className="truncate">
                            {column.toLowerCase().includes("date") ||
                            column.toLowerCase().includes("created") ? (
                              formatThaiDate(row[column])
                            ) : row[column] !== undefined &&
                              row[column] !== "" ? (
                              String(row[column])
                            ) : (
                              <span className="text-gray-400 italic">
                                {row.issues?.missing?.includes(column)
                                  ? "Missing"
                                  : row.issues?.null?.includes(column)
                                  ? "Null"
                                  : "-"}
                              </span>
                            )}
                          </span>

                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                            {isEditable(row, column) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleCellEdit(row.id, column, row[column])
                                }
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            {/* {(row.issues?.missing?.includes(column) ||
                              row.issues?.null?.includes(column)) && ( */}

                            {isEditable(row, column) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleReplaceWithRandom(row.id, column)
                                }
                                title="แทนค่าด้วยข้อมูลสุ่ม"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.issues?.missing && row.issues.missing.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          M:{row.issues.missing.length}
                        </Badge>
                      )}
                      {row.issues?.null && row.issues.null.length > 0 && (
                        <Badge className="bg-yellow-500 text-xs">
                          N:{row.issues.null.length}
                        </Badge>
                      )}
                      {row.issues?.duplicate && (
                        <Badge className="bg-blue-500 text-xs">DUP</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="h-10 align-middle">
                    {/* {canDeleteRow(row) ? ( */}

                    {/* {row.issues?.duplicate && ( */}
                    {canDeleteRow(row) && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-primary text-primary-foreground hover:opacity-90"
                        onClick={() => handleManualDelete(row)}
                        title="เลือกลบเอง"
                      >
                        <Eraser className="h-3 w-3" />
                      </Button>
                      // ) : (
                      //   //  )}
                      //   <div className="h-8" /> // ให้สูงเท่าปุ่มถังขยะ
                    )}
                  </TableCell>

                  <TableCell className="h-10 align-middle">
                    {row.issues?.autoRemoveSuggestion === true && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGroup(row)}
                        title="ลบทุกแถวซ้ำ ยกเว้นแถวที่ดีที่สุด"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      // ) : (
                      //   <div className="h-8" />
                    )}

                    {!row.issues?.duplicate && !canDeleteRow(row) && (
                      <div className="h-8" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {validatedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่พบข้อมูลที่ตรงกับเงื่อนไข
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          แสดง {validatedData.length} รายการจากทั้งหมด {processedData.length}{" "}
          รายการ
        </div>
      </CardContent>
    </Card>
  );
}
