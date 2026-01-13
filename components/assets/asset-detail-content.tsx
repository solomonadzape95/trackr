"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import type { AuthPayload } from "@/lib/auth"

interface MaintenanceLog {
  id: string
  assetId: string
  action: string
  description: string
  ramDetails?: string
  testResult?: string
  technician: string
  createdAt: Date
  user: { name: string; email: string }
}

interface Ticket {
  id: string
  title: string
  status: string
  priority: string
  createdAt: Date
  user: { name: string; email: string }
}

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
  maintenanceLogs: MaintenanceLog[]
  tickets: Ticket[]
}

interface AssetDetailContentProps {
  asset: Asset
  session?: AuthPayload & { userId?: string }
}

export function AssetDetailContent({ asset, session }: AssetDetailContentProps) {
  const router = useRouter()
  const isAdminOrOfficer = session ? ["ADMIN", "IT_OFFICER"].includes(session.role) : false

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{asset.assetTag}</h1>
              <p className="text-muted-foreground mt-1">{asset.department}</p>
            </div>
          </div>
          {isAdminOrOfficer && (
            <Button asChild variant="outline">
              <Link href={`/assets/${asset.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Asset
              </Link>
            </Button>
          )}
        </div>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle>Hardware Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">CPU</label>
                  <p className="text-foreground">{asset.cpu}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">RAM</label>
                  <p className="text-foreground">{asset.ram}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Storage</label>
                  <p className="text-foreground">{asset.storage}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Serial Number</label>
                  <p className="text-foreground font-mono">{asset.serialNumber}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance History */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription>Complete audit trail of maintenance and repairs</CardDescription>
          </CardHeader>
          <CardContent>
            {asset.maintenanceLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No maintenance logs found</div>
            ) : (
              <div className="space-y-4">
                {asset.maintenanceLogs.map((log) => (
                  <div key={log.id} className="border border-border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{log.action}</h3>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                      </div>
                      {log.testResult && (
                        <Badge variant={log.testResult === "Pass" ? "default" : "destructive"}>{log.testResult}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Technician</span>
                        <p className="font-medium text-foreground">{log.user.name}</p>
                      </div>
                      {log.ramDetails && (
                        <div>
                          <span className="text-muted-foreground">RAM Details</span>
                          <p className="font-medium text-foreground">{log.ramDetails}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Date</span>
                        <p className="font-medium text-foreground">{new Date(log.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Related Tickets</CardTitle>
            <CardDescription>Support tickets linked to this asset</CardDescription>
          </CardHeader>
          <CardContent>
            {asset.tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tickets found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asset.tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium text-foreground">{ticket.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.status === "RESOLVED"
                                ? "default"
                                : ticket.status === "IN_PROGRESS"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.priority === "HIGH"
                                ? "destructive"
                                : ticket.priority === "MEDIUM"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ticket.user.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString()}
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
