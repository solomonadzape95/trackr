"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import type { AuthPayload } from "@/lib/auth"

interface ProtectedLayoutClientProps {
  children: React.ReactNode
  session: AuthPayload & { userId?: string }
}

export function ProtectedLayoutClient({ children, session }: ProtectedLayoutClientProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar session={session} />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 min-h-full flex flex-col">{children}</main>
    </div>
  )
}
