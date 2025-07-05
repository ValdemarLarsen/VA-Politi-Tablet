"use client"

import { useWindows } from "@/contexts/window-context"
import Window from "./window"

export default function WindowManager() {
  const { windows } = useWindows()

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
    </>
  )
}
