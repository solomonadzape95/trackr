"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { ProtectedLayoutClient } from "@/components/protected-layout-client"
import { ASSET_TYPES, DEPARTMENTS, type AssetType } from "@/lib/constants"
import { AssetFormFields } from "@/components/assets/asset-form-fields"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingScreen } from "@/components/loading"

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [assetId, setAssetId] = useState<string>("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    assetTag: "",
    assetType: "COMPUTER" as AssetType,
    department: "",
    cpu: "",
    ram: "",
    storage: "",
    serialNumber: "",
    specifications: "",
    // Specification fields
    operatingSystem: "",
    screenSize: "",
    model: "",
    type: "",
    connectivity: "",
    resolution: "",
    ports: "",
    rackUnit: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      // Check if user is authenticated and has permission
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        router.push("/login")
        return
      }
      const data = await response.json()
      if (!["ADMIN", "IT_OFFICER"].includes(data.role)) {
        router.push("/assets")
        return
      }
      setUserRole(data.role)
      setSession(data)
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    async function loadAsset() {
      if (!userRole) return // Wait for auth check
      
      try {
        const resolvedParams = await params
        const id = resolvedParams.id
        setAssetId(id)

        const response = await fetch(`/api/assets/${id}`)
        if (!response.ok) {
          router.push("/assets")
          return
        }

        const asset = await response.json()
        const specs = asset.specifications || {}
        setFormData({
          assetTag: asset.assetTag,
          assetType: asset.assetType || "COMPUTER",
          department: asset.department,
          cpu: asset.cpu || "",
          ram: asset.ram || "",
          storage: asset.storage || "",
          serialNumber: asset.serialNumber,
          specifications: asset.specifications ? JSON.stringify(asset.specifications) : "",
          // Extract fields from specifications for form
          operatingSystem: specs.operatingSystem || "",
          screenSize: specs.screenSize || "",
          model: specs.model || "",
          type: specs.type || "",
          connectivity: specs.connectivity || "",
          resolution: specs.resolution || "",
          ports: specs.ports || "",
          rackUnit: specs.rackUnit || "",
        })
      } catch (err) {
        router.push("/assets")
      } finally {
        setIsLoading(false)
      }
    }
    loadAsset()
  }, [params, router, userRole])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.assetTag || !formData.assetType || !formData.department || !formData.serialNumber) {
      setError("Asset tag, type, department, and serial number are required")
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data for API - collect all specification fields
      const specs: Record<string, any> = {}
      const specFields = ["operatingSystem", "screenSize", "model", "type", "connectivity", "resolution", "ports", "rackUnit"]
      specFields.forEach((field) => {
        if (formData[field]) {
          specs[field] = formData[field]
        }
      })

      const apiData = {
        assetTag: formData.assetTag,
        assetType: formData.assetType,
        department: formData.department,
        serialNumber: formData.serialNumber,
        cpu: formData.cpu || null,
        ram: formData.ram || null,
        storage: formData.storage || null,
        specifications: Object.keys(specs).length > 0 ? specs : null,
      }

      const response = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update asset")
        setIsSubmitting(false)
        return
      }

      // Redirect to asset detail page on success
      router.push(`/assets/${assetId}`)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading || !userRole || !session) {
    return <LoadingScreen message={isLoading ? "Loading asset..." : "Checking permissions..."} />
  }

  return (
    <ProtectedLayoutClient session={session}>
      <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Asset</h1>
            <p className="text-muted-foreground mt-1">Update asset information</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
            <CardDescription>Update the hardware specifications and details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetTag">Asset Tag *</Label>
                  <Input
                    id="assetTag"
                    name="assetTag"
                    placeholder="e.g., ASSET-001"
                    value={formData.assetTag}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Unique identifier for this asset</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="e.g., SN-2024-001"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Manufacturer serial number</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type *</Label>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => setFormData({ ...formData, assetType: value as AssetType })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="assetType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ASSET_TYPES).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={isSubmitting}
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
              </div>

              {/* Dynamic fields based on asset type */}
              <AssetFormFields
                assetType={formData.assetType}
                formData={formData}
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                isSubmitting={isSubmitting}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Updating..." : "Update Asset"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedLayoutClient>
  )
}
