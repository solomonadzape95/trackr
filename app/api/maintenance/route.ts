import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assetId, action, description, ramDetails, testResult } = await request.json()

    if (!assetId || !action || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify asset exists
    const asset = await prisma.asset.findUnique({ where: { id: assetId } })
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    const log = await prisma.maintenanceLog.create({
      data: {
        assetId,
        action,
        description,
        ramDetails: ramDetails || null,
        testResult: testResult || null,
        technician: session.userId,
      },
      include: { asset: true, user: true },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    // console.error("Error creating maintenance log:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to create maintenance log" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const assetId = searchParams.get("assetId")

    const logs = await prisma.maintenanceLog.findMany({
      where: assetId ? { assetId } : undefined,
      include: { asset: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(logs)
  } catch (error) {
    // console.error("Error fetching maintenance logs:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
