// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertTriangle, XCircle, Copy } from "lucide-react"
// import { useData } from "@/contexts/data-context"

// export function ValidationSummary() {
//   const { state } = useData()
//   const { processedData } = state

//   const summary = processedData.reduce(
//     (acc, row) => {
//       acc.total += 1
//       acc.missing += row.issues?.missing.length || 0
//       acc.null += row.issues?.null.length || 0
//       acc.duplicate += row.issues?.duplicate ? 1 : 0

//       if (row.issues?.missing.length || row.issues?.null.length || row.issues?.duplicate) {
//         acc.withIssues += 1
//       }

//       return acc
//     },
//     { total: 0, missing: 0, null: 0, duplicate: 0, withIssues: 0 },
//   )

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">ข้อมูลทั้งหมด</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{summary.total}</div>
//           <p className="text-xs text-muted-foreground">รายการ</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Missing Values</CardTitle>
//           <XCircle className="h-4 w-4 text-red-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-red-600">{summary.missing}</div>
//           <p className="text-xs text-muted-foreground">ค่าที่หายไป</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Null Values</CardTitle>
//           <AlertTriangle className="h-4 w-4 text-yellow-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-yellow-600">{summary.null}</div>
//           <p className="text-xs text-muted-foreground">ค่า null</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Duplicates</CardTitle>
//           <Copy className="h-4 w-4 text-blue-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-blue-600">{summary.duplicate}</div>
//           <p className="text-xs text-muted-foreground">ข้อมูลซ้ำ</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, XCircle, Copy, Info } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { useMemo } from "react"

export function ValidationSummary() {
  const { state } = useData()
  const { processedData, columns } = state

  // ฟังก์ชันตรวจสอบข้อมูลเหมือนกับใน ValidationTable
  const validateData = (data: any[]) => {
    return data.map(row => {
      const issues = { missing: [] as string[], null: [] as string[], duplicate: row.issues?.duplicate || false };
      
      // ตรวจสอบทุก column
      columns.forEach(column => {
        // ถ้าไม่มีข้อมูลหรือเป็นสตริงว่าง = missing value
        if (row[column] === undefined || row[column] === null || row[column] === "") {
          issues.missing.push(column);
        } 
        // ถ้ามีค่าเป็นสตริง "null" = null value
        else if (String(row[column]).toLowerCase() === "null") {
          issues.null.push(column);
        }
      });
      
      return { ...row, issues };
    });
  };
  
  // ตรวจสอบข้อมูลก่อนสรุป
  const validatedData = useMemo(() => {
    return validateData(processedData);
  }, [processedData, columns]);

  // คำนวณสรุปจากข้อมูลที่ตรวจสอบแล้ว
  const summary = useMemo(() => {
    return validatedData.reduce(
      (acc, row) => {
        acc.total += 1;
        
        // ตรวจสอบว่า issues.missing เป็นอาเรย์และมีความยาวมากกว่า 0
        if (Array.isArray(row.issues?.missing) && row.issues.missing.length > 0) {
          acc.missing += row.issues.missing.length;
          acc.rowsWithMissing += 1;
        }
        
        // ตรวจสอบว่า issues.null เป็นอาเรย์และมีความยาวมากกว่า 0
        if (Array.isArray(row.issues?.null) && row.issues.null.length > 0) {
          acc.null += row.issues.null.length;
          acc.rowsWithNull += 1;
        }
        
        // เช็คว่ามี duplicate หรือไม่
        if (row.issues?.duplicate) {
          acc.duplicate += 1;
        }

        // เช็คว่ามีปัญหาใดๆ หรือไม่
        if (
          (Array.isArray(row.issues?.missing) && row.issues.missing.length > 0) ||
          (Array.isArray(row.issues?.null) && row.issues.null.length > 0) ||
          row.issues?.duplicate
        ) {
          acc.withIssues += 1;
        }

        return acc;
      },
      { 
        total: 0, 
        missing: 0, 
        null: 0, 
        duplicate: 0, 
        withIssues: 0,
        rowsWithMissing: 0,
        rowsWithNull: 0
      }
    );
  }, [validatedData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ข้อมูลทั้งหมด</CardTitle>
          <Info className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total}</div>
          <p className="text-xs text-muted-foreground">รายการ</p>
          <p className="text-xs text-muted-foreground mt-2">มีปัญหา {summary.withIssues} รายการ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missing Values</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{summary.missing}</div>
          <p className="text-xs text-muted-foreground">ค่าที่หายไป</p>
          <p className="text-xs text-muted-foreground mt-2">พบใน {summary.rowsWithMissing} แถว</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Null Values</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{summary.null}</div>
          <p className="text-xs text-muted-foreground">ค่า null</p>
          <p className="text-xs text-muted-foreground mt-2">พบใน {summary.rowsWithNull} แถว</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duplicates</CardTitle>
          <Copy className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{summary.duplicate}</div>
          <p className="text-xs text-muted-foreground">ข้อมูลซ้ำ</p>
        </CardContent>
      </Card>
    </div>
  )
}