"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface CaseItem {
  id: string
  caseNumber: string
  title: string
  type: "Trafik" | "Tyveri" | "Vold" | "Bedrageri" | "Narkotika" | "Andet"
  status: "Åben" | "Under behandling" | "Afsluttet" | "Kritisk"
  priority: "Lav" | "Normal" | "Høj" | "Kritisk"
  officer: string
  date: string
  timeAgo: string
}

const mockCases: CaseItem[] = [
  {
    id: "1",
    caseNumber: "2025-001234",
    title: "Indbrud på Nørrebrogade",
    type: "Tyveri",
    status: "Under behandling",
    priority: "Høj",
    officer: "Betjent Hansen",
    date: "2025-01-07",
    timeAgo: "2 timer siden",
  },
  {
    id: "2",
    caseNumber: "2025-001235",
    title: "Fartbøde - Hovedvejen",
    type: "Trafik",
    status: "Afsluttet",
    priority: "Lav",
    officer: "Betjent Nielsen",
    date: "2025-01-07",
    timeAgo: "4 timer siden",
  },
  {
    id: "3",
    caseNumber: "2025-001236",
    title: "Vold på værtshus",
    type: "Vold",
    status: "Kritisk",
    priority: "Kritisk",
    officer: "Kriminalassistent Larsen",
    date: "2025-01-06",
    timeAgo: "1 dag siden",
  },
  {
    id: "4",
    caseNumber: "2025-001237",
    title: "Butikstyveri - Netto",
    type: "Tyveri",
    status: "Åben",
    priority: "Normal",
    officer: "Betjent Andersen",
    date: "2025-01-06",
    timeAgo: "1 dag siden",
  },
  {
    id: "5",
    caseNumber: "2025-001238",
    title: "Narkotikabesiddelse",
    type: "Narkotika",
    status: "Under behandling",
    priority: "Høj",
    officer: "Kriminalassistent Nielsen",
    date: "2025-01-05",
    timeAgo: "2 dage siden",
  },
]

export default function CaseOverviewWidget() {
  const { darkMode } = useSettings()
  const [cases, setCases] = useState<CaseItem[]>(mockCases)
  const [filter, setFilter] = useState<"alle" | "åben" | "kritisk">("alle")
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCases((prev) =>
        prev.map((case_) => ({
          ...case_,
          timeAgo: updateTimeAgo(case_.date),
        })),
      )
      setLastUpdate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const updateTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return "Mindre end 1 time siden"
    if (diffHours < 24) return `${diffHours} timer siden`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} dag${diffDays > 1 ? "e" : ""} siden`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Åben":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under behandling":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Afsluttet":
        return "bg-green-100 text-green-800 border-green-200"
      case "Kritisk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Åben":
        return <FileText className="w-3 h-3" />
      case "Under behandling":
        return <Clock className="w-3 h-3" />
      case "Afsluttet":
        return <CheckCircle className="w-3 h-3" />
      case "Kritisk":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Kritisk":
        return "text-red-500"
      case "Høj":
        return "text-orange-500"
      case "Normal":
        return "text-blue-500"
      case "Lav":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredCases = cases.filter((case_) => {
    switch (filter) {
      case "åben":
        return case_.status === "Åben"
      case "kritisk":
        return case_.status === "Kritisk" || case_.priority === "Kritisk"
      default:
        return true
    }
  })

  const statusCounts = {
    total: cases.length,
    open: cases.filter((c) => c.status === "Åben").length,
    inProgress: cases.filter((c) => c.status === "Under behandling").length,
    critical: cases.filter((c) => c.status === "Kritisk").length,
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Sager denne uge</span>
          </div>
          <span className="text-xs text-gray-500">{filteredCases.length} sager</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-1 text-xs">
          <div className="text-center">
            <div className="font-semibold text-blue-600">{statusCounts.open}</div>
            <div className="text-gray-500">Åbne</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-yellow-600">{statusCounts.inProgress}</div>
            <div className="text-gray-500">Aktive</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{statusCounts.critical}</div>
            <div className="text-gray-500">Kritiske</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">{statusCounts.total}</div>
            <div className="text-gray-500">Total</div>
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
          <option value="alle">Alle sager</option>
          <option value="åben">Kun åbne sager</option>
          <option value="kritisk">Kun kritiske sager</option>
        </select>
      </div>

      {/* Cases List */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-1 p-2">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              className={`p-2 rounded-lg border transition-colors hover:shadow-sm ${
                darkMode
                  ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs font-mono text-gray-500">{case_.caseNumber}</span>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(case_.priority)}`} />
                  </div>
                  <div className="text-xs font-medium truncate">{case_.title}</div>
                </div>
                <button
                  className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(case_.status)}`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(case_.status)}
                    <span>{case_.status}</span>
                  </div>
                </span>
                <span className="text-xs text-gray-500">{case_.type}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="truncate">{case_.officer}</span>
                <span>{case_.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-2 border-t text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="text-xs text-gray-500">
          Opdateret: {lastUpdate.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
