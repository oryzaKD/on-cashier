"use client"

import { useState } from "react"

import type React from "react"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Sidebar, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  path: string
  currentPath: string
  onClick: () => void
}

export function SidebarItem({ icon: Icon, title, path, currentPath, onClick }: SidebarItemProps) {
  const isActive = currentPath === path

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} onClick={onClick} className="relative overflow-hidden group">
        <div className="flex items-center gap-2 z-10 relative">
          <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-primary-foreground" : ""}`} />
          <span className={`transition-all duration-300 ${isActive ? "font-medium" : ""}`}>{title}</span>
        </div>

        {/* Background highlight for active state */}
        {isActive && (
          <motion.div
            layoutId="sidebar-highlight"
            className="absolute inset-0 bg-primary z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Left indicator bar */}
        {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-primary-foreground rounded-r-md" />}

        {/* Hover indicator - only shows on non-active items */}
        {!isActive && (
          <div className="absolute inset-0 bg-sidebar-accent/0 transition-all duration-300 group-hover:bg-sidebar-accent/80 z-0" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function CustomSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        {children}
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

export function useSidebarNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location])

  return { currentPath, navigate }
}
