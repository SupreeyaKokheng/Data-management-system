"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FullPageLoaderProps {
  show: boolean
  message?: string
  className?: string
}

export function FullPageLoader({
  show,
  message = "กำลังโหลด...",
  className,
}: FullPageLoaderProps) {
  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  )
}
