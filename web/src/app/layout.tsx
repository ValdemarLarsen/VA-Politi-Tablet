"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HomeIcon, MoonIcon, UsersIcon } from "lucide-react"

//Sidebar
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

const links = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="w-5" />,
  },
  {
    label: "Players",
    href: "/players",
    icon: <UsersIcon className="w-5" />,
  },
]

export default function ClientLayout({ children }: Props) {
  const navigate = useNavigate()
  const routerState = useRouterState()

  useEffect(() => {
    if (routerState.location.pathname.endsWith("index.html")) {
      navigate({ to: "/" })
    }
  }, [routerState])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-5/6 w-5/6 flex-col rounded border border-border bg-background text-foreground overflow-hidden">
        <div className="flex-1 min-h-0">
          <SidebarProvider>
            <AppSidebar className="h-full" />
            <SidebarInset className="h-full">
              <div className="flex h-full flex-col">
                <div className="flex w-full items-center justify-between border-b border-border px-5 py-4 shrink-0">
                  <span className="text-lg font-bold">CFX NUI</span>
                  <Button size="sm" variant="outline">
                    <MoonIcon />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-5">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </div>
  )
}
