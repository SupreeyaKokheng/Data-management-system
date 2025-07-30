"use client"

import { useData } from "@/contexts/data-context"
import { FullPageLoader } from "@/components/common/FullPageLoader"

export function AppContentWrapper({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useData()

  if (!isInitialized) {
    return <FullPageLoader show message="กำลังโหลดข้อมูล..." />
  }

  return <>{children}</>
}
