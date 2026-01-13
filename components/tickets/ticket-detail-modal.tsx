"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"

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
  asset?: { id: string; assetTag: string }
}

interface TicketDetailModalProps {
  ticket: Ticket
  isAdmin: boolean
  onClose: () => void
  onUpdate: (ticket: Ticket) => void
}

export function TicketDetailModal({ ticket, isAdmin, onClose, onUpdate }: TicketDetailModalProps) {
  const [status, setStatus] = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority)
  const [resolution, setResolution] = useState(ticket.resolution || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdate = async () => {
    setIsUpdating(true)
    setMessage("")

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          resolution: resolution || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(data.error || "Failed to update ticket")
        return
      }

      const updatedTicket = await response.json()
      onUpdate(updatedTicket)
      setMessage("Ticket updated successfully!")
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <CardTitle>{ticket.title}</CardTitle>
            <CardDescription className="mt-2">{ticket.id}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.includes("successfully") ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground">{ticket.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-xs">Status</Label>
              <p className="font-medium text-foreground mt-1">{ticket.status}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Priority</Label>
              <p className="font-medium text-foreground mt-1">{ticket.priority}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Reported By</Label>
              <p className="font-medium text-foreground mt-1">{ticket.user.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Asset</Label>
              <p className="font-medium text-foreground mt-1">{ticket.asset?.assetTag || "—"}</p>
            </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <>
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-semibold text-foreground">Update Ticket</h3>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
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
                  <Label htmlFor="resolution">Resolution Notes</Label>
                  <Textarea
                    id="resolution"
                    placeholder="Document the solution provided..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                  {isUpdating ? "Updating..." : "Update Ticket"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
