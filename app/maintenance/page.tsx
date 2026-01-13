import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { MaintenanceContent } from "@/components/maintenance/maintenance-content"
import { ProtectedLayout } from "@/components/protected-layout"

export const metadata = {
  title: "Maintenance - Trackr",
  description: "Hardware Maintenance Logging",
}

export default async function MaintenancePage() {
  const session = await getSession()

  if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
    redirect("/dashboard")
  }

  const logs = await prisma.maintenanceLog.findMany({
    include: { asset: true, user: true },
    orderBy: { createdAt: "desc" },
  })

  const assets = await prisma.asset.findMany({
    orderBy: { assetTag: "asc" },
  })

  return (
    <ProtectedLayout>
      <MaintenanceContent session={session} logs={logs} assets={assets} />
    </ProtectedLayout>
  )
}
