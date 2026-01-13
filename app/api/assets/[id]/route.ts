import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

// GET - Get single asset
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        tickets: {
          orderBy: { createdAt: "desc" },
          include: { user: true },
        },
        maintenanceLogs: {
          orderBy: { createdAt: "desc" },
          include: { user: true },
        },
      },
    })

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    // console.error("Error fetching asset:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 })
  }
}

// PATCH - Update asset (ADMIN and IT_OFFICER only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || !["ADMIN", "IT_OFFICER"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { assetTag, assetType, department, cpu, ram, storage, serialNumber, specifications } = await request.json()

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    })

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    // Check for duplicate assetTag if changed
    if (assetTag && assetTag !== existingAsset.assetTag) {
      const duplicateTag = await prisma.asset.findUnique({
        where: { assetTag },
      })

      if (duplicateTag) {
        return NextResponse.json({ error: "Asset tag already exists" }, { status: 409 })
      }
    }

    // Check for duplicate serialNumber if changed
    if (serialNumber && serialNumber !== existingAsset.serialNumber) {
      const duplicateSerial = await prisma.asset.findUnique({
        where: { serialNumber },
      })

      if (duplicateSerial) {
        return NextResponse.json({ error: "Serial number already exists" }, { status: 409 })
      }
    }

    // Update asset
    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...(assetTag && { assetTag }),
        ...(assetType && { assetType }),
        ...(department && { department }),
        ...(cpu !== undefined && { cpu }),
        ...(ram !== undefined && { ram }),
        ...(storage !== undefined && { storage }),
        ...(serialNumber && { serialNumber }),
        ...(specifications !== undefined && { specifications: specifications ? JSON.parse(JSON.stringify(specifications)) : null }),
      },
    })

    return NextResponse.json(asset)
  } catch (error) {
    // console.error("Error updating asset:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
  }
}

// DELETE - Delete asset (ADMIN only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    })

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    // Delete asset (cascade will handle related tickets and maintenance logs)
    await prisma.asset.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // console.error("Error deleting asset:", error) // Commented out to reduce console noise
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }
}
