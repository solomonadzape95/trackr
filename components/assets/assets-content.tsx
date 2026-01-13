"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronRight, Plus } from "lucide-react"
import type { AuthPayload } from "@/lib/auth"

interface Asset {
  id: string
  assetTag: string
  department: string
  cpu: string
  ram: string
  storage: string
  serialNumber: string
  createdAt: Date
  updatedAt: Date
}

interface AssetsContentProps {
  session: AuthPayload & { userId?: string }
  assets: Asset[]
}

export function AssetsContent({ session, assets }: AssetsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const isAdminOrOfficer = ["ADMIN", "IT_OFFICER"].includes(session.role)
  const isStaff = session.role === "STAFF"

  const filteredAssets = assets.filter(
    (asset) =>
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.cpu.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asset Inventory</h1>
            <p className="text-muted-foreground mt-2">
              {isStaff ? "View hardware assets (read-only)" : "Manage and track hardware assets"}
            </p>
          </div>
          {isAdminOrOfficer && (
            <Button asChild>
              <Link href="/assets/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Link>
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset tag, serial number, department, or CPU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hardware Assets</CardTitle>
            <CardDescription>{filteredAssets.length} assets found</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No assets found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Tag</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>RAM</TableHead>
                      <TableHead>Storage</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold text-foreground">{asset.assetTag}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{asset.department}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{asset.cpu}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{asset.ram}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{asset.storage}</TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{asset.serialNumber}</TableCell>
                        <TableCell>
                          <Link href={`/assets/${asset.id}`}>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
