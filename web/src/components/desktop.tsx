"use client"

import { useState } from "react"
import { useWindows } from "@/contexts/window-context"
import DesktopIcon from "./desktop-icon"
import Calculator from "./apps/calculator"
import Notepad from "./apps/notepad"
import Settings from "./apps/settings"
import FileExplorer from "./apps/file-explorer"
import PersonRegister from "./apps/person-register"
import IncidentReport from "./apps/incident-report"
import WidgetManager from "./widgets/widget-manager"
import WidgetMenu from "./widget-menu"
import { CalculatorIcon as CalcIcon, FileText, SettingsIcon, Folder, Users, Plus } from "lucide-react"

export default function Desktop() {
  const { openWindow } = useWindows()
  const [showWidgetMenu, setShowWidgetMenu] = useState(false)

  const desktopIcons = [
    {
      name: "Calculator",
      icon: CalcIcon,
      onClick: () =>
        openWindow({
          title: "Calculator",
          component: <Calculator />,
          position: { x: 100, y: 100 },
          size: { width: 320, height: 500 },
        }),
    },
    {
      name: "Notepad",
      icon: FileText,
      onClick: () =>
        openWindow({
          title: "Notepad",
          component: <Notepad />,
          position: { x: 150, y: 150 },
          size: { width: 600, height: 400 },
        }),
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      onClick: () =>
        openWindow({
          title: "Settings",
          component: <Settings />,
          position: { x: 200, y: 200 },
          size: { width: 800, height: 600 },
        }),
    },
    {
      name: "File Explorer",
      icon: Folder,
      onClick: () =>
        openWindow({
          title: "File Explorer",
          component: <FileExplorer />,
          position: { x: 250, y: 250 },
          size: { width: 700, height: 500 },
        }),
    },
    {
      name: "Personregister",
      icon: Users,
      onClick: () =>
        openWindow({
          title: "Personregister",
          component: <PersonRegister />,
          position: { x: 300, y: 300 },
          size: { width: 1000, height: 700 },
        }),
    },
    {
      name: "Hændelsesrapport",
      icon: FileText,
      onClick: () =>
        openWindow({
          title: "Hændelsesrapport",
          component: <IncidentReport />,
          position: { x: 350, y: 50 },
          size: { width: 1400, height: 900 },
        }),
    },
  ]

  return (
    <div className="absolute inset-0 p-4">
      {/* Desktop Icons */}
      <div className="grid grid-cols-1 gap-4 w-fit">
        {desktopIcons.map((icon, index) => (
          <DesktopIcon key={index} name={icon.name} icon={icon.icon} onClick={icon.onClick} />
        ))}
      </div>

      {/* Widget Add Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowWidgetMenu(true)}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/20"
          title="Tilføj Widget"
        >
          <Plus className="w-6 h-6 text-white drop-shadow-lg" />
        </button>
      </div>

      {/* Widgets */}
      <WidgetManager />

      {/* Widget Menu */}
      {showWidgetMenu && <WidgetMenu onClose={() => setShowWidgetMenu(false)} />}
    </div>
  )
}
