"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ASSET_TYPES, type AssetType } from "@/lib/constants"

interface AssetFormFieldsProps {
  assetType: AssetType
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
  isSubmitting?: boolean
}

export function AssetFormFields({ assetType, formData, onChange, isSubmitting }: AssetFormFieldsProps) {
  const assetTypeConfig = ASSET_TYPES[assetType]

  // Standard fields that are stored directly (not in specifications)
  const standardFields = ["cpu", "ram", "storage"]

  const handleFieldChange = (field: string, value: string) => {
    // Standard fields go directly to formData
    if (standardFields.includes(field)) {
      onChange(field, value)
    } else {
      // All other fields go to formData directly (they'll be collected into specs on submit)
      onChange(field, value)
    }
  }

  const getFieldValue = (field: string): string => {
    return formData[field] || ""
  }

  return (
    <div className="space-y-4">
      {assetTypeConfig.fields.map((field) => {
        // Skip specifications field - it's handled automatically
        if (field === "specifications") return null

        const label = assetTypeConfig.fieldLabels[field as keyof typeof assetTypeConfig.fieldLabels]
        const value = getFieldValue(field)

        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              name={field}
              placeholder={`Enter ${label.toLowerCase()}`}
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )
      })}
    </div>
  )
}
