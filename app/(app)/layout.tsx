import Navbar from "@/components/navbar"
import NavigationTabs from "@/components/navbar/NavigationTabs"
import AuthGuard from "@/components/auth/AuthGuard"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <Navbar />

                <NavigationTabs />
            </header>

            <main className="p-6 bg-slate-50 min-h-[calc(100vh-120px)]">
                {children}
            </main>
        </AuthGuard>
    )
}
