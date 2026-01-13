import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ProtectedLayout } from "@/components/protected-layout"

export const metadata = {
  title: "Dashboard - Trackr",
  description: "IT Helpdesk Dashboard",
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const isAdminOrOfficer = session.role === "ADMIN" || session.role === "IT_OFFICER"
  const isStaff = session.role === "STAFF"

  // Fetch dashboard data based on role
  let activeTickets = 0
  let resolvedTickets = 0
  let openTickets = 0
  let inProgressTickets = 0
  let pendingRepairs = 0
  let totalAssets = 0
  let recentTickets: any[] = []
  let recentMaintenance: any[] = []
  let myTickets: any[] = []
  let departmentAssets: any[] = []

  if (isAdminOrOfficer) {
    // Admin and IT Officers see all data
    activeTickets = await prisma.ticket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    })

    openTickets = await prisma.ticket.count({
      where: { status: "OPEN" },
    })

    inProgressTickets = await prisma.ticket.count({
      where: { status: "IN_PROGRESS" },
    })

    resolvedTickets = await prisma.ticket.count({
      where: { status: "RESOLVED" },
    })

    pendingRepairs = await prisma.maintenanceLog.count({
      where: { testResult: "Fail" },
    })

    totalAssets = await prisma.asset.count()

    recentTickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, asset: true },
    })

    recentMaintenance = await prisma.maintenanceLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { asset: true, user: true },
    })
  } else {
    // Staff only see their own data
    activeTickets = await prisma.ticket.count({
      where: {
        reportedBy: session.userId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    })

    openTickets = await prisma.ticket.count({
      where: {
        reportedBy: session.userId,
        status: "OPEN",
      },
    })

    inProgressTickets = await prisma.ticket.count({
      where: {
        reportedBy: session.userId,
        status: "IN_PROGRESS",
      },
    })

    resolvedTickets = await prisma.ticket.count({
      where: {
        reportedBy: session.userId,
        status: "RESOLVED",
      },
    })

    totalAssets = await prisma.asset.count()

    // Get user's department to show related assets
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { department: true },
    })

    if (user?.department) {
      departmentAssets = await prisma.asset.findMany({
        where: { department: user.department },
        take: 5,
        orderBy: { createdAt: "desc" },
      })
    }

    myTickets = await prisma.ticket.findMany({
      where: { reportedBy: session.userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { asset: true, user: true },
    })
  }

  return (
    <ProtectedLayout>
      <DashboardContent
        session={session}
        activeTickets={activeTickets}
        openTickets={openTickets}
        inProgressTickets={inProgressTickets}
        resolvedTickets={resolvedTickets}
        pendingRepairs={pendingRepairs}
        totalAssets={totalAssets}
        recentTickets={recentTickets}
        recentMaintenance={recentMaintenance}
        myTickets={myTickets}
        departmentAssets={departmentAssets}
      />
    </ProtectedLayout>
  )
}
