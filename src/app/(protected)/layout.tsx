import { AppSidebar, SidebarInset, SidebarTrigger } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-6">
        </header>
        <main className="flex-1 bg-muted p-6 [contain:paint_layout]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
