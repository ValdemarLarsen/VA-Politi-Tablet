"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Volume2, Wifi, Monitor, Palette, Bell } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { Button } from "@/components/ui/button"

export default function Settings() {
  const { darkMode, wallpaper, setDarkMode, setWallpaper } = useSettings()
  const [volume, setVolume] = useState([50])
  const [brightness, setBrightness] = useState([75])
  const [notifications, setNotifications] = useState(true)
  const [bluetooth, setBluetooth] = useState(false)
  const [wifi, setWifi] = useState(true)
  const [wallpaperInput, setWallpaperInput] = useState(wallpaper)

  const handleWallpaperChange = () => {
    if (wallpaperInput.trim()) {
      setWallpaper(wallpaperInput.trim())
    }
  }

  const resetWallpaper = () => {
    const defaultWallpaper = "/placeholder.svg?height=1080&width=1920&text=Windows+11+Wallpaper"
    setWallpaper(defaultWallpaper)
    setWallpaperInput(defaultWallpaper)
  }

  const settingsCategories = [
    {
      title: "System",
      icon: Monitor,
      items: [
        {
          name: "Skærm og lysstyrke",
          description: "Juster skærmindstillinger",
          component: (
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Lysstyrke
                </label>
                <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} className="mt-2" />
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{brightness[0]}%</span>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Lyd",
      icon: Volume2,
      items: [
        {
          name: "Lydstyrke",
          description: "Juster systemlydstyrke",
          component: (
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Hovedlydstyrke
                </label>
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="mt-2" />
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{volume[0]}%</span>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Netværk",
      icon: Wifi,
      items: [
        {
          name: "Wi-Fi",
          description: "Administrer trådløse forbindelser",
          component: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Wi-Fi</span>
                <Switch checked={wifi} onCheckedChange={setWifi} />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Bluetooth</span>
                <Switch checked={bluetooth} onCheckedChange={setBluetooth} />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Personalisering",
      icon: Palette,
      items: [
        {
          name: "Farver og temaer",
          description: "Tilpas udseendet",
          component: (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Mørk tilstand
                </span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="space-y-3">
                <label className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Baggrundsbillede
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={wallpaperInput}
                    onChange={(e) => setWallpaperInput(e.target.value)}
                    placeholder="Indsæt link til billede..."
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleWallpaperChange}
                      size="sm"
                      disabled={!wallpaperInput.trim() || wallpaperInput === wallpaper}
                    >
                      Anvend baggrund
                    </Button>
                    <Button onClick={resetWallpaper} variant="outline" size="sm">
                      Nulstil
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Forhåndsvisning:</span>
                  <div
                    className="w-full h-20 rounded border bg-cover bg-center"
                    style={{ backgroundImage: `url('${wallpaper}')` }}
                  />
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Notifikationer",
      icon: Bell,
      items: [
        {
          name: "Notifikationer og handlinger",
          description: "Administrer notifikationer",
          component: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Notifikationer
                </span>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          ),
        },
      ],
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedItem, setSelectedItem] = useState(0)

  return (
    <div className={`h-full flex ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r p-4 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Indstillinger</h2>
        <div className="space-y-2">
          {settingsCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedCategory(index)
                setSelectedItem(0)
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                selectedCategory === index
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : darkMode
                    ? "hover:bg-gray-800 text-gray-200"
                    : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Category Items */}
        <div className={`w-80 border-r p-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            {settingsCategories[selectedCategory].title}
          </h3>
          <div className="space-y-2">
            {settingsCategories[selectedCategory].items.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedItem(index)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedItem === index
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : darkMode
                      ? "hover:bg-gray-700 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="font-medium">{item.name}</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="flex-1 p-6">
          <h4 className={`text-xl font-semibold mb-6 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            {settingsCategories[selectedCategory].items[selectedItem].name}
          </h4>
          {settingsCategories[selectedCategory].items[selectedItem].component}
        </div>
      </div>
    </div>
  )
}
