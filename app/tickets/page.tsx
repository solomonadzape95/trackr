import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { TicketsContent } from "@/components/tickets/tickets-content"
import { ProtectedLayout } from "@/components/protected-layout"

export const metadata = {
  title: "Tickets - Trackr",
  description: "IT Support Ticketing System",
}

export default async function TicketsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  let tickets
  if (session.role === "STAFF") {
    // Staff see only their own tickets
    tickets = await prisma.ticket.findMany({
      where: { reportedBy: session.userId },
      include: { user: true, asset: true },
      orderBy: { createdAt: "desc" },
    })
  } else {
    // Admin and IT Officer see all tickets
    tickets = await prisma.ticket.findMany({
      include: { user: true, asset: true },
      orderBy: { createdAt: "desc" },
    })
  }

  const assets = await prisma.asset.findMany({ orderBy: { assetTag: "asc" } })

  return (
    <ProtectedLayout>
      <TicketsContent session={session} tickets={tickets} assets={assets} />
    </ProtectedLayout>
  )
}
