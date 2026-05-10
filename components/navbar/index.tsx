// "use client"

// import { useState } from "react"
// import {
//     Search,
//     Bell,
//     ChevronDown,
//     CheckCircle,
//     Box,
//     User,
//     Settings,
//     LogOut,
//     BookOpen,
//     ExternalLink,
//     KeyRound,
//     Check,
// } from "lucide-react"

// import { useRouter } from "next/navigation"

// interface NavbarProps {
//     isSupplierMode: boolean
//     onToggleSupplierMode: () => void
//     onLogout?: () => void
//     onSearch?: (query: string) => void
// }

// const brandsData = [
//     {
//         id: "1",
//         name: "Journey Foods",
//         color: "#14B8A6",
//         productCount: 24,
//     },
//     {
//         id: "2",
//         name: "Healthy Snacks",
//         color: "#8B5CF6",
//         productCount: 12,
//     },
// ]

// export default function Navbar({
//     isSupplierMode,
//     onToggleSupplierMode,
//     onLogout,
//     onSearch,
// }: NavbarProps) {
//     const router = useRouter()

//     const [profileOpen, setProfileOpen] = useState(false)
//     const [notificationsOpen, setNotificationsOpen] = useState(false)
//     const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false)

//     const [searchQuery, setSearchQuery] = useState("")
//     const [selectedBrandFilter, setSelectedBrandFilter] =
//         useState<string>("all")

//     const unreadCount = 3

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault()

//         if (searchQuery.trim()) {
//             onSearch?.(searchQuery)
//         }
//     }

//     return (
//         <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
//             {/* Logo */}
//             <div className="flex items-center">
//                 <img
//                     src="/journey-foods-logo.svg"
//                     alt="JourneyFoods"
//                     className="h-8 w-auto"
//                 />
//             </div>

//             {/* Search */}
//             <div className="flex-1 max-w-xl mx-8">
//                 <form onSubmit={handleSearch} className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

//                     <input
//                         type="text"
//                         placeholder="Search ingredients, suppliers, products..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
//                     />
//                 </form>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-3">
//                 {/* Brand Dropdown */}
//                 <div className="relative">
//                     <button
//                         type="button"
//                         onClick={() => setBrandsDropdownOpen((prev) => !prev)}
//                         className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
//                     >
//                         <Box className="h-4 w-4" />

//                         {selectedBrandFilter === "all"
//                             ? "All brands"
//                             : brandsData.find((b) => b.id === selectedBrandFilter)?.name}

//                         <ChevronDown
//                             className={`h-3 w-3 transition-transform ${brandsDropdownOpen ? "rotate-180" : ""
//                                 }`}
//                         />
//                     </button>

//                     {brandsDropdownOpen && (
//                         <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
//                             <div className="p-3 border-b border-slate-100">
//                                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                                     Your Brands
//                                 </p>
//                             </div>

//                             <div className="p-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setSelectedBrandFilter("all")
//                                         setBrandsDropdownOpen(false)
//                                     }}
//                                     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedBrandFilter === "all"
//                                             ? "bg-teal-50 text-teal-700"
//                                             : "text-slate-700 hover:bg-slate-50"
//                                         }`}
//                                 >
//                                     <span>All brands</span>

//                                     {selectedBrandFilter === "all" && (
//                                         <Check className="h-4 w-4 text-teal-600" />
//                                     )}
//                                 </button>
//                             </div>

//                             <div className="border-t border-slate-100">
//                                 {brandsData.map((brand) => (
//                                     <button
//                                         key={brand.id}
//                                         type="button"
//                                         onClick={() => {
//                                             setSelectedBrandFilter(brand.id)
//                                             setBrandsDropdownOpen(false)
//                                         }}
//                                         className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${selectedBrandFilter === brand.id
//                                                 ? "bg-teal-50 text-teal-700"
//                                                 : "text-slate-700 hover:bg-slate-50"
//                                             }`}
//                                     >
//                                         <span className="flex items-center gap-3">
//                                             <span
//                                                 className="w-3 h-3 rounded-full"
//                                                 style={{ backgroundColor: brand.color }}
//                                             />

//                                             {brand.name}
//                                         </span>

//                                         {selectedBrandFilter === brand.id && (
//                                             <Check className="h-4 w-4 text-teal-600" />
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Supplier Mode */}
//                 {isSupplierMode && (
//                     <button
//                         type="button"
//                         onClick={onToggleSupplierMode}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-pink-600 bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-colors"
//                     >
//                         <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />

//                         Supplier Mode
//                     </button>
//                 )}

