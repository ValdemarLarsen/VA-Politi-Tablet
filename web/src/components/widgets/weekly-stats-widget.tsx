"use client"

import { useState, useEffect } from "react"
import { TrendingUp, FileText, DollarSign, Users, Calendar, AlertTriangle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface WeeklyStats {
  totalCases: number
  totalFines: number
  totalFineAmount: number
  trafficViolations: number
  criminalCases: number
  arrests: number
  weekNumber: number
  year: number
  previousWeekComparison: {
    cases: number
    fines: number
    amount: number
  }
}

const mockWeeklyStats: WeeklyStats = {
  totalCases: 47,
  totalFines: 23,
  totalFineAmount: 89500,
  trafficViolations: 31,
  criminalCases: 16,
  arrests: 3,
  weekNumber: 2,
  year: 2025,
  previousWeekComparison: {
    cases: 12, // +12 fra forrige uge
    fines: -5, // -5 fra forrige uge
    amount: 15000, // +15000 kr fra forrige uge
  },
}

export default function WeeklyStatsWidget() {
  const { darkMode } = useSettings()
  const [stats, setStats] = useState<WeeklyStats>(mockWeeklyStats)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalCases: prev.totalCases + Math.floor(Math.random() * 3),
        totalFines: prev.totalFines + Math.floor(Math.random() * 2),
        totalFineAmount: prev.totalFineAmount + Math.floor(Math.random() * 5) * 1000,
      }))
      setLastUpdate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />
    if (change < 0) return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
    return <div className="w-3 h-3" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">
              Uge {stats.weekNumber}, {stats.year}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {lastUpdate.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="flex-1 p-3 space-y-3">
        {/* Total Cases */}
        <div
          className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-blue-50 border-blue-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Sager i alt</span>
            </div>
            <div className="flex items-center space-x-1">
              {getChangeIcon(stats.previousWeekComparison.cases)}
              <span className={`text-xs ${getChangeColor(stats.previousWeekComparison.cases)}`}>
                {stats.previousWeekComparison.cases > 0 ? "+" : ""}
                {stats.previousWeekComparison.cases}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalCases}</div>
          <div className="text-xs text-gray-500">
            vs. {stats.totalCases - stats.previousWeekComparison.cases} forrige uge
          </div>
        </div>

        {/* Fines */}
        <div
          className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-green-50 border-green-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Bøder</span>
            </div>
            <div className="flex items-center space-x-1">
              {getChangeIcon(stats.previousWeekComparison.fines)}
              <span className={`text-xs ${getChangeColor(stats.previousWeekComparison.fines)}`}>
                {stats.previousWeekComparison.fines > 0 ? "+" : ""}
                {stats.previousWeekComparison.fines}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.totalFines}</div>
          <div className="text-xs text-gray-500">{stats.totalFineAmount.toLocaleString()} kr. i alt</div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`p-2 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-yellow-50 border-yellow-200"}`}
          >
            <div className="flex items-center space-x-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">Trafik</span>
            </div>
            <div className="text-lg font-bold text-yellow-600">{stats.trafficViolations}</div>
          </div>

          <div
            className={`p-2 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-red-50 border-red-200"}`}
          >
            <div className="flex items-center space-x-1 mb-1">
              <Users className="w-3 h-3 text-red-500" />
              <span className="text-xs font-medium">Anholdelser</span>
            </div>
            <div className="text-lg font-bold text-red-600">{stats.arrests}</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div
          className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Ugentlig fremgang</span>
            <span className="text-xs text-gray-500">vs. forrige uge</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Sager</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.previousWeekComparison.cases / 20) * 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${getChangeColor(stats.previousWeekComparison.cases)}`}>
                  {stats.previousWeekComparison.cases > 0 ? "+" : ""}
                  {stats.previousWeekComparison.cases}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs">Beløb</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stats.previousWeekComparison.amount / 30000) * 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${getChangeColor(stats.previousWeekComparison.amount)}`}>
                  +{(stats.previousWeekComparison.amount / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-2 border-t text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="text-xs text-gray-500">
          Opdateret:{" "}
          {lastUpdate.toLocaleString("da-DK", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}
