export type UserRole = "STAFF" | "IT_OFFICER" | "ADMIN"
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED"
export type Priority = "LOW" | "MEDIUM" | "HIGH"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
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

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: Priority
  reportedBy: string
  assignedTo?: string
  assetId?: string
  resolution?: string
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceLog {
  id: string
  assetId: string
  action: string
  description: string
  ramDetails?: string
  testResult?: string
  technician: string
  createdAt: Date
}
