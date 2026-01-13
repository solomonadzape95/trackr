Trackr

Tagline

Smart IT Helpdesk and Asset Tracking System for Government Offices

Purpose & Problem Context

GovIT Trackr is a web-based application designed to solve IT support and hardware accountability challenges in government offices.

Current challenges include:

IT faults are reported verbally, leading to delays and lost information.

Hardware issues and fixes are poorly documented or not documented at all.

RAM replacements and system repairs occur without traceable records.

Computers and assets are tracked manually or inconsistently.

During audits, there is no reliable maintenance history to present.

These gaps reduce accountability, slow IT response times, and create audit risks.

Core Goal

To provide a single, reliable system that:

Captures IT issues formally

Tracks support tickets from report to resolution

Maintains a complete hardware asset register

Logs RAM checks and replacements

Produces clear audit trails for management and compliance

Target Users & Roles
1. Staff

Report IT issues

View status of their own tickets

View assigned computer assets (read-only)

2. IT Officers

View and manage all tickets

Update ticket status and resolution notes

Manage hardware assets

Log maintenance and RAM activities

3. Admin

Full system access

View dashboards and reports

Perform audit reviews

Manage users and permissions

Core Features (MVP Scope)
Authentication & Authorization

Secure login

Role-based access control

Route protection using middleware

IT Helpdesk (Ticketing System)

Staff can submit IT issues via a form

Each submission creates a ticket

Ticket statuses:

OPEN

IN_PROGRESS

RESOLVED

Tickets are linked to specific computer assets

IT Officers can assign, update, and resolve tickets

Asset Tracking

Centralized register of computer assets

Each asset includes:

Asset tag

Department

CPU

RAM

Storage

Serial number

Assets are linked to tickets and maintenance logs

Maintenance & RAM Logs

Maintenance history per asset

Logs include:

Date

Action (Checked, Replaced, Upgraded)

RAM details

Test result

Technician

Logs are append-only and cannot be edited or deleted

Designed for audit integrity

Dashboard & Reporting

Summary metrics:

Total assets

Open tickets

Resolved tickets

Recent maintenance

Role-based dashboard views

Admin audit views per asset

Technical Architecture
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Server Components where appropriate

Backend

Next.js API Routes or Server Actions

Prisma ORM

PostgreSQL database

Role-based middleware

Data Models (High-Level)

User

Asset

Ticket

MaintenanceLog

All entities are relational and auditable.

Design Principles

Simplicity over complexity

Clear accountability

Audit-first thinking

Minimal but complete MVP

Government-appropriate UI (clean, readable, conservative)

Non-Goals (Out of Scope for MVP)

Email or SMS notifications

Mobile app

Asset depreciation calculations

External integrations

Advanced analytics

Success Criteria

The MVP is successful if:

Staff can report issues without verbal communication

IT officers can track and resolve issues with history

Hardware changes are permanently logged

Audit records can be produced instantly

The system runs reliably with minimal training

Development Instruction (For AI Builders)

When modifying or generating code:

Always align with this document

Do not add features outside MVP scope unless explicitly requested

Preserve audit integrity (no deletion of logs)

Prefer clarity and maintainability over clever abstractions