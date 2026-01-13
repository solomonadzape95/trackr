import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { AssetDetailContent } from "@/components/assets/asset-detail-content"

export const metadata = {
  title: "Asset Details - Trackr",
  description: "View asset details and maintenance history",
}

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()

  if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
    redirect("/dashboard")
  }

  const { id } = await params

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      maintenanceLogs: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
      tickets: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  })

  if (!asset) {
    redirect("/assets")
  }

  return <AssetDetailContent asset={asset} />
}
