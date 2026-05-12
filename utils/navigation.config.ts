// navigation.config.ts

import {
    Home,
    Zap,
    Leaf,
    Package,
    Box,
    ImageIcon,
    GitBranch,
    BarChart3,
    Link2,
    Tv,
} from "lucide-react"

export const mainNav = [
    { name: "Overview", id: "overview", icon: Home, path: "/overview" },
    { name: "Generate", id: "generate", icon: Zap, path: "/generate" },
    { name: "Workflows", id: "workflows", icon: GitBranch, path: "/workflows" },
    { name: "Ingredients", id: "ingredients", icon: Leaf, path: "/ingredients" },
    { name: "Products", id: "products", icon: Package, path: "/products" },
    { name: "Suppliers", id: "suppliers", icon: Box, path: "/suppliers" },
    { name: "Packaging", id: "packaging", icon: ImageIcon, path: "/packaging" },
]

export const secondaryNav = [
    {
        name: "Analytics",
        id: "analytics",
        icon: BarChart3,
        path: "/analytics",
    },
    {
        name: "Integrations",
        id: "integrations",
        icon: Link2,
        path: "/integrations",
    },
    {
        name: "Guava",
        id: "guava",
        icon: Tv,
        path: "/guava",
    },
]
