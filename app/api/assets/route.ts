import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

// GET - List all assets (with role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Staff can view assets (read-only), Admin and IT Officers can view all
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            tickets: true,
            maintenanceLogs: true,
          },
        },
      },
    })

    return NextResponse.json(assets)
  } catch (error) {
    // console.error("Error fetching assets:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

// POST - Create new asset (ADMIN and IT_OFFICER only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { assetTag, assetType, department, cpu, ram, storage, serialNumber, specifications } = await request.json()

    // Validate required fields
    if (!assetTag || !assetType || !department || !serialNumber) {
      return NextResponse.json({ error: "Asset tag, type, department, and serial number are required" }, { status: 400 })
    }

    // Check for duplicate assetTag
    const existingAssetTag = await prisma.asset.findUnique({
      where: { assetTag },
    })

    if (existingAssetTag) {
      return NextResponse.json({ error: "Asset tag already exists" }, { status: 409 })
    }

    // Check for duplicate serialNumber
    const existingSerial = await prisma.asset.findUnique({
      where: { serialNumber },
    })

    if (existingSerial) {
      return NextResponse.json({ error: "Serial number already exists" }, { status: 409 })
    }

    // Create asset
    const asset = await prisma.asset.create({
      data: {
        assetTag,
        assetType,
        department,
        cpu: cpu || null,
        ram: ram || null,
        storage: storage || null,
        serialNumber,
        specifications: specifications ? JSON.parse(JSON.stringify(specifications)) : null,
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    // console.error("Error creating asset:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}
