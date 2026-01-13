import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata = {
  title: "Dashboard - Trackr",
  description: "IT Helpdesk Dashboard",
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch dashboard data based on role
  let activeTickets = 0
  let pendingRepairs = 0
  let totalAssets = 0
  let recentActivity: any[] = []

  if (session.role === "ADMIN" || session.role === "IT_OFFICER") {
    // Admin and IT Officers see all data
    activeTickets = await prisma.ticket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    })

    pendingRepairs = await prisma.maintenanceLog.count({
      where: { testResult: "Fail" },
    })

    totalAssets = await prisma.asset.count()

    recentActivity = await prisma.maintenanceLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { asset: true, user: true },
    })
  } else {
    // Staff only see their own tickets
    activeTickets = await prisma.ticket.count({
      where: {
        reportedBy: session.userId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    })

    totalAssets = await prisma.asset.count()

    recentActivity = await prisma.ticket.findMany({
      where: { reportedBy: session.userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { asset: true, user: true },
    })
  }

  return (
    <DashboardContent
      session={session}
      activeTickets={activeTickets}
      pendingRepairs={pendingRepairs}
      totalAssets={totalAssets}
      recentActivity={recentActivity}
    />
  )
}
