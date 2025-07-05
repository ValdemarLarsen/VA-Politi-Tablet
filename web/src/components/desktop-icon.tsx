"use client"

import type { LucideIcon } from "lucide-react"

interface DesktopIconProps {
  name: string
  icon: LucideIcon
  onClick: () => void
}

export default function DesktopIcon({ name, icon: Icon, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
      onDoubleClick={onClick}
    >
      <div className="w-12 h-12 flex items-center justify-center mb-1">
        <Icon className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
      <span className="text-white text-xs text-center drop-shadow-lg group-hover:bg-blue-600/50 px-1 rounded">
        {name}
      </span>
    </div>
  )
}
