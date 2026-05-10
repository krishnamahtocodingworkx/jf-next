import Navbar from "@/components/navbar"
import NavigationTabs from "@/components/navbar/NavigationTabs"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <Navbar />

                <NavigationTabs />
            </header>

            <main className="p-6">
                {children}
            </main>
        </>
    )
}