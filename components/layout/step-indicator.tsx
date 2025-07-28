import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "นำเข้าข้อมูล", description: "อัปโหลดไฟล์ข้อมูล" },
  { id: 2, name: "ตรวจสอบข้อมูล", description: "ตรวจสอบและแก้ไขข้อมูล" },
  { id: 3, name: "สร้าง RefCode", description: "สร้างรหัสอ้างอิงอัตโนมัติ" },
  { id: 4, name: "แสดงกราฟ", description: "วิเคราะห์ข้อมูลเป็นกราฟ" },
  { id: 5, name: "ส่งออกข้อมูล", description: "ดาวน์โหลดข้อมูล" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={cn(stepIdx !== steps.length - 1 ? "flex-1" : "", "relative")}>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                        step.id < currentStep
                          ? "bg-primary border-primary"
                          : step.id === currentStep
                            ? "border-primary  bg-white"
                            : "border-gray-300 bg-white",
                      )}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            step.id === currentStep ? "text-primary" : "text-gray-500",
                          )}
                        >
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          step.id <= currentStep ? "text-primary" : "text-gray-500",
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="hidden sm:block flex-1 ml-4">
                      <div className={cn("h-0.5 w-full", step.id < currentStep ? "bg-primary " : "bg-gray-300")} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
