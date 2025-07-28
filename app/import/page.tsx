"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { StepIndicator } from "@/components/layout/step-indicator"
import { FileUpload } from "@/components/import/file-upload"
import { DataPreview } from "@/components/import/data-preview"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function ImportPage() {
  const [hasData, setHasData] = useState(false)
  const { state, dispatch } = useData()
  const router = useRouter()

  const handleFileProcessed = () => {
    setHasData(true)
  }

  const handleNext = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 2 })
    router.push("/validation")
  }

useEffect(() => {
  const stored = localStorage.getItem("uploadedData")
  if (stored) {
    const parsed = JSON.parse(stored)
    dispatch({
      type: "SET_RAW_DATA",
      payload: parsed,
    })
    setHasData(true)
  }
}, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={state.currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">นำเข้าข้อมูล</h2>
            <p className="text-gray-600">อัปโหลดไฟล์ข้อมูลของคุณ (รองรับ .xlsx, .xls, .csv)</p>
          </div>

          <FileUpload onFileProcessed={handleFileProcessed} />

          {(hasData || state.rawData.length > 0) && (
            <>
              <DataPreview />

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:opacity-90">
                  ดำเนินการต่อ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
