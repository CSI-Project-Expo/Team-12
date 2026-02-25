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
  Sparkles,
  X,
  Send
} from "lucide-react"

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Stock", path: "/admin/stock", icon: BarChart3 },
  { label: "Supplier Bills", path: "/admin/supplier-bills", icon: FileText },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Settings", path: "/admin/settings", icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [aiOpen, setAiOpen] = useState(false)
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
    <div className="min-h-screen flex bg-slate-950 text-slate-100">

      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/50 flex flex-col fixed h-full z-20">

        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-800/50">
          <h2 className="text-xl font-bold tracking-tight">
            <span className="text-emerald-400">Stock</span>Smart
          </h2>
          <p className="text-xs text-slate-500 mt-1">Inventory Management</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">{currentPage}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      {/* ─── Floating AI Button ─── */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center z-30"
      >
        <Sparkles size={20} />
      </button>

      {/* ─── AI Slide-in Panel ─── */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 z-40 ${aiOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            <h3 className="text-base font-semibold">AI Assistant</h3>
          </div>
          <button
            onClick={() => setAiOpen(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 text-sm text-slate-400">
          <p className="font-medium text-slate-300">Ask questions like:</p>

          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Which items are overstocked?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              What is selling fastest?
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              What should I reorder?
            </li>
          </ul>

          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Ask something..."
              className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when AI is open */}
      {aiOpen && (
        <div
          onClick={() => setAiOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        />
      )}

    </div>
  )
}