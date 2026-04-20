"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  FileText,
  MapPin,
  BarChart3,
  Settings,
  FlaskConical,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SignOutButton } from "@/components/signout-button"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Copilot",  href: "/copilot",   icon: Bot },
  { label: "Documents",  href: "/documents",  icon: FileText },
  { label: "Sites",      href: "/sites",      icon: MapPin },
  { label: "Reports",    href: "/reports",    icon: BarChart3 },
  { label: "Settings",   href: "/settings",   icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3 group-data-[state=collapsed]:px-1">
        {/* Expanded layout */}
        <div className="flex items-center justify-between gap-2 group-data-[state=collapsed]:hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full border border-sidebar-border bg-sidebar-primary flex items-center justify-center shrink-0">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-white leading-none">Compliance Copilot</span>
          </div>
          <SidebarTrigger
            className="shrink-0 cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title="Toggle Sidebar"
          />
        </div>
        {/* Collapsed layout */}
        <div className="hidden flex-col items-center gap-1.5 group-data-[state=collapsed]:flex">
          <SidebarTrigger
            className="shrink-0 cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title="Toggle Sidebar"
          />
          <div className="h-8 w-8 rounded-full border border-sidebar-border bg-sidebar-primary flex items-center justify-center">
            <FlaskConical className="h-4 w-4 text-white" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4 group-data-[state=collapsed]:px-1">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className="flex items-center gap-3 overflow-hidden group-data-[state=collapsed]:hidden">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              CG
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-xs font-medium text-sidebar-foreground leading-none">Chemico Group</span>
            <span className="text-xs text-sidebar-foreground/50 leading-none mt-0.5">EH&S Team</span>
          </div>
        </div>
        <div className="mt-3 group-data-[state=collapsed]:mt-0">
          <SignOutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export { SidebarInset, SidebarTrigger }
