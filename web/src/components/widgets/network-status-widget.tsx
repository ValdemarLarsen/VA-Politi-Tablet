"use client"

import { useState, useEffect } from "react"
import { Signal, Shield, AlertTriangle, CheckCircle, Radio } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface NetworkInfo {
  type: "internal" | "mobile"
  name: string
  signalStrength: number
  isSecure: boolean
  status: "connected" | "connecting" | "disconnected"
  ip: string
  location: string
}

export default function NetworkStatusWidget() {
  const { darkMode } = useSettings()
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    type: "internal",
    name: "POLITI-NET-SECURE",
    signalStrength: 95,
    isSecure: true,
    status: "connected",
    ip: "10.0.1.247",
    location: "Hovedstation",
  })

  // Simulate network switching for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly switch networks to simulate field work
      const isInternal = Math.random() > 0.3 // 70% chance of being on internal network

      if (isInternal) {
        setNetworkInfo({
          type: "internal",
          name: "POLITI-NET-SECURE",
          signalStrength: 90 + Math.floor(Math.random() * 10),
          isSecure: true,
          status: "connected",
          ip: "10.0.1." + (200 + Math.floor(Math.random() * 50)),
          location: "Hovedstation",
        })
      } else {
        const mobileNetworks = ["TDC 5G", "Telenor 4G", "3 5G", "Telia 4G+"]
        const locations = ["Nørrebro", "Vesterbro", "Østerbro", "Amager", "Frederiksberg"]

        setNetworkInfo({
          type: "mobile",
          name: mobileNetworks[Math.floor(Math.random() * mobileNetworks.length)],
          signalStrength: 60 + Math.floor(Math.random() * 35),
          isSecure: false,
          status: "connected",
          ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
          location: locations[Math.floor(Math.random() * locations.length)],
        })
      }
    }, 15000) // Switch every 15 seconds for demo

    return () => clearInterval(interval)
  }, [])

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25)
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 rounded-sm ${
          i < bars
            ? networkInfo.type === "internal"
              ? "bg-green-500"
              : "bg-blue-500"
            : darkMode
              ? "bg-gray-600"
              : "bg-gray-300"
        }`}
        style={{ height: `${(i + 1) * 3 + 2}px` }}
      />
    ))
  }

  const getNetworkIcon = () => {
    if (networkInfo.type === "internal") {
      return <Shield className="w-5 h-5 text-green-500" />
    } else {
      return <Radio className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = () => {
    switch (networkInfo.status) {
      case "connected":
        return networkInfo.type === "internal" ? "text-green-500" : "text-blue-500"
      case "connecting":
        return "text-yellow-500"
      case "disconnected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className={`p-4 h-full ${darkMode ? "text-white" : "text-gray-900"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getNetworkIcon()}
          <h3 className="font-semibold text-sm">Netværksstatus</h3>
        </div>
        <div className="flex items-center space-x-1">{getSignalBars(networkInfo.signalStrength)}</div>
      </div>

      {/* Network Type Badge */}
      <div className="mb-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            networkInfo.type === "internal"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          }`}
        >
          {networkInfo.type === "internal" ? (
            <>
              <Shield className="w-3 h-3 mr-1" />
              Internt Netværk
            </>
          ) : (
            <>
              <Signal className="w-3 h-3 mr-1" />
              Mobilt Netværk
            </>
          )}
        </div>
      </div>

      {/* Connection Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Status:</span>
          <div className="flex items-center space-x-1">
            <CheckCircle className={`w-4 h-4 ${getStatusColor()}`} />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {networkInfo.status === "connected" ? "Tilsluttet" : "Afbrudt"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Netværk:</span>
          <span className="text-sm font-medium">{networkInfo.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Signal:</span>
          <span className="text-sm font-medium">{networkInfo.signalStrength}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>IP Adresse:</span>
          <span className="text-sm font-mono">{networkInfo.ip}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Lokation:</span>
          <span className="text-sm font-medium">{networkInfo.location}</span>
        </div>
      </div>

      {/* Security Status */}
      <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
        <div className="flex items-center space-x-2">
          {networkInfo.isSecure ? (
            <Shield className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
          <div>
            <div className="text-sm font-medium">
              {networkInfo.isSecure ? "Sikker Forbindelse" : "Usikret Forbindelse"}
            </div>
            <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {networkInfo.isSecure ? "Krypteret politi netværk" : "Offentligt mobilt netværk"}
            </div>
          </div>
        </div>
      </div>

      {/* Network Type Info */}
      <div className="mt-4">
        <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          {networkInfo.type === "internal"
            ? "Du er tilsluttet det sikre politi netværk på stationen"
            : "Du er tilsluttet via mobilt netværk i felten"}
        </div>
      </div>
    </div>
  )
}
