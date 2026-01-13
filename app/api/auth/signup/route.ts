import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, department } = await request.json()

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Only allow STAFF and IT_OFFICER roles
    if (!["STAFF", "IT_OFFICER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department: department || undefined,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please sign in.",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 },
    )
  } catch (error) {
    // console.error("Signup error:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
