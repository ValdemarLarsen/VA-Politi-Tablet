"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Move, Settings } from "lucide-react"
import { useWidgets, type Widget } from "@/contexts/widget-context"
import { useSettings } from "@/contexts/settings-context"

interface WidgetContainerProps {
  widget: Widget
  children: React.ReactNode
}

export default function WidgetContainer({ widget, children }: WidgetContainerProps) {
  const { darkMode } = useSettings()
  const { removeWidget, moveWidget, resizeWidget } = useWidgets()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("widget-header")) {
      setIsDragging(true)
      const rect = widgetRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const maxX = window.innerWidth - widget.size.width
      const maxY = window.innerHeight - widget.size.height - 48 // Account for taskbar

      const newX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x))
      const newY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y))

      moveWidget(widget.id, { x: newX, y: newY })
    }

    if (isResizing) {
      const rect = widgetRef.current?.getBoundingClientRect()
      if (rect) {
        const newWidth = Math.max(200, e.clientX - rect.left)
        const newHeight = Math.max(150, e.clientY - rect.top)
        resizeWidget(widget.id, { width: newWidth, height: newHeight })
      }
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

  if (!widget.isVisible) return null

  return (
    <div
      ref={widgetRef}
      className={`absolute rounded-lg shadow-lg border overflow-hidden backdrop-blur-md transition-all ${
        isDragging ? "scale-105 shadow-2xl z-50" : "z-10"
      } ${darkMode ? "bg-gray-800/90 border-gray-600 text-white" : "bg-white/90 border-gray-200 text-gray-900"}`}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        zIndex: isDragging ? 1000 : 100,
      }}
    >
      {/* Widget Header */}
      <div
        className={`widget-header h-8 border-b flex items-center justify-between px-3 cursor-move ${
          darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50/50 border-gray-200"
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-3 h-3 opacity-50" />
          <span className="text-xs font-medium">{widget.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
              darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
            }`}
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={() => removeWidget(widget.id)}
            className="w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="h-full overflow-hidden" style={{ height: "calc(100% - 32px)" }}>
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize transition-opacity ${
          isResizing ? "opacity-100" : "opacity-50 hover:opacity-100"
        }`}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsResizing(true)
        }}
      >
        <div
          className={`w-full h-full ${darkMode ? "bg-gray-400" : "bg-gray-600"}`}
          style={{
            clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
          }}
        />
      </div>
    </div>
  )
}
