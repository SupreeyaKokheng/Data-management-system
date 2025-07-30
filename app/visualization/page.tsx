"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { StepIndicator } from "@/components/layout/step-indicator"
import { DataChart } from "@/components/visualization/data-chart"
import { ChartSummary } from "@/components/visualization/chart-summary"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { useEffect } from "react"

export default function VisualizationPage() {
  const { state, dispatch } = useData()
  const router = useRouter()

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 })
    router.push("/refcode")
  }

  const handleNext = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 5 })
    router.push("/export")
  }

useEffect(() => {
  if (state.currentStep !== 4) {
    dispatch({ type: "SET_CURRENT_STEP", payload: 4 });
  }
}, [state.currentStep, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={state.currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">แสดงผลข้อมูลเป็นกราฟ</h2>
            <p className="text-gray-600">วิเคราะห์และแสดงข้อมูลในรูปแบบกราฟสรุปรายเดือน</p>
          </div>

          <ChartSummary />
          <DataChart />

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:opacity-90">
              ดำเนินการต่อ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
