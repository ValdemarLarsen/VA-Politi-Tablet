import type React from "react"
import { HomeIcon, UsersIcon, Settings, GalleryVerticalEnd } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"




//Søge felt tablet:
import { SearchFormTablet } from "@/components/search-form"


//user felt i bunden:
import { NavUser } from "@/components/nav-user"




// Menu items
const items = [
    {
        title: "Home",
        url: "/",
        icon: HomeIcon,
    },
    {
        title: "Personregister",
        url: "/personregister",
        icon: UsersIcon,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },

}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    return (
        <Sidebar className={`h-full ${className}`} {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="border-b-2 border-blue-500">
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <img src={`${import.meta.env.BASE_URL}ikoner/logo_dark.png`} alt="Logo" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Documentation</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SearchFormTablet />
            </SidebarHeader>
            <SidebarContent className="h-full">
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={currentPath === item.url}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
