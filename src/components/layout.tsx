"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, ShoppingCart, Package, Receipt, Users, Settings, LogOut, Bot } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import AiAssistant from "@/components/ai-assistant"

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("/")

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location])

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Point of Sale", icon: ShoppingCart, path: "/pos" },
    { title: "Inventory", icon: Package, path: "/inventory" },
    { title: "Transactions", icon: Receipt, path: "/transactions" },
    { title: "Customers", icon: Users, path: "/customers" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex flex-col gap-0 px-3 py-2">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div className="font-semibold">AI Cashier</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={currentPath === item.path} onClick={() => navigate(item.path)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAiOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Bot className="h-4 w-4" />
                </Button>
                <ModeToggle />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex-1">
          <Outlet />
        </SidebarInset>
      </div>
      <AiAssistant open={isAiOpen} onOpenChange={setIsAiOpen} />
    </SidebarProvider>
  )
}
