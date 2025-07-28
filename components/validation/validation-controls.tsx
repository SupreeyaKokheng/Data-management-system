"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

interface ValidationControlsProps {
  onSearch?: (query: string) => void
  onFilter?: (filter: string) => void
}

export function ValidationControls({ onSearch, onFilter }: ValidationControlsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")


  const handleSearch = (value: string) => {
  setSearchQuery(value)
  onSearch?.(value)
}

const handleFilter = (value: string) => {
  setActiveFilter(value)
  onFilter?.(value)
}


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>ค้นหาข้อมูล</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาข้อมูล..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={activeFilter} onValueChange={handleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="กรองข้อมูล" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="issues">มีปัญหา</SelectItem>
              <SelectItem value="missing">Missing Values</SelectItem>
              <SelectItem value="null">Null Values</SelectItem>
              <SelectItem value="duplicate">Duplicates</SelectItem>
              <SelectItem value="clean">ไม่มีปัญหา</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant={activeFilter === "all" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleFilter("all")}
          >
            ทั้งหมด
          </Badge>
          <Badge
            variant={activeFilter === "issues" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleFilter("issues")}
          >
            มีปัญหา
          </Badge>
          <Badge
            variant={activeFilter === "missing" ? "destructive" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleFilter("missing")}
          >
            Missing
          </Badge>
          <Badge
            variant={activeFilter === "null" ? "default" : "secondary"}
            className="cursor-pointer bg-yellow-500 hover:bg-yellow-600"
            onClick={() => handleFilter("null")}
          >
            Null
          </Badge>
          <Badge
            variant={activeFilter === "duplicate" ? "default" : "secondary"}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600"
            onClick={() => handleFilter("duplicate")}
          >
            Duplicate
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
