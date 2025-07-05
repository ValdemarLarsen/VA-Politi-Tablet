"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save, FileText, Printer, FolderOpen } from "lucide-react"
import { useFileSystem } from "@/contexts/filesystem-context"

interface NotepadProps {
  fileId?: string
}

export default function Notepad({ fileId }: NotepadProps) {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState("Untitled.txt")
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveFileName, setSaveFileName] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(true)
  const [darkMode, setDarkMode] = useState(false) // Assuming dark mode is toggled elsewhere

  const { addFile, updateFile, getFile, getFolders } = useFileSystem()

  // Track changes to mark as unsaved
  useEffect(() => {
    setIsSaved(false)
  }, [content])

  // Load file on mount if fileId is provided
  useEffect(() => {
    if (fileId) {
      const file = getFile(fileId)
      if (file && file.content !== undefined) {
        setContent(file.content)
        setFileName(file.name)
        setCurrentFileId(fileId)
        setIsSaved(true)
      }
    }
  }, [fileId, getFile])

  const handleSave = () => {
    if (currentFileId) {
      // Update existing file
      updateFile(currentFileId, { content })
      setIsSaved(true)
    } else {
      // Show save dialog for new file
      setSaveFileName(fileName.replace(".txt", ""))
      setShowSaveDialog(true)
    }
  }

  const handleSaveAs = () => {
    setSaveFileName(fileName.replace(".txt", ""))
    setShowSaveDialog(true)
  }

  const confirmSave = () => {
    if (!saveFileName.trim()) return

    const finalFileName = saveFileName.endsWith(".txt") ? saveFileName : `${saveFileName}.txt`
    const fileSize = `${Math.ceil(content.length / 1024)} KB`

    if (currentFileId) {
      // Update existing file
      updateFile(currentFileId, {
        name: finalFileName,
        content,
        size: fileSize,
        parentId: selectedFolderId || undefined,
      })
    } else {
      // Create new file
      addFile({
        name: finalFileName,
        type: "file",
        icon: "FileText",
        size: fileSize,
        content,
        parentId: selectedFolderId || undefined,
      })
    }

    setFileName(finalFileName)
    setIsSaved(true)
    setShowSaveDialog(false)
    setSaveFileName("")
    setSelectedFolderId(null)
  }

  const handleNew = () => {
    if (!isSaved) {
      const shouldDiscard = confirm("Du har ikke-gemte ændringer. Vil du kassere dem?")
      if (!shouldDiscard) return
    }

    setContent("")
    setFileName("Untitled.txt")
    setCurrentFileId(null)
    setIsSaved(true)
  }

  const folders = getFolders()

  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return "Denne PC"
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return "Ukendt mappe"

    if (folder.parentId) {
      return `${getFolderPath(folder.parentId)} > ${folder.name}`
    }
    return folder.name
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Menu Bar */}
      <div
        className={`border-b p-2 flex items-center justify-between ${
          darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleNew}>
            <FileText className="w-4 h-4 mr-1" />
            Ny
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Gem
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveAs}>
            <FolderOpen className="w-4 h-4 mr-1" />
            Gem som
          </Button>
          <Button variant="ghost" size="sm">
            <Printer className="w-4 h-4 mr-1" />
            Udskriv
          </Button>
        </div>

        {/* File status */}
        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {fileName} {!isSaved && "*"}
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`flex-1 p-4 resize-none outline-none font-mono text-sm ${
          darkMode ? "bg-gray-800 text-white placeholder-gray-400" : "bg-white text-black placeholder-gray-500"
        }`}
        placeholder="Skriv din tekst her..."
      />

      {/* Status Bar */}
      <div
        className={`border-t px-4 py-1 text-xs flex justify-between ${
          darkMode ? "border-gray-700 text-gray-400 bg-gray-900" : "border-gray-200 text-gray-500 bg-white"
        }`}
      >
        <span>Linje 1, Kolonne 1</span>
        <span>
          {content.length} tegn | {isSaved ? "Gemt" : "Ikke gemt"}
        </span>
      </div>

      {/* Save Dialog - also needs dark mode */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}>Gem fil</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filnavn</label>
                <input
                  type="text"
                  value={saveFileName}
                  onChange={(e) => setSaveFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Min fil"
                />
                <p className="text-xs text-gray-500 mt-1">.txt tilføjes automatisk</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gem i mappe</label>
                <select
                  value={selectedFolderId || ""}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Denne PC (rod)</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {getFolderPath(folder.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Gem som:</strong> {saveFileName || "Min fil"}.txt
                <br />
                <strong>I mappe:</strong> {getFolderPath(selectedFolderId)}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveFileName("")
                  setSelectedFolderId(null)
                }}
              >
                Annuller
              </Button>
              <Button onClick={confirmSave} disabled={!saveFileName.trim()}>
                Gem
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
