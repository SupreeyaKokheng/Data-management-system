import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataProvider } from "@/contexts/data-context"
import { Toaster } from "@/components/ui/toaster"
import { AppContentWrapper } from "@/components/common/AppContentWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ระบบจัดการข้อมูล",
  description: "ระบบนำเข้า ตรวจสอบ และจัดการข้อมูลแบบ Responsive",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <DataProvider>
          <AppContentWrapper>
            {children}
          </AppContentWrapper>
          <Toaster />
        </DataProvider>
      </body>
    </html>
  )
}
