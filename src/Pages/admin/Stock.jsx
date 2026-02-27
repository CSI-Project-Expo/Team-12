import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertTriangle, FileText } from "lucide-react"
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Stock Movement Logs</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Track all stock changes across your inventory</p>
      </div>

      {movements.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/50 rounded-2xl transition-colors duration-300">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            No stock movements found
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Stock additions and sales will appear here.</p>
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
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Updated Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/30">
                {movements.map((move, idx) => (
                  <motion.tr
                    key={move.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{move.product}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${move.type === "Sale"
                        ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        : move.type === "Restock"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        }`}>
                        {move.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-black ${move.quantity < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{move.date}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-300">{move.updatedStock}</td>
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