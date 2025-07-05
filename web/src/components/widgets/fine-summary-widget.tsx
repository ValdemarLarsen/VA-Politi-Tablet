"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, Car, AlertTriangle, Users } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface FineData {
  totalAmount: number
  totalCount: number
  categories: {
    traffic: { count: number; amount: number }
    parking: { count: number; amount: number }
    speeding: { count: number; amount: number }
    other: { count: number; amount: number }
  }
  dailyTrend: Array<{ day: string; amount: number; count: number }>
  topFines: Array<{ type: string; amount: number; count: number }>
}

const mockFineData: FineData = {
  totalAmount: 127500,
  totalCount: 34,
  categories: {
    traffic: { count: 18, amount: 45000 },
    parking: { count: 8, amount: 12000 },
    speeding: { count: 6, amount: 67500 },
    other: { count: 2, amount: 3000 },
  },
  dailyTrend: [
    { day: "Man", amount: 15000, count: 4 },
    { day: "Tir", amount: 22000, count: 6 },
    { day: "Ons", amount: 18500, count: 5 },
    { day: "Tor", amount: 31000, count: 8 },
    { day: "Fre", amount: 28000, count: 7 },
    { day: "Lør", amount: 8000, count: 2 },
    { day: "Søn", amount: 5000, count: 2 },
  ],
  topFines: [
    { type: "Hastighedsovertrædelse", amount: 67500, count: 6 },
    { type: "Trafikovertrædelse", amount: 45000, count: 18 },
    { type: "Parkeringsovertrædelse", amount: 12000, count: 8 },
  ],
}

export default function FineSummaryWidget() {
  const { darkMode } = useSettings()
  const [fineData, setFineData] = useState<FineData>(mockFineData)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"overview" | "trend" | "categories">("overview")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFineData((prev) => ({
        ...prev,
        totalAmount: prev.totalAmount + Math.floor(Math.random() * 3) * 1500,
        totalCount: prev.totalCount + Math.floor(Math.random() * 2),
      }))
      setLastUpdate(new Date())
    }, 120000) // Update every 2 minutes

    return () => clearInterval(interval)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "traffic":
        return <Car className="w-4 h-4 text-blue-500" />
      case "speeding":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "parking":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "traffic":
        return "Trafik"
      case "speeding":
        return "Fart"
      case "parking":
        return "Parkering"
      default:
        return "Andet"
    }
  }

  const maxDailyAmount = Math.max(...fineData.dailyTrend.map((d) => d.amount))

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Header */}
      <div className={`p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Bøder denne uge</span>
          </div>
          <div className="flex space-x-1">
            {["overview", "trend", "categories"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  viewMode === mode
                    ? darkMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-900"
                    : darkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {mode === "overview" ? "Oversigt" : mode === "trend" ? "Trend" : "Kategorier"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
            <div className="text-xs text-gray-500 mb-1">Total beløb</div>
            <div className="text-lg font-bold text-green-600">{fineData.totalAmount.toLocaleString()} kr</div>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-blue-50"}`}>
            <div className="text-xs text-gray-500 mb-1">Antal bøder</div>
            <div className="text-lg font-bold text-blue-600">{fineData.totalCount}</div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="flex-1 overflow-auto p-3">
        {viewMode === "overview" && (
          <div className="space-y-3">
            {/* Top Fines */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Top bødetyper</div>
              <div className="space-y-2">
                {fineData.topFines.map((fine, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">{fine.type}</span>
                      <span className="text-xs text-gray-500">{fine.count} stk</span>
                    </div>
                    <div className="text-sm font-semibold text-green-600">{fine.amount.toLocaleString()} kr</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Gennemsnit</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <div className="text-gray-500">Per bøde</div>
                  <div className="font-semibold">
                    {Math.round(fineData.totalAmount / fineData.totalCount).toLocaleString()} kr
                  </div>
                </div>
                <div className={`p-2 rounded ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <div className="text-gray-500">Per dag</div>
                  <div className="font-semibold">{Math.round(fineData.totalAmount / 7).toLocaleString()} kr</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "trend" && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-500 mb-2">Daglig udvikling</div>
            <div className="space-y-2">
              {fineData.dailyTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs font-medium w-8">{day.day}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.amount / maxDailyAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <div className="font-semibold">{day.amount.toLocaleString()}</div>
                    <div className="text-gray-500">{day.count} bøder</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "categories" && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-500 mb-2">Kategorier</div>
            <div className="space-y-2">
              {Object.entries(fineData.categories).map(([key, data]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(key)}
                      <span className="text-sm font-medium">{getCategoryName(key)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{data.count} bøder</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-600">{data.amount.toLocaleString()} kr</div>
                    <div className="text-xs text-gray-500">
                      ⌀ {Math.round(data.amount / data.count).toLocaleString()} kr
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
