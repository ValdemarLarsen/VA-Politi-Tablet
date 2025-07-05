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
      <div className="flex h-[90%] w-[90%] flex-col rounded border text-foreground border-border overflow-hidden">



        {children}



      </div>
    </div>
  )
}
