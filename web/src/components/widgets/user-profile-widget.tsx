"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

export default function UserProfileWidget() {
  const { darkMode } = useSettings()
  const [showDetails, setShowDetails] = useState(false)

  // Mock user data
  const userData = {
    name: "Betjent Hansen",
    title: "Politibetjent",
    badge: "PB-2024-157",
    department: "Københavns Politi",
    email: "j.hansen@politi.dk",
    phone: "+45 12 34 56 78",
    location: "Station City",
    startDate: "15. januar 2020",
    avatar: "/placeholder.svg?height=80&width=80&text=JH",
    status: "På vagt",
    shift: "Dagvagt (08:00-16:00)",
  }

  return (
    <div className={`p-4 h-full ${darkMode ? "text-white" : "text-gray-900"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Min Profil</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="h-6 w-6 p-0">
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      {/* User Avatar and Basic Info */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <img
            src={userData.avatar || "/placeholder.svg"}
            alt={userData.name}
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h4 className="font-semibold text-lg">{userData.name}</h4>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{userData.title}</p>
        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{userData.badge}</p>
      </div>

      {/* Status */}
      <div className={`p-3 rounded-lg mb-4 ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">{userData.status}</span>
          </div>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{userData.shift}</p>
      </div>

      {/* Quick Info */}
      {!showDetails ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{userData.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Ansat siden {userData.startDate}</span>
          </div>
        </div>
      ) : (
        /* Detailed Info */
        <div className="space-y-3">
          <div className={`p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex items-center space-x-2 text-sm mb-1">
              <User className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Afdeling</span>
            </div>
            <p className={`text-sm ml-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{userData.department}</p>
          </div>

          <div className={`p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex items-center space-x-2 text-sm mb-1">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Email</span>
            </div>
            <p className={`text-sm ml-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{userData.email}</p>
          </div>

          <div className={`p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex items-center space-x-2 text-sm mb-1">
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Telefon</span>
            </div>
            <p className={`text-sm ml-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{userData.phone}</p>
          </div>
        </div>
      )}
    </div>
  )
}
