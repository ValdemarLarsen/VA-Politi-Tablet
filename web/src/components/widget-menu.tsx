"use client"
import { Button } from "@/components/ui/button"
import { Users, Clock, X, BarChart3, FileText, DollarSign, Wifi, User } from "lucide-react"
import { useWidgets } from "@/contexts/widget-context"
import { useSettings } from "@/contexts/settings-context"

interface WidgetMenuProps {
  onClose: () => void
}

const availableWidgets = [
  {
    type: "staff-status",
    title: "Medarbejder Status",
    description: "Se hvilke betjente der er på arbejde og deres status",
    icon: Users,
    defaultSize: { width: 320, height: 400 },
  },
  {
    type: "weekly-stats",
    title: "Ugentlig Statistik",
    description: "Oversigt over sager, bøder og statistik for denne uge",
    icon: BarChart3,
    defaultSize: { width: 300, height: 450 },
  },
  {
    type: "case-overview",
    title: "Sager Oversigt",
    description: "Se alle sager fra denne uge med status og prioritet",
    icon: FileText,
    defaultSize: { width: 350, height: 500 },
  },
  {
    type: "fine-summary",
    title: "Bøde Sammendrag",
    description: "Detaljeret oversigt over bøder og indtægter denne uge",
    icon: DollarSign,
    defaultSize: { width: 320, height: 400 },
  },
  {
    type: "network-status",
    title: "Netværksstatus",
    description: "Se din nuværende netværksforbindelse og sikkerhedsstatus",
    icon: Wifi,
    defaultSize: { width: 280, height: 380 },
  },
  {
    type: "user-profile",
    title: "Min Profil",
    description: "Se din profil, status og kontaktinformation",
    icon: User,
    defaultSize: { width: 280, height: 420 },
  },
]

export default function WidgetMenu({ onClose }: WidgetMenuProps) {
  const { darkMode } = useSettings()
  const { addWidget, widgets } = useWidgets()

  const handleAddWidget = (widgetType: (typeof availableWidgets)[0]) => {
    // Find a good position for the new widget
    const existingPositions = widgets.map((w) => ({ x: w.position.x, y: w.position.y }))
    let newX = 50
    let newY = 50

    // Simple positioning logic - offset from existing widgets
    while (existingPositions.some((pos) => Math.abs(pos.x - newX) < 50 && Math.abs(pos.y - newY) < 50)) {
      newX += 50
      newY += 50
      if (newX > window.innerWidth - 400) {
        newX = 50
        newY += 100
      }
    }

    addWidget({
      type: widgetType.type,
      title: widgetType.title,
      position: { x: newX, y: newY },
      size: widgetType.defaultSize,
      settings: {},
      isVisible: true,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Tilføj Widget</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Vælg en widget at tilføje til dit skrivebord
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Widget List */}
        <div className="p-4 max-h-96 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableWidgets.map((widget) => (
              <div
                key={widget.type}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handleAddWidget(widget)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <widget.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{widget.title}</h3>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{widget.description}</p>
                    <div className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      Størrelse: {widget.defaultSize.width}x{widget.defaultSize.height}px
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div
            className={`mt-6 p-4 rounded-lg border-2 border-dashed ${darkMode ? "border-gray-600" : "border-gray-300"}`}
          >
            <div className="text-center">
              <Clock className={`w-8 h-8 mx-auto mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              <h3 className={`font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Flere widgets kommer snart
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Vi arbejder på flere nyttige widgets til dit skrivebord
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
