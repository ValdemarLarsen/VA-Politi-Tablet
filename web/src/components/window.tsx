"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Minus, Square, X } from "lucide-react"
import { useWindows, type WindowData } from "@/contexts/window-context"
import { useSettings } from "@/contexts/settings-context"

interface WindowProps {
  window: WindowData
}

export default function Window({ window }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } =
    useWindows()
  const { darkMode } = useSettings()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-header")) {
      setIsDragging(true)
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
      focusWindow(window.id)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !window.isMaximized) {
      const newX = e.clientX - dragOffset.x
      const newY = Math.max(0, e.clientY - dragOffset.y)
      updateWindowPosition(window.id, { x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragOffset])

  const windowStyle = window.isMaximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 48px)" }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
        display: window.isMinimized ? "none" : "block",
      }

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-lg shadow-2xl border overflow-hidden ${
        darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
      }`}
      style={{
        ...windowStyle,
        zIndex: window.zIndex,
      }}
      onClick={() => focusWindow(window.id)}
    >
      {/* Window Header */}
      <div
        className={`window-header h-8 border-b flex items-center justify-between px-3 cursor-move ${
          darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
        }`}
        onMouseDown={handleMouseDown}
      >
        <span className={`text-sm font-medium select-none ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          {window.title}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(window.id)
            }}
            className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
              darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
            }`}
          >
            <Minus className={`w-3 h-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              maximizeWindow(window.id)
            }}
            className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
              darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
            }`}
          >
            <Square className={`w-3 h-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(window.id)
            }}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-hidden" style={{ height: "calc(100% - 32px)" }}>
        {window.component}
      </div>
    </div>
  )
}