//                 {/* Notifications */}
//                 <div className="relative">
//                     <button
//                         type="button"
//                         onClick={() => setNotificationsOpen((prev) => !prev)}
//                         className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
//                     >
//                         <Bell className="h-5 w-5 text-slate-600" />

//                         {unreadCount > 0 && (
//                             <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
//                                 {unreadCount}
//                             </span>
//                         )}
//                     </button>

//                     {notificationsOpen && (
//                         <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4">
//                             <div className="flex items-center justify-between mb-3">
//                                 <h3 className="text-sm font-semibold text-slate-800">
//                                     Notifications
//                                 </h3>

//                                 <button
//                                     onClick={() => setNotificationsOpen(false)}
//                                     className="text-xs text-slate-500 hover:text-slate-700"
//                                 >
//                                     Close
//                                 </button>
//                             </div>

//                             <div className="space-y-3">
//                                 <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
//                                     <p className="text-sm font-medium text-slate-700">
//                                         New supplier added
//                                     </p>

//                                     <p className="text-xs text-slate-500 mt-1">
//                                         Supplier data updated successfully
//                                     </p>
//                                 </div>

//                                 <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
//                                     <p className="text-sm font-medium text-slate-700">
//                                         Analytics report ready
//                                     </p>

//                                     <p className="text-xs text-slate-500 mt-1">
//                                         Monthly report generated
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Profile Dropdown */}
//                 <div className="relative">
//                     <button
//                         type="button"
//                         onClick={() => setProfileOpen((prev) => !prev)}
//                         className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
//                     >
//                         <div className="h-8 w-8 rounded-full overflow-hidden">
//                             <img
//                                 src="/images/riana-profile.png"
//                                 alt="Profile"
//                                 className="h-full w-full object-cover"
//                             />
//                         </div>

//                         <div className="hidden md:block text-left">
//                             <p className="text-sm font-medium text-slate-700">
//                                 Riana Lynn
//                             </p>

//                             <p className="text-xs text-slate-500">
//                                 {isSupplierMode
//                                     ? "Supplier view"
//                                     : "Manufacturer view"}
//                             </p>
//                         </div>

//                         <ChevronDown
//                             className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""
//                                 }`}
//                         />
//                     </button>

//                     {profileOpen && (
//                         <>
//                             <div
//                                 className="fixed inset-0 z-40"
//                                 onClick={() => setProfileOpen(false)}
//                             />

//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2">
//                                 <button
//                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
//                                     onClick={() => {
//                                         router.push("/profile")
//                                         setProfileOpen(false)
//                                     }}
//                                 >
//                                     <User className="h-4 w-4 text-slate-400" />

//                                     Profile
//                                 </button>

//                                 <button
//                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
//                                     onClick={() => {
//                                         router.push("/account")
//                                         setProfileOpen(false)
//                                     }}
//                                 >
//                                     <Settings className="h-4 w-4 text-slate-400" />

//                                     Account Settings
//                                 </button>

//                                 <button
//                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
//                                     onClick={() => {
//                                         router.push("/knowledge-hub")
//                                         setProfileOpen(false)
//                                     }}
//                                 >
//                                     <BookOpen className="h-4 w-4 text-slate-400" />

//                                     Knowledge Hub
//                                 </button>

//                                 <a
//                                     href="https://example.com"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
//                                 >
//                                     <span className="flex items-center gap-3">
//                                         <KeyRound className="h-4 w-4 text-slate-400" />

//                                         API Portal
//                                     </span>

//                                     <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
//                                 </a>

//                                 <button
//                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
//                                     onClick={() => {
//                                         onToggleSupplierMode()
//                                         setProfileOpen(false)
//                                     }}
//                                 >
//                                     <Box className="h-4 w-4 text-slate-400" />

//                                     Toggle Supplier Mode
//                                 </button>

//                                 <div className="border-t border-slate-100 mt-1 pt-1">
//                                     <button
//                                         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
//                                         onClick={() => {
//                                             setProfileOpen(false)
//                                             onLogout?.()
//                                         }}
//                                     >
//                                         <LogOut className="h-4 w-4" />

//                                         Logout
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client"

import { useState } from "react"

import {
    Search,
    Bell,
    ChevronDown,
    Box,
    User,
    Settings,
    LogOut,
    BookOpen,
    ExternalLink,
    KeyRound,
    Check,
} from "lucide-react"

import { useRouter } from "next/navigation"

const brandsData = [
    {
        id: "1",
        name: "Journey Foods",
        color: "#14B8A6",
        productCount: 24,
    },
    {
        id: "2",
        name: "Healthy Snacks",
        color: "#8B5CF6",
        productCount: 12,
    },
]

