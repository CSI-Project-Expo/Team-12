import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    TrendingUp, BarChart3, Package, Loader2, AlertTriangle, IndianRupee,
    ShoppingCart, PieChart
} from "lucide-react"
import api from "../../lib/api"
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend
} from "recharts"

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16"]

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            {payload.map((entry, idx) => (
                <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
                    {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("revenue")
                        ? `₹${entry.value.toLocaleString("en-IN")}`
                        : entry.value}
                </p>
            ))}
        </div>
    )
}

export default function Reports() {
    const [dailySales, setDailySales] = useState([])
    const [monthlyRevenue, setMonthlyRevenue] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [breakdown, setBreakdown] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true)
                const [dailyRes, monthlyRes, topRes, breakdownRes] = await Promise.all([
                    api.get("/reports/sales-daily"),
                    api.get("/reports/revenue-monthly"),
                    api.get("/reports/top-products"),
                    api.get("/reports/sales-breakdown")
                ])
                setDailySales(dailyRes.data.data)
                setMonthlyRevenue(monthlyRes.data.data)
                setTopProducts(topRes.data.data)
                setBreakdown(breakdownRes.data.data)
            } catch (err) {
                console.error("Reports fetch error:", err)
                setError("Failed to load reports data")
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [])

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="text-emerald-400 animate-spin" />
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

    const breakdownData = breakdown
        ? [
            { name: "Completed", value: breakdown.completed.count, amount: breakdown.completed.totalAmount },
            { name: "Pending", value: breakdown.pending.count, amount: breakdown.pending.totalAmount },
            { name: "Cancelled", value: breakdown.cancelled.count, amount: breakdown.cancelled.totalAmount }
        ].filter(d => d.value > 0)
        : []

    // Summary stats
    const totalRevenue30d = dailySales.reduce((sum, d) => sum + d.revenue, 0)
    const totalOrders30d = dailySales.reduce((sum, d) => sum + d.orders, 0)

    return (
        <div className="space-y-8">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <IndianRupee size={18} className="text-emerald-400" />
                        </div>
                        <p className="text-sm text-slate-400">30-Day Revenue</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{formatCurrency(totalRevenue30d)}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <ShoppingCart size={18} className="text-indigo-400" />
                        </div>
                        <p className="text-sm text-slate-400">30-Day Orders</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{totalOrders30d}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Package size={18} className="text-amber-400" />
                        </div>
                        <p className="text-sm text-slate-400">Top Seller</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-100 truncate">
                        {topProducts.length > 0 ? topProducts[0].productName : "—"}
                    </p>
                </motion.div>
            </div>

            {/* Daily Sales Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-slate-100">Daily Revenue (Last 30 Days)</h2>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailySales} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Monthly Revenue + Sales Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Revenue Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 size={18} className="text-indigo-400" />
                        <h2 className="text-base font-semibold text-slate-100">Monthly Revenue (12 Months)</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Sales Breakdown Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart size={18} className="text-amber-400" />
                        <h2 className="text-base font-semibold text-slate-100">Sales Breakdown</h2>
                    </div>
                    <div className="h-64">
                        {breakdownData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={breakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {breakdownData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                                </RechartsPie>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                No sales data available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Top Products Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Package size={18} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-slate-100">Top Selling Products (Last 30 Days)</h2>
                </div>

                {topProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="text-left py-3 px-3">#</th>
                                    <th className="text-left py-3 px-3">Product</th>
                                    <th className="text-left py-3 px-3">SKU</th>
                                    <th className="text-right py-3 px-3">Qty Sold</th>
                                    <th className="text-right py-3 px-3">Orders</th>
                                    <th className="text-right py-3 px-3">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, idx) => (
                                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-amber-500/20 text-amber-400" :
                                                    idx === 1 ? "bg-slate-400/20 text-slate-300" :
                                                        idx === 2 ? "bg-orange-500/20 text-orange-400" :
                                                            "bg-slate-700/50 text-slate-500"
                                                }`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-slate-200 font-medium">{product.productName}</td>
                                        <td className="py-3 px-3 font-mono text-slate-500 text-xs">{product.sku}</td>
                                        <td className="py-3 px-3 text-right text-slate-300">{product.totalQuantity}</td>
                                        <td className="py-3 px-3 text-right text-slate-400">{product.orderCount}</td>
                                        <td className="py-3 px-3 text-right text-emerald-400 font-medium">{formatCurrency(product.totalRevenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
                        No sales data available for the last 30 days
                    </div>
                )}
            </motion.div>

        </div>
    )
}
