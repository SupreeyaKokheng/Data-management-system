import { Database } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="  p-2 rounded-lg">
              {/* <Database className="h-6 w-6 text-white" /> */}
              <Image
                src="/logo.png"
                alt="Logo"
                width={70}
                height={70}
                className="rounded"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">ระบบจัดการข้อมูล</h1>
              <p className="text-sm text-gray-500">นำเข้า ตรวจสอบ และจัดการข้อมูล</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
