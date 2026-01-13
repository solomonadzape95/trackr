const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@trackr.gov" },
    update: {},
    create: {
      email: "admin@trackr.gov",
      password: await bcrypt.hash("AdminPassword123!", 10),
      name: "Admin User",
      role: "ADMIN",
      department: "IT Department",
    },
  })

  // Create IT Officer user
  const itOfficer = await prisma.user.upsert({
    where: { email: "officer@trackr.gov" },
    update: {},
    create: {
      email: "officer@trackr.gov",
      password: await bcrypt.hash("OfficerPassword123!", 10),
      name: "IT Officer",
      role: "IT_OFFICER",
      department: "IT Department",
    },
  })

  // Create staff user
  const staffUser = await prisma.user.upsert({
    where: { email: "staff@trackr.gov" },
    update: {},
    create: {
      email: "staff@trackr.gov",
      password: await bcrypt.hash("StaffPassword123!", 10),
      name: "Staff Member",
      role: "STAFF",
      department: "Finance",
    },
  })

  // Create sample assets
  const asset1 = await prisma.asset.upsert({
    where: { assetTag: "ASSET-001" },
    update: {},
    create: {
      assetTag: "ASSET-001",
      department: "Finance",
      cpu: "Intel Core i7-13700K",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      serialNumber: "SN-2024-001",
    },
  })

  const asset2 = await prisma.asset.upsert({
    where: { assetTag: "ASSET-002" },
    update: {},
    create: {
      assetTag: "ASSET-002",
      department: "HR",
      cpu: "Intel Core i5-13600K",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      serialNumber: "SN-2024-002",
    },
  })

  console.log({ adminUser, itOfficer, staffUser, asset1, asset2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
