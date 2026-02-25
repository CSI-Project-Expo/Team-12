import { useState, useEffect } from "react"
import { Package, AlertTriangle, TrendingUp, IndianRupee } from "lucide-react"
import api from "../../lib/api"
import StatCard from "../../components/dashboard/StatCard"
import LowStockAlert from "../../components/dashboard/LowStockAlert"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [dailySales, setDailySales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, lowStockRes, dailyRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/products/low-stock"),
          api.get("/reports/sales-daily")
        ])
        setStats(statsRes.data)
        setLowStockProducts(lowStockRes.data)
        setDailySales(dailyRes.data.data || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-10 w-10 bg-slate-800 rounded-xl" />
              </div>
              <div className="h-8 w-20 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6 h-64 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
        <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="text-red-400 font-medium">{error}</p>
        <p className="text-slate-500 text-sm mt-1">Make sure the backend server is running.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          subtitle="Active inventory items"
          accent="indigo"
          index={0}
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={stats?.lowStockCount ?? 0}
          subtitle="Below threshold"
          accent="red"
          index={1}
        />
        <StatCard
          icon={TrendingUp}
          label="Today's Sales"
          value={formatCurrency(stats?.todaySales ?? 0)}
          subtitle={`${stats?.todaySalesCount ?? 0} transactions`}
          accent="emerald"
          index={2}
        />
        <StatCard
          icon={IndianRupee}
          label="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          subtitle={`${stats?.monthlySalesCount ?? 0} transactions`}
          accent="amber"
          index={3}
        />
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert products={lowStockProducts} />

      {/* Sales Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <h2 className="text-base font-semibold text-slate-100 mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          Sales Overview (Last 30 Days)
        </h2>

        <div className="h-72">
          {dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="dashRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#dashRevenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-slate-700 rounded-xl">
              <div className="text-center">
                <TrendingUp size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No sales data yet</p>
                <p className="text-slate-600 text-xs mt-1">Charts will appear once orders are placed</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  )
}