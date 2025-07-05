"use client"

import { useState, useEffect } from "react"
import { Users, Clock, MapPin, Phone, Shield, AlertCircle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface StaffMember {
  id: string
  name: string
  rank: string
  badgeNumber: string
  status: "På vagt" | "Pause" | "Patrulje" | "Kontor" | "Ikke tilgængelig"
  location: string
  lastUpdate: string
  phone: string
  unit: string
  priority: "Lav" | "Normal" | "Høj" | "Kritisk"
}

const mockStaffData: StaffMember[] = [
  {
    id: "1",
    name: "Betjent Hansen",
    rank: "Betjent",
    badgeNumber: "1234",
    status: "Patrulje",
    location: "Nørrebro",
    lastUpdate: "2 min siden",
    phone: "+45 12 34 56 78",
    unit: "Patrulje 1",
    priority: "Normal",
  },
  {
    id: "2",
    name: "Kriminalassistent Nielsen",
    rank: "Kriminalassistent",
    badgeNumber: "2001",
    status: "På vagt",
    location: "Station",
    lastUpdate: "5 min siden",
    phone: "+45 87 65 43 21",
    unit: "Kriminalpoliti",
    priority: "Høj",
  },
  {
    id: "3",
    name: "Betjent Larsen",
    rank: "Betjent",
    badgeNumber: "1235",
    status: "Pause",
    location: "Station",
    lastUpdate: "1 min siden",
    phone: "+45 23 45 67 89",
    unit: "Patrulje 2",
    priority: "Lav",
  },
  {
    id: "4",
    name: "Politikommissær Andersen",
    rank: "Politikommissær",
    badgeNumber: "3001",
    status: "Kontor",
    location: "Ledelse",
    lastUpdate: "10 min siden",
    phone: "+45 34 56 78 90",
    unit: "Ledelse",
    priority: "Kritisk",
  },
  {
    id: "5",
    name: "Betjent Petersen",
    rank: "Betjent",
    badgeNumber: "1236",
    status: "Ikke tilgængelig",
    location: "Ukendt",
    lastUpdate: "45 min siden",
    phone: "+45 45 67 89 01",
    unit: "Patrulje 3",
    priority: "Normal",
  },
]

export default function StaffStatusWidget() {
  const { darkMode } = useSettings()
  const [staffData, setStaffData] = useState<StaffMember[]>(mockStaffData)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [filter, setFilter] = useState<"alle" | "tilgængelig" | "patrulje">("alle")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStaffData((prev) =>
        prev.map((staff) => ({
          ...staff,
          lastUpdate: `${Math.floor(Math.random() * 30) + 1} min siden`,
        })),
      )
      setLastRefresh(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "På vagt":
        return "bg-green-100 text-green-800 border-green-200"
      case "Patrulje":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pause":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Kontor":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Ikke tilgængelig":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Kritisk":
        return <AlertCircle className="w-3 h-3 text-red-500" />
      case "Høj":
        return <AlertCircle className="w-3 h-3 text-orange-500" />
      default:
        return null
    }
  }

  const filteredStaff = staffData.filter((staff) => {
    switch (filter) {
      case "tilgængelig":
        return ["På vagt", "Patrulje", "Kontor"].includes(staff.status)
      case "patrulje":
        return staff.status === "Patrulje"
      default:
        return true
    }
  })

  const statusCounts = {
    total: staffData.length,
    available: staffData.filter((s) => ["På vagt", "Patrulje", "Kontor"].includes(s.status)).length,
    patrol: staffData.filter((s) => s.status === "Patrulje").length,
    unavailable: staffData.filter((s) => s.status === "Ikke tilgængelig").length,
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header Stats */}
      <div className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-green-500" />
            <span>Tilgængelig: {statusCounts.available}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span>Patrulje: {statusCounts.patrol}</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Ikke tilgængelig: {statusCounts.unavailable}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span>Total: {statusCounts.total}</span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className={`p-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className={`w-full text-xs px-2 py-1 rounded border ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="alle">Alle medarbejdere</option>
          <option value="tilgængelig">Kun tilgængelige</option>
          <option value="patrulje">Kun patrulje</option>
        </select>
      </div>

      {/* Staff List */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-1 p-2">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className={`p-2 rounded-lg border transition-colors hover:shadow-sm ${
                darkMode
                  ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium truncate">{staff.name}</span>
                  {getPriorityIcon(staff.priority)}
                </div>
                <span className="text-xs text-gray-500">{staff.badgeNumber}</span>
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
                <span className="text-xs text-gray-500">{staff.unit}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{staff.location}</span>
                </div>
                <span>{staff.lastUpdate}</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  <button
                    className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                    title={`Ring til ${staff.name}`}
                  >
                    <Phone className="w-3 h-3" />
                  </button>
                  <button
                    className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                    title="Send besked"
                  >
                    <MapPin className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">{staff.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`p-2 border-t text-xs text-center ${
          darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
        }`}
      >
        Sidst opdateret: {lastRefresh.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  )
}
