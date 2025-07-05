"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SettingsContextType {
  darkMode: boolean
  wallpaper: string
  setDarkMode: (enabled: boolean) => void
  setWallpaper: (url: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false)
  const [wallpaper, setWallpaperState] = useState("/placeholder.svg?height=1080&width=1920&text=Windows+11+Wallpaper")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("windows11-dark-mode")
    const savedWallpaper = localStorage.getItem("windows11-wallpaper")

    if (savedDarkMode) {
      setDarkModeState(JSON.parse(savedDarkMode))
    }

    if (savedWallpaper) {
      setWallpaperState(savedWallpaper)
    }
  }, [])

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled)
    localStorage.setItem("windows11-dark-mode", JSON.stringify(enabled))
  }

  const setWallpaper = (url: string) => {
    setWallpaperState(url)
    localStorage.setItem("windows11-wallpaper", url)
  }

  return (
    <SettingsContext.Provider value={{ darkMode, wallpaper, setDarkMode, setWallpaper }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
