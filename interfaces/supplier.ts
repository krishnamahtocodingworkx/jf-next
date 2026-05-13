export type ViewMode = "grid" | "list"

export type DataSource = "sap" | "oracle" | "netsuite" | "excel" | "csv" | "manual" | "api"

export type PipelineStage =
    | "ingredient-need"
    | "supplier-match"
    | "email-sent"
    | "quote-requested"
    | "platform-invite"
    | "connected"

export interface Supplier {
    id: string
    name: string
    location: string
    score: number
    status: "Pending" | "Active" | "Inactive" | "Connected"
    lastUpdated: string
    ingredients: string[]
    phone: string | null
    email: string
    website: string | null
    certifications: string[]
    description: string
    categories?: string[]
    minOrder?: string
    leadTime?: string
    pipelineStage?: PipelineStage
    agentStats?: {
        emails: number
        quotes: number
        pending: number
        invited: boolean
    }
    dataSource?: DataSource
}

export interface AgentActivity {
    id: string
    type: "ingredient-need" | "supplier-match" | "email-sent" | "quote-response" | "data-update"
    title: string
    description: string
    timestamp: string
    expanded?: boolean
    details?: string
}

export interface InboundOpportunity {
    id: string
    brandName: string
    brandLogo?: string
    ingredient: string
    quantity: string
    timeline: string
    status: "new" | "reviewing" | "responded" | "matched"
    receivedAt: string
}