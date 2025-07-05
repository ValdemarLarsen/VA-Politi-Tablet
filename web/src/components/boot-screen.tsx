"use client"

import { useState, useEffect } from "react"
import { Shield } from "lucide-react"

interface BootScreenProps {
  onBootComplete: () => void
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("Starter system...")

  const messages = [
    "Starter system...",
    "Indlæser Windows 11 Pro...",
    "Opretter forbindelse til netværk...",
    "Synkroniserer database...",
    "Indlæser politi-applikationer...",
    "Færdiggør opstart...",
    "System klar!",
  ]

  useEffect(() => {
    const totalTime = 7000 // 7 sekunder
    const interval = 100 // Opdater hver 100ms
    const increment = (100 / totalTime) * interval

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment

        // Opdater besked baseret på progress
        const messageIndex = Math.floor((newProgress / 100) * (messages.length - 1))
        setCurrentMessage(messages[Math.min(messageIndex, messages.length - 1)])

        if (newProgress >= 100) {
          clearInterval(progressTimer)
          // Vent lidt og så kald onBootComplete
          setTimeout(() => {
            onBootComplete()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(progressTimer)
  }, [onBootComplete])

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Politi System</h1>
            <p className="text-blue-200 text-sm">Windows 11 Pro</p>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">{currentMessage}</h2>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-500 transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-300">{Math.round(progress)}%</div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-8 text-xs text-gray-400 space-y-1">
        <p>Politi System v2024.1</p>
        <p>Build 22621.2715</p>
        <p>© 2024 Politi Danmark</p>
      </div>

      <div className="absolute bottom-8 right-8 text-xs text-gray-400 text-right space-y-1">
        <p>Sikker forbindelse</p>
        <p>Krypteret session</p>
      </div>
    </div>
  )
}
