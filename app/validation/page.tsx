"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { ValidationTable } from "@/components/validation/validation-table";
import { ValidationSummary } from "@/components/validation/validation-summary";
import { ValidationControls } from "@/components/validation/validation-controls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useData } from "@/contexts/data-context";
import type { DataRow } from "@/contexts/data-context";

export default function ValidationPage() {
  const { state, dispatch } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const markSmartDuplicateRows = (rows: DataRow[]) => {
    const statusPriority = {
      active: 3,
      inactive: 2,
      null: 1,
      missing: 0,
    };

    const groupMap = new Map<string, DataRow[]>();

    rows.forEach((row) => {
      const name = row.name?.trim().toLowerCase() || "";
      const email = row.email?.trim().toLowerCase() || "";

      if (!name || !email) return;

      const key = `${name}||${email}`;
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(row);
    });

    const updated: DataRow[] = rows.map((row) => {
      const name = row.name?.trim().toLowerCase() || "";
      const email = row.email?.trim().toLowerCase() || "";
      const key = `${name}||${email}`;
      const group = key ? groupMap.get(key) || [] : [];

      if (!name || !email || group.length <= 1) {
        return {
          ...row,
          issues: {
            ...row.issues,
            missing: row.issues?.missing ?? [],
            null: row.issues?.null ?? [],
            duplicate: false,
            autoRemoveSuggestion: false,
          },
        };
      }

      const bestRow = group.reduce((prev, curr) => {
        const p1 =
          statusPriority[
            String(
              prev.status || ""
            ).toLowerCase() as keyof typeof statusPriority
          ] ?? -1;
        const p2 =
          statusPriority[
            String(
              curr.status || ""
            ).toLowerCase() as keyof typeof statusPriority
          ] ?? -1;
        return p2 > p1 ? curr : prev;
      });

      const shouldRemove = row.id !== bestRow.id;

      return {
        ...row,
        issues: {
          ...row.issues,
          missing: row.issues?.missing ?? [],
          null: row.issues?.null ?? [],
          duplicate: true,
          autoRemoveSuggestion: shouldRemove,
        },
      };
    });

    dispatch({ type: "SET_PROCESSED_DATA", payload: updated });
  };

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 1 });
    router.push("/import");
  };

  const handleNext = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
    router.push("/refcode");
  };

  useEffect(() => {
    if (state.currentStep !== 2) {
      dispatch({ type: "SET_CURRENT_STEP", payload: 2 });
    }
    markSmartDuplicateRows(state.processedData); // ส่ง state ล่าสุดเข้าไป
  }, [state.currentStep, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={state.currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ตรวจสอบและเตรียมข้อมูล
            </h2>
            <p className="text-gray-600">ตรวจสอบข้อมูลและแก้ไขปัญหาที่พบ</p>
          </div>

          <ValidationSummary />
          <ValidationControls
            onSearch={setSearchQuery}
            onFilter={setFilterType}
          />

          <ValidationTable
            searchQuery={searchQuery}
            filterType={filterType}
            markSmartDuplicateRows={markSmartDuplicateRows}
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              ดำเนินการต่อ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
