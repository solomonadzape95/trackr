import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      userId: session.userId,
      email: session.email,
      role: session.role,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 })
  }
}
