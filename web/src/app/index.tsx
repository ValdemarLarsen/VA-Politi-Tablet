import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import Taskbar from "@/components/taskbar"
import StartMenu from "@/components/start-menu"
import WindowManager from "@/components/window-manager"
import BootScreen from "@/components/boot-screen"
import { WindowProvider } from "@/contexts/window-context"
import { SettingsProvider, useSettings } from "@/contexts/settings-context"
import { FileSystemProvider } from "@/contexts/filesystem-context"
import { WidgetProvider } from "@/contexts/widget-context"


export default function Windows11Desktop() {
  return (
    <SettingsProvider>
      <FileSystemProvider>
        <WindowProvider>
          <WidgetProvider>
            <DesktopContent />
          </WidgetProvider>
        </WindowProvider>
      </FileSystemProvider>
    </SettingsProvider>
  )
}

function DesktopContent() {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isBooting, setIsBooting] = useState(true)
  const { darkMode, wallpaper } = useSettings()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleBootComplete = () => {
    console.log("🚀 Boot complete - Starting desktop!")
    setIsBooting(false)
  }

  if (isBooting) {
    return <BootScreen onBootComplete={handleBootComplete} />
  }

  return (
    <div className={`h-full w-full overflow-hidden relative ${darkMode ? "dark" : ""}`}>
      {/* Windows 11 Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${wallpaper}')`,
        }}
      />

      {/* Desktop */}
      <Desktop />

      {/* Window Manager */}
      <WindowManager />

      {/* Start Menu */}
      {showStartMenu && <StartMenu onClose={() => setShowStartMenu(false)} />}

      {/* Taskbar */}
      <Taskbar onStartClick={() => setShowStartMenu(!showStartMenu)} currentTime={currentTime} />
    </div>
  )
}