export default function Navbar() {
    const router = useRouter()

    const [isSupplierMode, setIsSupplierMode] = useState(false)

    const [profileOpen, setProfileOpen] = useState(false)

    const [notificationsOpen, setNotificationsOpen] =
        useState(false)

    const [brandsDropdownOpen, setBrandsDropdownOpen] =
        useState(false)

    const [searchQuery, setSearchQuery] = useState("")

    const [selectedBrandFilter, setSelectedBrandFilter] =
        useState<string>("all")

    const unreadCount = 3

    const handleToggleSupplierMode = () => {
        setIsSupplierMode((prev) => !prev)
    }

    const handleLogout = () => {
        console.log("logout")
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        console.log(searchQuery)
    }

    return (
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white">
            {/* Logo */}
            <div className="flex items-center shrink-0">
                <img
                    src="/journey-foods-logo.svg"
                    alt="JourneyFoods"
                    className="h-8 w-auto"
                />
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search ingredients, suppliers, products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
                    />
                </form>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Brand Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setBrandsDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Box className="h-4 w-4" />

                        {selectedBrandFilter === "all"
                            ? "All brands"
                            : brandsData.find(
                                (b) => b.id === selectedBrandFilter
                            )?.name}

                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${brandsDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {brandsDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setBrandsDropdownOpen(false)}
                            />

                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                <div className="p-3 border-b border-slate-100">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Your Brands
                                    </p>
                                </div>

                                {/* All Brands */}
                                <div className="p-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedBrandFilter("all")
                                            setBrandsDropdownOpen(false)
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedBrandFilter === "all"
                                                ? "bg-teal-50 text-teal-700"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span>All brands</span>

                                        {selectedBrandFilter === "all" && (
                                            <Check className="h-4 w-4 text-teal-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Brand List */}
                                <div className="border-t border-slate-100">
                                    {brandsData.map((brand) => (
                                        <button
                                            key={brand.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedBrandFilter(brand.id)
                                                setBrandsDropdownOpen(false)
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${selectedBrandFilter === brand.id
                                                    ? "bg-teal-50 text-teal-700"
                                                    : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor: brand.color,
                                                    }}
                                                />

                                                {brand.name}
                                            </span>

                                            {selectedBrandFilter === brand.id && (
                                                <Check className="h-4 w-4 text-teal-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Supplier Mode */}
                {isSupplierMode && (
                    <button
                        type="button"
                        onClick={handleToggleSupplierMode}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-pink-600 bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                        <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />

                        Supplier Mode
                    </button>
                )}

                {/* Notifications */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setNotificationsOpen((prev) => !prev)
                        }
                        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Bell className="h-5 w-5 text-slate-600" />

                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setNotificationsOpen(false)}
                            />

                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Notifications
                                    </h3>

                                    <button
                                        onClick={() =>
                                            setNotificationsOpen(false)
                                        }
                                        className="text-xs text-slate-500 hover:text-slate-700"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <p className="text-sm font-medium text-slate-700">
                                            New supplier added
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Supplier data updated successfully
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <p className="text-sm font-medium text-slate-700">
                                            Analytics report ready
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Monthly report generated
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img
                                src="/images/riana-profile.png"
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-slate-700">
                                Riana Lynn
                            </p>

                            <p className="text-xs text-slate-500">
                                {isSupplierMode
                                    ? "Supplier view"
                                    : "Manufacturer view"}
                            </p>
                        </div>

                        <ChevronDown
                            className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {profileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setProfileOpen(false)}
                            />

                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-2">
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => {
                                        router.push("/profile")
                                        setProfileOpen(false)
                                    }}
                                >
                                    <User className="h-4 w-4 text-slate-400" />

                                    Profile
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => {
                                        router.push("/account")
                                        setProfileOpen(false)
                                    }}
                                >
                                    <Settings className="h-4 w-4 text-slate-400" />

                                    Account Settings
                                </button>

                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => {
                                        router.push("/knowledge-hub")
                                        setProfileOpen(false)
                                    }}
                                >
                                    <BookOpen className="h-4 w-4 text-slate-400" />

                                    Knowledge Hub
                                </button>

                                <a
                                    href="https://example.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-3">
                                        <KeyRound className="h-4 w-4 text-slate-400" />

                                        API Portal
                                    </span>

                                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                </a>

                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => {
                                        handleToggleSupplierMode()
                                        setProfileOpen(false)
                                    }}
                                >
                                    <Box className="h-4 w-4 text-slate-400" />

                                    Toggle Supplier Mode
                                </button>

                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            setProfileOpen(false)

                                            handleLogout()
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />

                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}