"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from "lucide-react"
import type { AuthPayload } from "@/lib/auth"
import { TicketDetailModal } from "./ticket-detail-modal"
import { DEPARTMENTS } from "@/lib/constants"

interface Asset {
  id: string
  assetTag: string
}

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  reportedBy: string
  assignedTo?: string
  assetId?: string
  resolution?: string
  createdAt: Date
  updatedAt: Date
  user: { name: string; email: string }
  asset?: Asset
}

interface TicketsContentProps {
  session: AuthPayload & { userId?: string }
  tickets: Ticket[]
  assets: Asset[]
}

export function TicketsContent({ session, tickets, assets }: TicketsContentProps) {
  const [allTickets, setAllTickets] = useState(tickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assetId: "",
    department: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const isStaff = session.role === "STAFF"
  const isAdmin = ["ADMIN", "IT_OFFICER"].includes(session.role)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          assetId: formData.assetId || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(data.error || "Failed to create ticket")
        return
      }

      const newTicket = await response.json()
      setAllTickets([newTicket, ...allTickets])
      setFormData({ title: "", description: "", priority: "MEDIUM", assetId: "", department: "" })
      setShowForm(false)
      setMessage("Ticket created successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTickets = allTickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openTickets = filteredTickets.filter((t) => t.status === "OPEN")
  const inProgressTickets = filteredTickets.filter((t) => t.status === "IN_PROGRESS")
  const resolvedTickets = filteredTickets.filter((t) => t.status === "RESOLVED")

  const ticketTable = (ticketList: Ticket[]) => (
    <>
      {ticketList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tickets found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketList.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <TableCell className="font-mono text-sm">{ticket.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium text-foreground max-w-xs truncate">{ticket.title}</TableCell>
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
                  <TableCell className="text-sm text-muted-foreground">{ticket.asset?.assetTag || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ticket.user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTicket(ticket)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-muted-foreground mt-2">Track and manage IT support requests</p>
          </div>
          {isStaff && (
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cancel" : "Report Issue"}
            </Button>
          )}
        </div>

        {/* Staff Report Form */}
        {isStaff && showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
              <CardDescription>Describe the problem you're experiencing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {message && (
                  <Alert variant={message.includes("successfully") ? "default" : "destructive"}>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the issue"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asset">Affected Asset (Optional)</Label>
                    <Select
                      value={formData.assetId}
                      onValueChange={(value) => setFormData({ ...formData, assetId: value })}
                    >
                      <SelectTrigger id="asset">
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.assetTag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Creating..." : "Submit Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets by title, description, or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tickets View */}
        {isAdmin ? (
          <Tabs defaultValue="open" className="space-y-4">
            <TabsList>
              <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
              <TabsTrigger value="progress">In Progress ({inProgressTickets.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedTickets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="open">
              <Card>
                <CardHeader>
                  <CardTitle>Open Tickets</CardTitle>
                </CardHeader>
                <CardContent>{ticketTable(openTickets)}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>In Progress</CardTitle>
                </CardHeader>
                <CardContent>{ticketTable(inProgressTickets)}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved">
              <Card>
                <CardHeader>
                  <CardTitle>Resolved</CardTitle>
                </CardHeader>
                <CardContent>{ticketTable(resolvedTickets)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
              <CardDescription>Your support requests</CardDescription>
            </CardHeader>
            <CardContent>{ticketTable(filteredTickets)}</CardContent>
          </Card>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            isAdmin={isAdmin}
            onClose={() => setSelectedTicket(null)}
            onUpdate={(updatedTicket) => {
              setAllTickets(allTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
              setSelectedTicket(updatedTicket)
            }}
          />
        )}
      </div>
    </div>
  )
}
