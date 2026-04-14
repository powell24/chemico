import { AppSidebar, SidebarInset, SidebarTrigger } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="text-sm text-muted-foreground">The Chemico Group</span>
        </header>
        <main className="flex-1 bg-muted p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
