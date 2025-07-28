"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { StepIndicator } from "@/components/layout/step-indicator"
import { ExportTable } from "@/components/export/export-table"
import { ExportSummary } from "@/components/export/export-summary"
import { ExportControls } from "@/components/export/export-controls"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function ExportPage() {
  const { state, dispatch } = useData()
  const router = useRouter()

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 4 })
    router.push("/visualization")
  }

  const handleFinish = () => {
    // Reset data and go back to start
    dispatch({ type: "RESET_DATA" })
    router.push("/import")
  }

  // if (state.processedData.length === 0) {
  //   router.push("/import")
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={state.currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ส่งออกข้อมูล</h2>
            <p className="text-gray-600">ดาวน์โหลดข้อมูลที่ผ่านการตรวจสอบและเพิ่ม RefCode แล้ว</p>
          </div>

          <ExportSummary />
          <ExportControls />
          <ExportTable />

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              เสร็จสิ้น
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
