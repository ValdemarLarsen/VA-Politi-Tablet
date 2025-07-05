"use client"

import { Search, WorkflowIcon as Widgets, Mic, Wifi, Volume2, Battery } from "lucide-react"
import { useWindows } from "@/contexts/window-context"
import { useSettings } from "@/contexts/settings-context"

interface TaskbarProps {
  onStartClick: () => void
  currentTime: Date
}

export default function Taskbar({ onStartClick, currentTime }: TaskbarProps) {
  const { windows, focusWindow, minimizeWindow } = useWindows()
  const { darkMode } = useSettings()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-12 backdrop-blur-md border-t flex items-center px-2 ${
        darkMode ? "bg-gray-900/90 border-gray-700" : "bg-black/80 border-white/10"
      }`}
    >
      {/* Start Button */}
      <button
        onClick={onStartClick}
        className={`w-12 h-8 flex items-center justify-center rounded transition-colors ${
          darkMode ? "hover:bg-gray-700" : "hover:bg-white/10"
        }`}
      >
        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm opacity-90" />
        </div>
      </button>

      {/* Search */}
      <div
        className={`flex items-center ml-2 rounded-full px-3 py-1 min-w-[200px] ${
          darkMode ? "bg-gray-700" : "bg-white/10"
        }`}
      >
        <Search className={`w-4 h-4 mr-2 ${darkMode ? "text-gray-300" : "text-white/70"}`} />
        <input
          type="text"
          placeholder="Søg"
          className={`bg-transparent text-sm outline-none flex-1 ${
            darkMode ? "text-white placeholder-gray-400" : "text-white placeholder-white/50"
          }`}
        />
        <Mic className={`w-4 h-4 ml-2 ${darkMode ? "text-gray-300" : "text-white/70"}`} />
      </div>

      {/* Task View */}
      <button
        className={`w-10 h-8 flex items-center justify-center rounded transition-colors ml-2 ${
          darkMode ? "hover:bg-gray-700" : "hover:bg-white/10"
        }`}
      >
        <Widgets className={`w-5 h-5 ${darkMode ? "text-gray-200" : "text-white"}`} />
      </button>

      {/* Running Applications */}
      <div className="flex items-center ml-4 space-x-1">
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => {
              if (window.isMinimized) {
                // Gendanne minimeret vindue
                focusWindow(window.id)
              } else {
                // Minimere aktivt vindue eller fokusere på det
                const isCurrentlyFocused = window.zIndex === Math.max(...windows.map((w) => w.zIndex))
                if (isCurrentlyFocused) {
                  minimizeWindow(window.id)
                } else {
                  focusWindow(window.id)
                }
              }
            }}
            className={`px-3 py-1 rounded text-xs transition-colors max-w-[150px] truncate ${
              window.isMinimized
                ? darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-600"
                  : "bg-white/10 hover:bg-white/20 text-white/60 border border-white/20"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-white/20 hover:bg-white/30 text-white"
            }`}
            title={window.isMinimized ? `${window.title} (minimeret)` : window.title}
          >
            {window.title}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className={`ml-auto flex items-center space-x-2 ${darkMode ? "text-gray-200" : "text-white"}`}>
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <Battery className="w-4 h-4" />

        {/* Time and Date */}
        <div className="text-right text-xs leading-tight ml-2">
          <div>{formatTime(currentTime)}</div>
          <div className={darkMode ? "text-gray-400" : "text-white/70"}>{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  )
}
