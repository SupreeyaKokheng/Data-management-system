import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generateRefCode(date: Date, sequence: number): string {
  const year = (date.getFullYear() ).toString().slice(-2) // Convert to Buddhist year
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const seq = sequence.toString().padStart(3, "0")
  return `${year}${month}${seq}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function exportToExcel(data: any[], filename: string) {
  // This would be implemented with a library like xlsx
  console.log("Exporting to Excel:", { data, filename })
}

export const formatThaiDate = (value: string | Date): string => {
  const date = new Date(value)
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("th-TH")
}

export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data)
  downloadFile(csv, filename, "text/csv")
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0]).filter((key) => key !== "id" && key !== "issues")
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value || ""
        })
        .join(","),
    ),
  ].join("\n")

  return csvContent
}

function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
