"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { MoonIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const navigate = useNavigate()
  const routerState = useRouterState()
  





  useEffect(() => {
    if (routerState.location.pathname.endsWith("index.html")) {
      navigate({ to: "/" })
    }
  }, [routerState])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-[90%] w-[90%] flex-col rounded border border-border bg-background text-foreground overflow-hidden">
        <SidebarProvider>
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <AppSidebar className="h-full" />
            <SidebarInset className="flex-1 min-h-0 flex flex-col">
              {/* Header */}
              <div className="shrink-0 border-b border-border px-5 py-4 flex items-center justify-between">
                <span className="text-lg font-bold">CFX NUI</span>
                <Button size="sm" variant="outline">
                  <MoonIcon />
                </Button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 min-h-0 overflow-auto p-3">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
