// Department constants
export const DEPARTMENTS = [
  "Finance",
  "HR",
  "IT Department",
  "Administration",
  "Operations",
  "Legal",
  "Marketing",
  "Sales",
  "Customer Service",
  "Procurement",
  "Facilities",
  "Security",
] as const

export type Department = (typeof DEPARTMENTS)[number]

// Asset types and their required fields
export const ASSET_TYPES = {
  COMPUTER: {
    label: "Computer",
    fields: ["cpu", "ram", "storage", "operatingSystem"],
    fieldLabels: {
      cpu: "CPU",
      ram: "RAM",
      storage: "Storage",
      operatingSystem: "Operating System",
    },
  },
  LAPTOP: {
    label: "Laptop",
    fields: ["cpu", "ram", "storage", "operatingSystem", "screenSize"],
    fieldLabels: {
      cpu: "CPU",
      ram: "RAM",
      storage: "Storage",
      operatingSystem: "Operating System",
      screenSize: "Screen Size",
    },
  },
  PRINTER: {
    label: "Printer",
    fields: ["model", "type", "connectivity"],
    fieldLabels: {
      model: "Model",
      type: "Type (Inkjet/Laser)",
      connectivity: "Connectivity (USB/Network/Wireless)",
    },
  },
  MONITOR: {
    label: "Monitor",
    fields: ["size", "resolution", "connectivity"],
    fieldLabels: {
      size: "Screen Size",
      resolution: "Resolution",
      connectivity: "Connectivity (HDMI/DisplayPort/VGA)",
    },
  },
  SERVER: {
    label: "Server",
    fields: ["cpu", "ram", "storage", "rackUnit"],
    fieldLabels: {
      cpu: "CPU",
      ram: "RAM",
      storage: "Storage",
      rackUnit: "Rack Unit (U)",
    },
  },
  NETWORK_EQUIPMENT: {
    label: "Network Equipment",
    fields: ["model", "type", "ports"],
    fieldLabels: {
      model: "Model",
      type: "Type (Switch/Router/Access Point)",
      ports: "Number of Ports",
    },
  },
  TABLET: {
    label: "Tablet",
    fields: ["model", "storage", "screenSize", "operatingSystem"],
    fieldLabels: {
      model: "Model",
      storage: "Storage",
      screenSize: "Screen Size",
      operatingSystem: "Operating System",
    },
  },
  PHONE: {
    label: "Phone",
    fields: ["model", "storage", "operatingSystem"],
    fieldLabels: {
      model: "Model",
      storage: "Storage",
      operatingSystem: "Operating System",
    },
  },
  OTHER: {
    label: "Other",
    fields: ["specifications"],
    fieldLabels: {
      specifications: "Specifications",
    },
  },
} as const

export type AssetType = keyof typeof ASSET_TYPES
