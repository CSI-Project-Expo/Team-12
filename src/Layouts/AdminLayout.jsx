import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import {
  LayoutDashboard,
  Package,
  BarChart3,
  FileText,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  TrendingUp,
  ScanLine
} from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"
import { AnimatePresence } from "framer-motion"

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Stock", path: "/admin/stock", icon: BarChart3 },
  { label: "Reports", path: "/admin/reports", icon: TrendingUp },
  { label: "Bill Scanner", path: "/admin/bill-scanner", icon: ScanLine },
  { label: "Supplier Bills", path: "/admin/supplier-bills", icon: FileText },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Settings", path: "/admin/settings", icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const userStr = localStorage.getItem("user")
  const user = userStr ? JSON.parse(userStr) : { name: "Admin", role: "admin" }

  const currentPage = navItems.find(item => location.pathname.startsWith(item.path))?.label || "Dashboard"

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/50 flex flex-col fixed h-full z-20 transition-colors duration-300">

        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800/50">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-1.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Package size={18} strokeWidth={3} />
            </div>
            <span className="text-emerald-500 dark:text-emerald-400">Stock</span>
            <span className="text-slate-900 dark:text-slate-100">Smart</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2 ml-10">Inventory Admin</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300
                  ${isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
              >
                <Icon size={18} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-emerald-500 dark:text-emerald-400" : ""} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 w-full"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">{currentPage}</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-black shadow-sm dark:shadow-none">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 capitalize -mt-0.5">{user.role}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/30">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} strokeWidth={2.5} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

    </div>
  )
}