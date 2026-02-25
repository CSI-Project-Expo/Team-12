import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle } from "lucide-react"
import api from "../../lib/api"

export default function Stock() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/audit-logs')

        // Map backend fields to UI fields
        const mappedMovements = data.map(log => ({
          id: log._id,
          product: log.productName || "Unknown Product",
          type: log.actionType === 'SALE_DEDUCTION' ? 'Sale' :
            log.actionType === 'RESTOCK' ? 'Restock' : 'Adjustment',
          quantity: log.newData?.quantity || 0,
          date: new Date(log.timestamp).toLocaleDateString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit"
          }),
          updatedStock: log.newData?.stock || 0,
        }))

        setMovements(mappedMovements)
      } catch (err) {
        console.error("Error fetching logs:", err)
        setError("Failed to fetch stock movements.")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-emerald-400" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3">
        <AlertTriangle size={20} />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Stock Movement Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Track all stock changes across your inventory</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Updated Stock</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((move, idx) => (
              <motion.tr
                key={move.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-200">{move.product}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${move.type === "Sale"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                    {move.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-semibold ${move.quantity < 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{move.date}</td>
                <td className="px-6 py-4 text-center text-slate-300">{move.updatedStock}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}