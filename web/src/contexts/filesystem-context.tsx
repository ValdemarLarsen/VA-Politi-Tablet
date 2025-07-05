"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  icon: string
  size?: string
  modified: string
  url?: string
  content?: string
  parentId?: string
}

interface FileSystemContextType {
  files: FileItem[]
  addFile: (file: Omit<FileItem, "id" | "modified">) => void
  updateFile: (id: string, updates: Partial<FileItem>) => void
  deleteFile: (id: string) => void
  getFile: (id: string) => FileItem | undefined
  getFilesInFolder: (folderId: string | null) => FileItem[]
  getFolders: () => FileItem[]
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const defaultFiles: FileItem[] = [
    { id: "1", name: "Dokumenter", type: "folder", icon: "Folder", modified: "15/12/2024" },
    { id: "2", name: "Billeder", type: "folder", icon: "Folder", modified: "15/12/2024" },
    { id: "3", name: "Musik", type: "folder", icon: "Folder", modified: "15/12/2024" },
    { id: "4", name: "Videoer", type: "folder", icon: "Folder", modified: "15/12/2024" },
    { id: "5", name: "Downloads", type: "folder", icon: "Folder", modified: "15/12/2024" },
    {
      id: "6",
      name: "Velkommen.txt",
      type: "file",
      icon: "FileText",
      size: "1 KB",
      modified: "15/12/2024",
      content:
        "Velkommen til File Explorer!\n\nDu kan:\n- Dobbeltklik på mapper for at åbne dem\n- Højreklik for at oprette nye filer og mapper\n- Dobbeltklik på billeder for at åbne dem i billedviseren\n- Gemme filer fra Notepad direkte til File Explorer\n\nAlle dine filer gemmes automatisk!",
    },
    {
      id: "7",
      name: "Eksempel-billede.jpg",
      type: "file",
      icon: "ImageIcon",
      size: "1.2 MB",
      modified: "14/12/2024",
      url: "/placeholder.svg?height=600&width=800&text=Eksempel+Billede",
      parentId: "2",
    },
    {
      id: "8",
      name: "Natur.jpg",
      type: "file",
      icon: "ImageIcon",
      size: "2.1 MB",
      modified: "13/12/2024",
      url: "https://picsum.photos/800/600?random=1",
      parentId: "2",
    },
  ]

  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem("file-explorer-files")
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles))
      } else {
        setFiles(defaultFiles)
        localStorage.setItem("file-explorer-files", JSON.stringify(defaultFiles))
      }
    } catch (error) {
      console.error("Error loading files from localStorage:", error)
      setFiles(defaultFiles)
    }
  }, [])

  useEffect(() => {
    if (files.length > 0) {
      try {
        localStorage.setItem("file-explorer-files", JSON.stringify(files))
      } catch (error) {
        console.error("Error saving files to localStorage:", error)
      }
    }
  }, [files])

  const addFile = (fileData: Omit<FileItem, "id" | "modified">) => {
    const newFile: FileItem = {
      ...fileData,
      id: Date.now().toString(),
      modified: new Date().toLocaleDateString("da-DK"),
    }
    setFiles((prev) => [...prev, newFile])
  }

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              ...updates,
              modified: new Date().toLocaleDateString("da-DK"),
            }
          : file,
      ),
    )
  }

  const deleteFile = (id: string) => {
    const itemsToDelete = [id]
    const findChildItems = (parentId: string) => {
      files.forEach((file) => {
        if (file.parentId === parentId) {
          itemsToDelete.push(file.id)
          if (file.type === "folder") {
            findChildItems(file.id)
          }
        }
      })
    }

    const itemToDelete = files.find((f) => f.id === id)
    if (itemToDelete?.type === "folder") {
      findChildItems(id)
    }

    setFiles((prev) => prev.filter((file) => !itemsToDelete.includes(file.id)))
  }

  const getFile = (id: string) => {
    return files.find((file) => file.id === id)
  }

  const getFilesInFolder = (folderId: string | null) => {
    return files.filter((file) => file.parentId === folderId)
  }

  const getFolders = () => {
    return files.filter((file) => file.type === "folder")
  }

  return (
    <FileSystemContext.Provider
      value={{
        files,
        addFile,
        updateFile,
        deleteFile,
        getFile,
        getFilesInFolder,
        getFolders,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}
