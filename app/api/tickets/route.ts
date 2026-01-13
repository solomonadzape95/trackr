import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, priority, assetId, department } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        assetId: assetId || null,
        department: department || null,
        reportedBy: session.userId,
        status: "OPEN",
      },
      include: { user: true, asset: true },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    // console.error("Error creating ticket:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
