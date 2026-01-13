# Database Migration Guide

## Schema Changes

The schema has been updated to include:
1. **Asset Type** - Assets can now be categorized (Computer, Laptop, Printer, Monitor, Server, etc.)
2. **Flexible Specifications** - JSON field for type-specific details
3. **Department Field in Tickets** - Tickets now track department

## Migration Steps

### 1. Create and Run Migration

```bash
# Generate migration
npx prisma migrate dev --name add_asset_types_and_department

# This will:
# - Add assetType enum and field to Asset model
# - Make cpu, ram, storage optional
# - Add specifications JSON field
# - Add department field to Ticket model
```

### 2. Update Existing Assets

After migration, existing assets will have:
- `assetType` = `COMPUTER` (default)
- `cpu`, `ram`, `storage` = existing values (now nullable)
- `specifications` = null

You may want to run a script to migrate existing data:

```typescript
// scripts/migrate-assets.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrate() {
  const assets = await prisma.asset.findMany({
    where: { assetType: null }
  })

  for (const asset of assets) {
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        assetType: 'COMPUTER',
        specifications: {
          cpu: asset.cpu,
          ram: asset.ram,
          storage: asset.storage,
        }
      }
    })
  }
}

migrate()
```

### 3. Regenerate Prisma Client

```bash
npx prisma generate
```

## Breaking Changes

- Asset `cpu`, `ram`, `storage` are now optional (nullable)
- New required field: `assetType` (defaults to COMPUTER)
- Ticket now has optional `department` field

## Notes

- Existing assets will continue to work with default `COMPUTER` type
- The `specifications` JSON field allows flexible storage for different asset types
- Department dropdown uses predefined list from `lib/constants.ts`
