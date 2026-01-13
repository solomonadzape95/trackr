"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, HardDrive, Ticket, Wrench, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AuthPayload } from "@/lib/auth"
import { HelpDialog } from "@/components/help-dialog"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  session: AuthPayload & { userId?: string }
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // Mobile menu
  const [isCollapsed, setIsCollapsed] = useState(false) // Desktop collapse

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

  const isAdmin = ["ADMIN", "IT_OFFICER"].includes(session.role)
  const isStaff = session.role === "STAFF"

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      href: "/tickets",
      label: "Tickets",
      icon: Ticket,
      show: true,
    },
    {
      href: "/assets",
      label: "Assets",
      icon: HardDrive,
      show: true, // All users can view assets (staff read-only, admin/officer can manage)
    },
    {
      href: "/maintenance",
      label: "Maintenance",
      icon: Wrench,
      show: isAdmin,
    },
  ]

  const filteredItems = navItems.filter((item) => item.show)

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    // On mobile, always show labels when sidebar is open (not collapsed)
    const showLabel = !isCollapsed || isOpen
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground font-semibold"
            : "text-sidebar-foreground hover:bg-sidebar-accent",
          isCollapsed && !isOpen && "justify-center"
        )}
        onClick={() => setIsOpen(false)}
        title={!showLabel ? label : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {showLabel && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-40 md:hidden p-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg text-sidebar-foreground">
          Trackr
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-sidebar-foreground">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 md:z-0 md:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // On mobile, always show full width when open; on desktop, respect collapsed state
          isOpen ? "w-64" : isCollapsed ? "w-16" : "w-64",
          "md:static md:w-64",
          isCollapsed && "md:w-16"
        )}
      >
        {/* Header */}
        <div className={cn("p-6 border-b border-sidebar-border", isCollapsed && !isOpen && "p-4")}>
          {!isCollapsed || isOpen ? (
            <div>
              <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">Trackr</h1>
              <p className="text-xs text-sidebar-foreground/60 mt-1">IT Helpdesk & Assets</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <h1 className="text-xl font-bold text-sidebar-foreground">T</h1>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button (Desktop only) */}
        <div className="hidden md:flex justify-end p-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("space-y-2 p-4", isCollapsed && !isOpen && "px-2")}>
          {filteredItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>

        {/* Help and Theme Toggle */}
        <div className={cn("px-4 pb-2 flex gap-2", isCollapsed && !isOpen && "px-2 flex-col")}>
          <div className={cn("flex", isCollapsed && !isOpen && "justify-center")}>
            <HelpDialog />
          </div>
          <div className={cn("flex", isCollapsed && !isOpen && "justify-center")}>
            <ThemeToggle />
          </div>
        </div>

        {/* Footer */}
        <div className={cn("absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar", isCollapsed && !isOpen && "p-2")}>
          {!isCollapsed || isOpen ? (
            <>
              <div className="mb-4 text-xs">
                <p className="text-sidebar-foreground/60">Signed in as</p>
                <p className="font-semibold text-sidebar-foreground truncate">{session.email}</p>
                <p className="text-sidebar-foreground/60 text-xs mt-1 capitalize">
                  {session.role.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
              <LogoutButton />
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-foreground">
                {session.email.charAt(0).toUpperCase()}
              </div>
              <LogoutButton isCollapsed={true} />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}

function LogoutButton({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="w-full gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
