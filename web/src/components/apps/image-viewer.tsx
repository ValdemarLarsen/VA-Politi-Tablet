"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, X } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"

interface ImageViewerProps {
  imageUrl: string
  imageName: string
  onClose?: () => void
}

export default function ImageViewer({ imageUrl, imageName, onClose }: ImageViewerProps) {
  const { darkMode } = useSettings()
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 500))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25))
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = imageName
    link.click()
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-900"}`}>
      {/* Toolbar */}
      <div
        className={`border-b p-2 flex items-center justify-between ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">{imageName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-white hover:bg-gray-700">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-white text-sm min-w-[60px] text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-white hover:bg-gray-700">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRotate} className="text-white hover:bg-gray-700">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-gray-700">
            <Download className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Image Display */}
      <div
        className={`flex-1 flex items-center justify-center overflow-auto p-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-900"
        }`}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={imageName}
          className="max-w-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            imageRendering: zoom > 100 ? "pixelated" : "auto",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=400&width=400&text=Billede+ikke+fundet"
          }}
        />
      </div>

      {/* Status Bar */}
      <div
        className={`border-t px-4 py-1 text-xs text-gray-300 flex justify-between ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-800 border-gray-700"
        }`}
      >
        <span>
          Zoom: {zoom}% | Rotation: {rotation}°
        </span>
        <span>{imageName}</span>
      </div>
    </div>
  )
}
