import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { AssetsContent } from "@/components/assets/assets-content"
import { ProtectedLayout } from "@/components/protected-layout"

export const metadata = {
  title: "Assets - Trackr",
  description: "Asset Inventory Management",
}

export default async function AssetsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // All authenticated users can view assets (staff read-only, admin/officer can manage)
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <ProtectedLayout>
      <AssetsContent session={session} assets={assets} />
    </ProtectedLayout>
  )
}
