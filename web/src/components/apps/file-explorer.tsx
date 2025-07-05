"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Folder,
  FileText,
  ImageIcon,
  Music,
  Video,
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  Trash2,
  FolderPlus,
  FileImage,
  FileIcon as FilePdf,
  ChevronRight,
} from "lucide-react"
import { useWindows } from "@/contexts/window-context"
import { useFileSystem, type FileItem } from "@/contexts/filesystem-context"
import ImageViewer from "./image-viewer"
import Notepad from "./notepad"
import { useSettings } from "@/contexts/settings-context"

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Folder":
      return Folder
    case "FileText":
      return FileText
    case "ImageIcon":
      return ImageIcon
    case "Music":
      return Music
    case "Video":
      return Video
    case "FilePdf":
      return FilePdf
    default:
      return FileText
  }
}

export default function FileExplorer() {
  const { darkMode } = useSettings()
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [navigationHistory, setNavigationHistory] = useState<(string | null)[]>([null])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })
  const [showCreateDialog, setShowCreateDialog] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemUrl, setNewItemUrl] = useState("")

  const { openWindow } = useWindows()
  const { files, addFile, deleteFile, getFilesInFolder } = useFileSystem()

  const fileExplorerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible) {
        setContextMenu({ x: 0, y: 0, visible: false })
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [contextMenu.visible])

  const getCurrentFolderName = () => {
    if (!currentFolderId) return "Denne PC"
    const folder = files.find((f) => f.id === currentFolderId)
    return folder ? folder.name : "Ukendt mappe"
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    let folderId = currentFolderId

    while (folderId) {
      const folder = files.find((f) => f.id === folderId)
      if (folder) {
        breadcrumbs.unshift(folder)
        folderId = folder.parentId || null
      } else {
        break
      }
    }

    return breadcrumbs
  }

  const getCurrentFiles = () => {
    return getFilesInFolder(currentFolderId)
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    const newHistory = navigationHistory.slice(0, historyIndex + 1)
    newHistory.push(folderId)
    setNavigationHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setSelectedItem(null)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentFolderId(navigationHistory[historyIndex - 1])
      setSelectedItem(null)
    }
  }

  const goForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentFolderId(navigationHistory[historyIndex + 1])
      setSelectedItem(null)
    }
  }

  const goHome = () => {
    navigateToFolder(null)
  }

  const handleRightClick = (e: React.MouseEvent, fileId?: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedItem(fileId || null)
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    })
  }

  const createNewItem = (type: string) => {
    if (!newItemName.trim()) return

    switch (type) {
      case "folder":
        addFile({
          name: newItemName,
          type: "folder",
          icon: "Folder",
          parentId: currentFolderId || undefined,
        })
        break
      case "textfile":
        addFile({
          name: newItemName.endsWith(".txt") ? newItemName : `${newItemName}.txt`,
          type: "file",
          icon: "FileText",
          size: "0 KB",
          content: "",
          parentId: currentFolderId || undefined,
        })
        break
      case "image":
        if (!newItemUrl.trim()) return
        addFile({
          name: newItemName.includes(".") ? newItemName : `${newItemName}.jpg`,
          type: "file",
          icon: "ImageIcon",
          size: "? KB",
          url: newItemUrl,
          parentId: currentFolderId || undefined,
        })
        break
      case "pdf":
        if (!newItemUrl.trim()) return
        addFile({
          name: newItemName.endsWith(".pdf") ? newItemName : `${newItemName}.pdf`,
          type: "file",
          icon: "FilePdf",
          size: "? KB",
          url: newItemUrl,
          parentId: currentFolderId || undefined,
        })
        break
      default:
        return
    }

    setShowCreateDialog(null)
    setNewItemName("")
    setNewItemUrl("")
    setContextMenu({ x: 0, y: 0, visible: false })
  }

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      navigateToFolder(file.id)
    } else if (file.icon === "ImageIcon" && file.url) {
      openWindow({
        title: `Billedviser - ${file.name}`,
        component: <ImageViewer imageUrl={file.url} imageName={file.name} />,
        position: { x: 100, y: 100 },
        size: { width: 800, height: 600 },
      })
    } else if (file.icon === "FileText") {
      // Åbn tekstfil i Notepad med filens indhold
      openWindow({
        title: `Notepad - ${file.name}`,
        component: <Notepad fileId={file.id} />,
        position: { x: 150, y: 150 },
        size: { width: 600, height: 400 },
      })
    } else if (file.url) {
      window.open(file.url, "_blank")
    } else if (file.content !== undefined) {
      alert(`Indhold af ${file.name}:\n\n${file.content}`)
    }
  }

  const currentFiles = getCurrentFiles()
  const breadcrumbs = getBreadcrumbs()

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`} ref={fileExplorerRef}>
      {/* Toolbar */}
      <div
        className={`border-b p-2 flex items-center space-x-2 ${
          darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <Button variant="ghost" size="sm" onClick={goBack} disabled={historyIndex <= 0}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={goForward} disabled={historyIndex >= navigationHistory.length - 1}>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={goHome}>
          <Home className="w-4 h-4" />
        </Button>

        {/* Breadcrumb Navigation */}
        <div
          className={`flex-1 rounded px-3 py-1 text-sm flex items-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <button onClick={goHome} className="hover:underline">
            Denne PC
          </button>
          {breadcrumbs.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="hover:underline"
                disabled={index === breadcrumbs.length - 1}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center rounded px-3 py-1 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <Search className={`w-4 h-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder="Søg"
            className={`bg-transparent text-sm outline-none w-32 ${
              darkMode ? "text-white placeholder-gray-400" : "text-black placeholder-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={`w-48 border-r p-2 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">Hurtig adgang</div>
            <button
              onClick={goHome}
              className="w-full flex items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-100 rounded"
            >
              <Home className="w-4 h-4" />
              <span>Denne PC</span>
            </button>
            {files
              .filter((f) => f.type === "folder" && !f.parentId)
              .map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => navigateToFolder(folder.id)}
                  className="w-full flex items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  <Folder className="w-4 h-4" />
                  <span>{folder.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* File List */}
        <div
          className={`flex-1 p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          onContextMenu={(e) => handleRightClick(e)}
        >
          {currentFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Folder className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Tom mappe</p>
              <p className="text-sm text-center">Højreklik for at oprette filer eller mapper</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {currentFiles.map((file) => {
                const FileIcon = getIconComponent(file.icon)
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedItem(file.id)}
                    onContextMenu={(e) => handleRightClick(e, file.id)}
                    onDoubleClick={() => handleDoubleClick(file)}
                    className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer ${
                      selectedItem === file.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <FileIcon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{file.name}</div>
                    </div>
                    {file.size && <div className="text-xs text-gray-500">{file.size}</div>}
                    <div className="text-xs text-gray-500">{file.modified}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-[9999] min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {!selectedItem ? (
            // Context menu for empty space
            <>
              <button
                onClick={() => setShowCreateDialog("folder")}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-blue-600" />
                <span>Ny mappe</span>
              </button>
              <button
                onClick={() => setShowCreateDialog("textfile")}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Ny tekstfil</span>
              </button>
              <button
                onClick={() => setShowCreateDialog("image")}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <FileImage className="w-4 h-4 text-blue-600" />
                <span>Tilføj billede</span>
              </button>
              <button
                onClick={() => setShowCreateDialog("pdf")}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <FilePdf className="w-4 h-4 text-blue-600" />
                <span>Tilføj PDF</span>
              </button>
            </>
          ) : (
            // Context menu for selected file/folder
            <>
              <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                {currentFiles.find((f) => f.id === selectedItem)?.name}
              </div>
              <button
                onClick={() => {
                  const file = currentFiles.find((f) => f.id === selectedItem)
                  if (file) {
                    handleDoubleClick(file)
                  }
                  setContextMenu({ x: 0, y: 0, visible: false })
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Åbn</span>
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  if (selectedItem) {
                    const confirmDelete = confirm(
                      `Er du sikker på at du vil slette "${currentFiles.find((f) => f.id === selectedItem)?.name}"?`,
                    )
                    if (confirmDelete) {
                      deleteFile(selectedItem)
                      setSelectedItem(null)
                    }
                  }
                  setContextMenu({ x: 0, y: 0, visible: false })
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Slet</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {showCreateDialog === "folder" && "Opret ny mappe"}
              {showCreateDialog === "textfile" && "Opret ny tekstfil"}
              {showCreateDialog === "image" && "Tilføj billede"}
              {showCreateDialog === "pdf" && "Tilføj PDF"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Navn</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={
                    showCreateDialog === "folder"
                      ? "Mappenavn"
                      : showCreateDialog === "textfile"
                        ? "Filnavn.txt"
                        : showCreateDialog === "image"
                          ? "billede.jpg"
                          : "dokument.pdf"
                  }
                />
              </div>

              {(showCreateDialog === "image" || showCreateDialog === "pdf") && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {showCreateDialog === "image" ? "Billede URL" : "PDF URL"}
                  </label>
                  <input
                    type="url"
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/fil.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Eksempel: https://picsum.photos/800/600 (tilfældigt billede)
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(null)
                  setNewItemName("")
                  setNewItemUrl("")
                }}
              >
                Annuller
              </Button>
              <Button onClick={() => createNewItem(showCreateDialog)}>Opret</Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div
        className={`border-t px-4 py-1 text-xs flex justify-between ${
          darkMode ? "border-gray-700 text-gray-400 bg-gray-900" : "border-gray-200 text-gray-500 bg-white"
        }`}
      >
        <span>{currentFiles.length} elementer</span>
        <span>{selectedItem ? `Valgt: ${currentFiles.find((f) => f.id === selectedItem)?.name}` : ""}</span>
      </div>
    </div>
  )
}
