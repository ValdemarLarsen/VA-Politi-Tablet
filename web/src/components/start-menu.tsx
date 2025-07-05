"use client"

import { useEffect, useRef } from "react"
import { Power, User, Search } from "lucide-react"
import { useWindows } from "@/contexts/window-context"
import Calculator from "./apps/calculator"
import Notepad from "./apps/notepad"
import SettingsApp from "./apps/settings"
import { useSettings } from "@/contexts/settings-context"
import PersonRegister from "./apps/person-register"
import IncidentReport from "./apps/incident-report"

interface StartMenuProps {
  onClose: () => void
}

export default function StartMenu({ onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { openWindow } = useWindows()
  const { darkMode } = useSettings()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const pinnedApps = [
    {
      name: "Calculator",
      icon: "🧮",
      onClick: () => {
        openWindow({
          title: "Calculator",
          component: <Calculator />,
          position: { x: 100, y: 100 },
          size: { width: 320, height: 500 },
        })
        onClose()
      },
    },
    {
      name: "Notepad",
      icon: "📝",
      onClick: () => {
        openWindow({
          title: "Notepad",
          component: <Notepad />,
          position: { x: 150, y: 150 },
          size: { width: 600, height: 400 },
        })
        onClose()
      },
    },
    {
      name: "Settings",
      icon: "⚙️",
      onClick: () => {
        openWindow({
          title: "Settings",
          component: <SettingsApp />,
          position: { x: 200, y: 200 },
          size: { width: 800, height: 600 },
        })
        onClose()
      },
    },
    {
      name: "Personregister",
      icon: "👥",
      onClick: () => {
        openWindow({
          title: "Personregister",
          component: <PersonRegister />,
          position: { x: 300, y: 300 },
          size: { width: 1000, height: 700 },
        })
        onClose()
      },
    },
    {
      name: "Hændelsesrapport",
      icon: "📋",
      onClick: () => {
        openWindow({
          title: "Hændelsesrapport",
          component: <IncidentReport />,
          position: { x: 350, y: 50 },
          size: { width: 1400, height: 900 },
        })
        onClose()
      },
    },
  ]

  return (
    <div
      className={`absolute bottom-12 left-2 w-96 h-[500px] backdrop-blur-xl rounded-lg border shadow-2xl ${
        darkMode ? "bg-gray-900/95 border-gray-700" : "bg-black/90 border-white/20"
      }`}
      ref={menuRef}
    >
      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className={`flex items-center rounded-full px-3 py-2 ${darkMode ? "bg-gray-800" : "bg-white/10"}`}>
          <Search className={`w-4 h-4 mr-2 ${darkMode ? "text-gray-400" : "text-white/70"}`} />
          <input
            type="text"
            placeholder="Søg efter apps, filer og indstillinger"
            className={`bg-transparent text-sm outline-none flex-1 ${
              darkMode ? "text-white placeholder-gray-400" : "text-white placeholder-white/50"
            }`}
          />
        </div>
      </div>

      {/* Pinned Apps */}
      <div className="p-4">
        <h3 className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-200" : "text-white"}`}>Fastgjorte</h3>
        <div className="grid grid-cols-6 gap-2">
          {pinnedApps.map((app, index) => (
            <button
              key={index}
              onClick={app.onClick}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-white/10"
              }`}
            >
              <div className="text-2xl mb-1">{app.icon}</div>
              <span className={`text-xs text-center ${darkMode ? "text-gray-200" : "text-white"}`}>{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User and Power */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t flex items-center justify-between ${
          darkMode ? "border-gray-700" : "border-white/10"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className={`text-sm ${darkMode ? "text-gray-200" : "text-white"}`}>Bruger</span>
        </div>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            darkMode ? "hover:bg-gray-800" : "hover:bg-white/10"
          }`}
        >
          <Power className={`w-4 h-4 ${darkMode ? "text-gray-200" : "text-white"}`} />
        </button>
      </div>
    </div>
  )
}
