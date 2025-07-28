"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { useData } from "@/contexts/data-context";
import { generateId } from "@/lib/utils";

interface FileUploadProps {
  onFileProcessed: () => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state, dispatch } = useData();
  const { toast } = useToast();

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);

      try {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        let data: any[] = [];

        if (fileExtension === "csv") {
          const text = await file.text();
          const result = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
          });
          data = result.data;
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // data = XLSX.utils.sheet_to_json(worksheet);
          data = XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // ✅ ให้แสดงแบบที่ Excel render
            defval: "", // ✅ ป้องกัน undefined
          });
        } else {
          throw new Error("รองรับเฉพาะไฟล์ .xlsx, .xls, .csv เท่านั้น");
        }

        if (data.length === 0) {
          throw new Error("ไม่พบข้อมูลในไฟล์");
        }

        // Add unique ID to each row and detect issues
        const processedData = data.map((row, index) => {
          const rowWithId = { ...row, id: generateId() };
          const issues = {
            missing: [] as string[],
            null: [] as string[],
            duplicate: false,
          };

          // Check for missing and null values
          Object.keys(row).forEach((key) => {
            if (row[key] === "" || row[key] === undefined) {
              issues.missing.push(key);
            } else if (row[key] === null) {
              issues.null.push(key);
            }
          });

          return { ...rowWithId, issues };
        });

        // Check for duplicates
        const duplicateMap = new Map();
        processedData.forEach((row, index) => {
          const key = JSON.stringify(
            Object.fromEntries(
              Object.entries(row).filter(([k]) => k !== "id" && k !== "issues")
            )
          );
          if (duplicateMap.has(key)) {
            duplicateMap.get(key).forEach((dupIndex: number) => {
              processedData[dupIndex].issues.duplicate = true;
            });
            processedData[index].issues.duplicate = true;
            duplicateMap.get(key).push(index);
          } else {
            duplicateMap.set(key, [index]);
          }
        });

        const columns = Object.keys(data[0]).filter(
          (key) => key !== "id" && key !== "issues"
        );

        dispatch({
          type: "SET_RAW_DATA",
          payload: {
            data: processedData,
            columns,
            fileName: file.name,
          },
        });

        localStorage.setItem(
          // "uploadedData",
          "dataManagementState",
          // JSON.stringify({ data: processedData, columns, fileName: file.name })
          JSON.stringify({
            rawData: processedData,
            processedData: processedData,
            columns,
            fileName: file.name,
            currentStep: state.currentStep,
            validationSettings: {},
          })
        );

        toast({
          title: "นำเข้าข้อมูลสำเร็จ",
          description: `นำเข้าข้อมูล ${data.length} รายการจากไฟล์ ${file.name}`,
        });

        onFileProcessed();
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description:
            error instanceof Error ? error.message : "ไม่สามารถประมวลผลไฟล์ได้",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [dispatch, toast, onFileProcessed]
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleProcess = () => {
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? "วางไฟล์ที่นี่..." : "ลากไฟล์มาวางที่นี่"}
            </p>
            <p className="text-sm text-gray-500 mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-gray-400">
              รองรับไฟล์ .xlsx, .xls, .csv (ขนาดไม่เกิน 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadedFile && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex space-x-3">
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {isProcessing ? "กำลังประมวลผล..." : "ประมวลผลไฟล์"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
