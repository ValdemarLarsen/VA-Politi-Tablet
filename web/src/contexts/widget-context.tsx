"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Widget {
  id: string
  type: string
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  settings: Record<string, any>
  isVisible: boolean
}

interface WidgetContextType {
  widgets: Widget[]
  addWidget: (widget: Omit<Widget, "id">) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  toggleWidget: (id: string) => void
  moveWidget: (id: string, position: { x: number; y: number }) => void
  resizeWidget: (id: string, size: { width: number; height: number }) => void
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined)

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([])

  // Load widgets from localStorage on mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem("desktop-widgets")
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets))
      } catch (error) {
        console.error("Error loading widgets:", error)
      }
    }
  }, [])

  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem("desktop-widgets", JSON.stringify(widgets))
    }
  }, [widgets])

  const addWidget = (widgetData: Omit<Widget, "id">) => {
    const newWidget: Widget = {
      ...widgetData,
      id: Math.random().toString(36).substr(2, 9),
    }
    setWidgets((prev) => [...prev, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const toggleWidget = (id: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, isVisible: !w.isVisible } : w)))
  }

  const moveWidget = (id: string, position: { x: number; y: number }) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)))
  }

  const resizeWidget = (id: string, size: { width: number; height: number }) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)))
  }

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        addWidget,
        removeWidget,
        updateWidget,
        toggleWidget,
        moveWidget,
        resizeWidget,
      }}
    >
      {children}
    </WidgetContext.Provider>
  )
}

export function useWidgets() {
  const context = useContext(WidgetContext)
  if (context === undefined) {
    throw new Error("useWidgets must be used within a WidgetProvider")
  }
  return context
}
