import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { AssetsContent } from "@/components/assets/assets-content"

export const metadata = {
  title: "Assets - Trackr",
  description: "Asset Inventory Management",
}

export default async function AssetsPage() {
  const session = await getSession()

  if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
    redirect("/dashboard")
  }

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <AssetsContent session={session} assets={assets} />
}
