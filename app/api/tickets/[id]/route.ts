import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status, resolution, assignedTo, priority } = await request.json()

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution && { resolution }),
        ...(assignedTo && { assignedTo }),
        ...(priority && { priority }),
      },
      include: { user: true, asset: true },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    // console.error("Error updating ticket:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
