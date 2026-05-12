"use client"

import { useRouter, usePathname } from "next/navigation"

import { mainNav, secondaryNav } from "@/utils/navigation.config"

export default function NavigationTabs() {
    const router = useRouter()
    const pathname = usePathname()

    const handleNavigate = (path: string) => {
        router.push(path)
    }

    return (
        <nav
            className="flex items-center gap-1 px-6 overflow-x-auto"
            aria-label="Main navigation"
        >
            {mainNav.map((item) => {
                const Icon = item.icon

                const isActive = pathname.includes(item.path)

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.path)}
                        className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                            ? "border-slate-800 text-slate-900"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <Icon className="h-4 w-4" />

                        {item.name}
                    </button>
                )
            })}

            <div className="ml-auto flex items-center gap-1 pl-4 border-l border-slate-100 shrink-0">
                {secondaryNav.map((item) => {
                    const Icon = item.icon

                    const isActive = pathname.includes(item.path)

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleNavigate(item.path)}
                            className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                                ? "border-slate-800 text-slate-900"
                                : "border-transparent text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            <Icon className="h-4 w-4" />

                            {item.name}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}