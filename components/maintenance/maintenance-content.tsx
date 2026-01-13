"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import type { AuthPayload } from "@/lib/auth"

interface Asset {
  id: string
  assetTag: string
}

interface MaintenanceLog {
  id: string
  assetId: string
  action: string
  description: string
  ramDetails?: string
  testResult?: string
  technician: string
  createdAt: Date
  asset: Asset
  user: { name: string; email: string }
}

interface MaintenanceContentProps {
  session: AuthPayload & { userId?: string }
  logs: MaintenanceLog[]
  assets: Asset[]
}

const ACTIONS = ["Checked", "Replaced", "Upgraded", "Repaired", "Tested", "Cleaned", "Other"]

export function MaintenanceContent({ session, logs: initialLogs, assets }: MaintenanceContentProps) {
  const [logs, setLogs] = useState(initialLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [filterAsset, setFilterAsset] = useState("")
  const [formData, setFormData] = useState({
    assetId: "",
    action: "Checked",
    description: "",
    ramDetails: "",
    testResult: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ramDetails: formData.ramDetails || undefined,
          testResult: formData.testResult || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(data.error || "Failed to create log")
        return
      }

      const newLog = await response.json()
      setLogs([newLog, ...logs])
      setFormData({
        assetId: "",
        action: "Checked",
        description: "",
        ramDetails: "",
        testResult: "",
      })
      setShowForm(false)
      setMessage("Maintenance log created successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredLogs = logs.filter(
    (log) =>
      (log.asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterAsset || log.assetId === filterAsset),
  )

  const passedLogs = filteredLogs.filter((l) => l.testResult === "Pass")
  const failedLogs = filteredLogs.filter((l) => l.testResult === "Fail")
  const noTestLogs = filteredLogs.filter((l) => !l.testResult)

  const logTable = (logList: MaintenanceLog[]) => (
    <>
      {logList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No maintenance logs found</div>
      ) : (
        <div className="space-y-3">
          {logList.map((log) => (
            <div key={log.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{log.asset.assetTag}</h3>
                    <Badge variant="outline" className="text-xs">
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                </div>
                {log.testResult && (
                  <Badge
                    variant={log.testResult === "Pass" ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {log.testResult === "Pass" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {log.testResult}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
                <div>
                  <span className="text-muted-foreground">Time</span>
                  <p className="font-medium text-foreground">{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Logs</h1>
            <p className="text-muted-foreground mt-2">Document and track hardware maintenance activities</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Log Action"}
          </Button>
        </div>

        {/* Log Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Log Maintenance Activity</CardTitle>
              <CardDescription>Document hardware changes and repairs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <Alert variant={message.includes("successfully") ? "default" : "destructive"}>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="assetId">Asset *</Label>
                  <Select
                    value={formData.assetId}
                    onValueChange={(value) => setFormData({ ...formData, assetId: value })}
                  >
                    <SelectTrigger id="assetId">
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

                <div className="space-y-2">
                  <Label htmlFor="action">Action *</Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value) => setFormData({ ...formData, action: value })}
                  >
                    <SelectTrigger id="action">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIONS.map((act) => (
                        <SelectItem key={act} value={act}>
                          {act}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Details of the maintenance activity..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ramDetails">RAM Details (Optional)</Label>
                    <Input
                      id="ramDetails"
                      placeholder="e.g., Replaced with 16GB DDR5"
                      value={formData.ramDetails}
                      onChange={(e) => setFormData({ ...formData, ramDetails: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testResult">Test Result (Optional)</Label>
                    <Select
                      value={formData.testResult}
                      onValueChange={(value) => setFormData({ ...formData, testResult: value })}
                    >
                      <SelectTrigger id="testResult">
                        <SelectValue placeholder="No test result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No test result</SelectItem>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Logging..." : "Log Activity"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by asset, action, or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={filterAsset} onValueChange={setFilterAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.assetTag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Logs View */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({filteredLogs.length})</TabsTrigger>
            <TabsTrigger value="passed">Passed ({passedLogs.length})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({failedLogs.length})</TabsTrigger>
            <TabsTrigger value="notest">No Test ({noTestLogs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Maintenance Activities</CardTitle>
              </CardHeader>
              <CardContent>{logTable(filteredLogs)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="passed">
            <Card>
              <CardHeader>
                <CardTitle>Passed Tests</CardTitle>
              </CardHeader>
              <CardContent>{logTable(passedLogs)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failed">
            <Card>
              <CardHeader>
                <CardTitle>Failed Tests</CardTitle>
              </CardHeader>
              <CardContent>{logTable(failedLogs)}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notest">
            <Card>
              <CardHeader>
                <CardTitle>No Test Result</CardTitle>
              </CardHeader>
              <CardContent>{logTable(noTestLogs)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
