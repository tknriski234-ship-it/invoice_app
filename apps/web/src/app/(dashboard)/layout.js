import { AppSidebar } from "@/features/dashboard/components/dashboardSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center px-4">
          <SidebarTrigger />
        </header>

        <main className="p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}