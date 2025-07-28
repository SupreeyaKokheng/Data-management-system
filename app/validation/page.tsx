"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StepIndicator } from "@/components/layout/step-indicator";
import { ValidationTable } from "@/components/validation/validation-table";
import { ValidationSummary } from "@/components/validation/validation-summary";
import { ValidationControls } from "@/components/validation/validation-controls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useData } from "@/contexts/data-context";
import { useState } from "react";

export default function ValidationPage() {
  const { state, dispatch } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 1 });
    router.push("/import");
  };

  const handleNext = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
    router.push("/refcode");
  };

  // if (state.rawData.length === 0) {
  //   router.push("/import");
  //   return null;
  // }

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

          <ValidationTable searchQuery={searchQuery} filterType={filterType} />

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
