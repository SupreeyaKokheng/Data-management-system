"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { StepIndicator } from "@/components/layout/step-indicator"
import { RefCodeTable } from "@/components/refcode/refcode-table"
import { RefCodeSummary } from "@/components/refcode/refcode-summary"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { generateRefCode } from "@/lib/utils"

export default function RefCodePage() {
  const { state, dispatch } = useData()
  const router = useRouter()

  useEffect(() => {
  // if (state.processedData.length === 0) {
  //   router.push("/import")
  //   return
  // }

  const monthGroups: Record<string, number> = {}

  const dataWithRefCodes = state.processedData.map((row) => {
    if (!row.refCode && row.created_at) {
      const date = new Date(row.created_at)

      const year = date.getFullYear() + 543
      const YY = String(year).slice(-2)
      const MM = String(date.getMonth() + 1).padStart(2, "0")
      const key = `${YY}${MM}`

      monthGroups[key] = (monthGroups[key] || 0) + 1
      const order = monthGroups[key]

      const refCode = `${YY}${MM}${String(order).padStart(3, "0")}`

      return { ...row, refCode }
    }
    return row
  })

  if (JSON.stringify(dataWithRefCodes) !== JSON.stringify(state.processedData)) {
    dispatch({ type: "SET_PROCESSED_DATA", payload: dataWithRefCodes })
  }
}, [state.processedData, dispatch, router])

  // useEffect(() => {
  //   if (state.processedData.length === 0) {
  //     router.push("/import")
  //     return
  //   }

  //   // Generate RefCodes for data that doesn't have them
  //   const dataWithRefCodes = state.processedData.map((row, index) => {
  //     // if (!row.refCode) {
  //      if (!row.refCode && row.created_at) {
  //       const date = new Date(row.created_at) 
  //       const refCode = generateRefCode(date, index + 1)
  //       return { ...row, refCode, }
  //     }
  //     return row
  //   })

  //   if (JSON.stringify(dataWithRefCodes) !== JSON.stringify(state.processedData)) {
  //     dispatch({ type: "SET_PROCESSED_DATA", payload: dataWithRefCodes })
  //   }
  // }, [state.processedData, dispatch, router])

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 2 })
    router.push("/validation")
  }

  const handleNext = () => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 4 })
    router.push("/visualization")
  }

  if (state.processedData.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={state.currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">สร้าง RefCode อัตโนมัติ</h2>
            <p className="text-gray-600">ระบบได้สร้างรหัสอ้างอิง (RefCode) ให้กับข้อมูลแต่ละรายการแล้ว</p>
          </div>

          <RefCodeSummary />
          <RefCodeTable />

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button onClick={handleNext}  className="bg-primary text-primary-foreground hover:opacity-90">
              ดำเนินการต่อ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
