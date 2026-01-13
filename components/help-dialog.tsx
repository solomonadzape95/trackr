"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, BookOpen, Users, Ticket, HardDrive, Wrench, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" title="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Trackr Help & Guide
          </DialogTitle>
          <DialogDescription>Learn how to use Trackr to manage IT support and hardware</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">User Roles</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What is Trackr?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Trackr is a smart IT helpdesk and asset tracking system designed for government offices and organizations
                  that need to keep track of their computer equipment and IT support requests.
                </p>

                <div className="space-y-3">
                  <h3 className="font-semibold">Real-Life Example:</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p>
                      Imagine you're working at a school district office. The district has 200 computers across different
                      schools and departments. When a teacher's computer breaks down, they need to report it. When IT fixes
                      it, they need to document what was done. During annual audits, the district needs to show records of
                      all computer repairs and maintenance.
                    </p>
                    <p>
                      <strong>Without Trackr:</strong> Teachers call IT, IT writes notes on paper, paperwork gets lost,
                      and during audits, nobody can find the records.
                    </p>
                    <p>
                      <strong>With Trackr:</strong> Teachers submit tickets online, IT tracks everything digitally, and
                      during audits, you can instantly pull up complete records of every repair, every computer, and every
                      maintenance activity.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">What Problems Does It Solve?</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      <strong>Lost Information:</strong> No more verbal reports that get forgotten or lost. Everything is
                      documented.
                    </li>
                    <li>
                      <strong>Poor Documentation:</strong> Hardware repairs and RAM replacements are now permanently
                      recorded.
                    </li>
                    <li>
                      <strong>Manual Tracking:</strong> No more spreadsheets or paper logs. Everything is in one system.
                    </li>
                    <li>
                      <strong>Audit Preparation:</strong> Instantly produce maintenance history and records when needed.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Staff Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Staff members are regular employees who use computers and need IT support.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What You Can Do:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Report IT issues (like "My computer won't turn on" or "The printer isn't working")</li>
                      <li>View the status of your support tickets</li>
                      <li>See which computers are assigned to your department (read-only)</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> Sarah works in the Finance department. Her computer screen goes black.
                      She logs into Trackr, clicks "Report Issue," describes the problem, and submits a ticket. She can
                      then check back to see when IT is working on it and when it's fixed.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    IT Officers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    IT Officers are the technical staff who fix computers and manage hardware.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What You Can Do:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>View and manage all support tickets from staff</li>
                      <li>Update ticket status (Open → In Progress → Resolved)</li>
                      <li>Add resolution notes explaining what was fixed</li>
                      <li>Manage the hardware asset inventory (add, edit computers)</li>
                      <li>Log maintenance activities (RAM replacements, repairs, tests)</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> Mike is an IT Officer. He sees Sarah's ticket about the black screen. He
                      goes to the computer, fixes it by replacing the RAM, updates the ticket to "Resolved," and logs the
                      RAM replacement in the maintenance log. This creates a permanent record that the computer had its RAM
                      replaced on this date.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Administrators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Administrators have full access to everything in the system.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What You Can Do:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Everything IT Officers can do, plus:</li>
                      <li>View comprehensive dashboards and reports</li>
                      <li>Perform audit reviews of all maintenance history</li>
                      <li>Delete assets if needed (IT Officers cannot delete)</li>
                      <li>Full system oversight</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> Lisa is the IT Director. During an annual audit, she needs to show records
                      of all computer maintenance. She logs into Trackr, goes to the Assets section, clicks on any computer,
                      and instantly sees the complete maintenance history - every repair, every RAM replacement, every test
                      result, with dates and technicians. She can export this information for the auditors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Tickets are how IT issues are reported and tracked from start to finish.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Ticket Statuses:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>OPEN:</strong> Issue reported, waiting for IT to start working on it
                      </li>
                      <li>
                        <strong>IN_PROGRESS:</strong> IT is currently working on fixing the issue
                      </li>
                      <li>
                        <strong>RESOLVED:</strong> Issue has been fixed and closed
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> A teacher reports "My computer is slow." The ticket starts as OPEN. When
                      IT starts working on it, they change it to IN_PROGRESS. After cleaning up the computer and adding
                      more RAM, they mark it as RESOLVED and add a note: "Cleaned disk, upgraded RAM from 8GB to 16GB."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Asset Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Every computer in your organization is registered as an "asset" with complete information.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Asset Information Includes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Asset Tag (unique identifier like "ASSET-001")</li>
                      <li>Department (which office/school it's in)</li>
                      <li>CPU, RAM, Storage specifications</li>
                      <li>Serial Number</li>
                      <li>Complete maintenance history</li>
                      <li>All related support tickets</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> Computer "ASSET-042" is in the Math Department. When you click on it, you
                      can see it's a Dell computer with Intel i7 processor, 16GB RAM, 512GB SSD. You can also see it had
                      its RAM upgraded in March 2024, had a hard drive replacement in January 2024, and has had 3 support
                      tickets this year. All this information is permanently recorded for audits.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Maintenance Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Every time IT works on a computer, it's logged. These logs cannot be deleted - they're permanent
                    records for audits.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">What Gets Logged:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Date and time of the work</li>
                      <li>Action taken (Checked, Replaced, Upgraded, Repaired, etc.)</li>
                      <li>Description of what was done</li>
                      <li>RAM details (if RAM was involved)</li>
                      <li>Test results (Pass/Fail if testing was done)</li>
                      <li>Which technician did the work</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> IT Officer Mike replaces the RAM in computer ASSET-042. He logs: Action:
                      "Replaced", Description: "Upgraded RAM from 8GB to 16GB DDR4", RAM Details: "Installed 16GB DDR4
                      Kingston", Test Result: "Pass". This creates a permanent record that cannot be edited or deleted,
                      perfect for audits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Common Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Scenario 1: Teacher Reports Computer Problem</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <strong>Step 1:</strong> Teacher Sarah notices her computer is running very slowly. She logs into
                      Trackr and goes to the Tickets page.
                    </p>
                    <p>
                      <strong>Step 2:</strong> She clicks "Report Issue" and fills out: Title: "Computer running very
                      slowly", Description: "Takes 5 minutes to open Word documents", Priority: "High", and selects her
                      computer from the asset list.
                    </p>
                    <p>
                      <strong>Step 3:</strong> IT Officer Mike sees the ticket on his dashboard. He changes the status to
                      "IN_PROGRESS" and goes to check the computer.
                    </p>
                    <p>
                      <strong>Step 4:</strong> Mike finds the computer needs more RAM. He upgrades it from 8GB to 16GB,
                      tests it (it passes), and logs the maintenance activity.
                    </p>
                    <p>
                      <strong>Step 5:</strong> Mike updates the ticket to "RESOLVED" and adds a resolution note: "Upgraded
                      RAM from 8GB to 16GB. Computer now running normally."
                    </p>
                    <p>
                      <strong>Step 6:</strong> Sarah gets a notification (or checks back) and sees her ticket is
                      resolved. The computer's maintenance history now shows the RAM upgrade permanently recorded.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Scenario 2: Annual Audit</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <strong>Situation:</strong> The school district is being audited and needs to show records of all
                      computer maintenance and repairs for the past year.
                    </p>
                    <p>
                      <strong>Solution:</strong> Administrator Lisa logs into Trackr. She can:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>View the dashboard to see total assets, tickets, and maintenance activities</li>
                      <li>Go to Assets to see every computer in the district</li>
                      <li>Click on any computer to see its complete maintenance history</li>
                      <li>See every repair, every RAM replacement, every test result with dates and technicians</li>
                      <li>Export or print this information for auditors</li>
                    </ul>
                    <p>
                      <strong>Result:</strong> Instead of searching through paper files or spreadsheets, Lisa can
                      instantly produce complete, accurate records for the auditors.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Scenario 3: New Computer Arrives</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <strong>Step 1:</strong> The school receives 10 new computers. IT Officer Mike needs to register
                      them in the system.
                    </p>
                    <p>
                      <strong>Step 2:</strong> Mike goes to Assets → "Add Asset" and enters information for each
                      computer: Asset Tag (ASSET-101, ASSET-102, etc.), Department, CPU, RAM, Storage, Serial Number.
                    </p>
                    <p>
                      <strong>Step 3:</strong> When a computer is assigned to a teacher, that teacher can now see it in
                      their "Department Assets" section.
                    </p>
                    <p>
                      <strong>Step 4:</strong> If that computer ever has issues, tickets can be linked to it, and all
                      maintenance will be tracked in its history.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
