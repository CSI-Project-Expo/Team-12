import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle, FileText } from "lucide-react"
import api from "../../lib/api"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders')

        const mappedOrders = data.map(order => ({
          id: order._id.slice(-6).toUpperCase(), // short ID
          fullId: order._id,
          customer: order.customerId?.name || "Guest",
          amount: order.totalAmount,
          items: order.items.length,
          date: new Date(order.createdAt).toLocaleDateString("en-IN", {
            year: "numeric", month: "short", day: "numeric"
          }),
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        }))

        setOrders(mappedOrders)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to fetch orders.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500 dark:text-emerald-400" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 max-w-lg">
        <AlertTriangle size={24} />
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Orders</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Manage and track customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/50 rounded-2xl transition-colors duration-300">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            No orders found
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount (₹)</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/30">
                {orders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 font-mono text-xs">{order.id}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">{order.items}</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600 dark:text-emerald-400">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{order.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${order.status === "Paid" || order.status === "Completed"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}