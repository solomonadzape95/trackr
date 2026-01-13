"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Clock,
  Plus,
  Ticket,
  TrendingUp,
  FileText,
  Wrench,
  ArrowRight,
} from "lucide-react"
import type { AuthPayload } from "@/lib/auth"

interface DashboardContentProps {
  session: AuthPayload & { userId?: string }
  activeTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  pendingRepairs: number
  totalAssets: number
  recentTickets: any[]
  recentMaintenance: any[]
  myTickets: any[]
  departmentAssets: any[]
}

export function DashboardContent({
  session,
  activeTickets,
  openTickets,
  inProgressTickets,
  resolvedTickets,
  pendingRepairs,
  totalAssets,
  recentTickets,
  recentMaintenance,
  myTickets,
  departmentAssets,
}: DashboardContentProps) {
  const roleLabel = {
    STAFF: "Staff Member",
    IT_OFFICER: "IT Officer",
    ADMIN: "Administrator",
  }[session.role]

  const isAdminOrOfficer = session.role === "ADMIN" || session.role === "IT_OFFICER"
  const isStaff = session.role === "STAFF"

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, <span className="font-semibold">{session.email}</span> ({roleLabel})
        </p>
        </div>
        {isStaff && (
          <Button asChild>
            <Link href="/tickets">
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Link>
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isStaff ? "My Active Tickets" : "Active Tickets"}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Open or in progress</p>
            {isAdminOrOfficer && (
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-muted-foreground">Open: {openTickets}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">In Progress: {inProgressTickets}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolved Tickets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isStaff ? "My Resolved" : "Resolved Tickets"}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed tickets</p>
            </CardContent>
          </Card>

        {/* Total Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">Hardware inventory</p>
          </CardContent>
        </Card>

        {/* Pending Repairs / Quick Stats */}
        {isAdminOrOfficer ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRepairs}</div>
              <p className="text-xs text-muted-foreground mt-1">Failed test results</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets + resolvedTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">Total tickets reported</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      {isAdminOrOfficer && (
      <Card>
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 flex-col items-start">
                <Link href="/assets/new">
                  <Plus className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Add Asset</span>
                  <span className="text-xs text-muted-foreground mt-1">Register new hardware</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col items-start">
                <Link href="/maintenance">
                  <Wrench className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Log Maintenance</span>
                  <span className="text-xs text-muted-foreground mt-1">Record repairs or checks</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col items-start">
                <Link href="/tickets">
                  <FileText className="h-5 w-5 mb-2" />
                  <span className="font-semibold">View All Tickets</span>
                  <span className="text-xs text-muted-foreground mt-1">Manage support requests</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Sections */}
      {isStaff && (
        <>
          {/* My Tickets Table */}
          {myTickets.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Tickets</CardTitle>
                  <CardDescription>Your recent support requests</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/tickets">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTickets.slice(0, 5).map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link href="/tickets" className="hover:underline">
                              {ticket.title}
                            </Link>
                          </TableCell>
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
                          <TableCell className="text-sm text-muted-foreground">
                            {ticket.asset?.assetTag || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Department Assets */}
          {departmentAssets.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Department Assets</CardTitle>
                  <CardDescription>Hardware in your department (read-only)</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/assets">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentAssets.map((asset) => (
                    <Link key={asset.id} href={`/assets/${asset.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{asset.assetTag}</CardTitle>
                          <CardDescription>{asset.department}</CardDescription>
        </CardHeader>
        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">CPU: </span>
                              <span className="font-medium">{asset.cpu}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">RAM: </span>
                              <span className="font-medium">{asset.ram}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Storage: </span>
                              <span className="font-medium">{asset.storage}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Admin/Officer Sections */}
      {isAdminOrOfficer && (
        <>
          {/* Recent Tickets */}
          {recentTickets.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Tickets</CardTitle>
                  <CardDescription>Latest support requests</CardDescription>
                  </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/tickets">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTickets.map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link href="/tickets" className="hover:underline">
                              {ticket.title}
                            </Link>
                          </TableCell>
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
                            {ticket.asset?.assetTag || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Maintenance */}
          {recentMaintenance.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Maintenance</CardTitle>
                  <CardDescription>Latest hardware maintenance activities</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/maintenance">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMaintenance.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{log.asset.assetTag}</h3>
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Technician: {log.user.name}</span>
                          {log.ramDetails && <span>RAM: {log.ramDetails}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        {log.testResult && (
                          <Badge variant={log.testResult === "Pass" ? "default" : "destructive"} className="mb-2">
                            {log.testResult}
                      </Badge>
                    )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State for Staff */}
      {isStaff && myTickets.length === 0 && departmentAssets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get Started</h3>
            <p className="text-muted-foreground mb-4">
              You haven't reported any issues yet. Report your first IT issue to get started.
            </p>
            <Button asChild>
              <Link href="/tickets">
                <Plus className="h-4 w-4 mr-2" />
                Report an Issue
              </Link>
            </Button>
        </CardContent>
      </Card>
      )}
    </div>
  )
}
