import { motion } from "framer-motion"

export default function Stock() {
  const movements = [
    {
      id: 1,
      product: "Moong Dal",
      type: "Restock",
      quantity: +20,
      date: "2026-02-20",
      updatedStock: 65,
    },
    {
      id: 2,
      product: "Urad Dal",
      type: "Sale",
      quantity: -5,
      date: "2026-02-20",
      updatedStock: 1,
    },
    {
      id: 3,
      product: "Basmati Rice",
      type: "Sale",
      quantity: -3,
      date: "2026-02-19",
      updatedStock: 9,
    },
    {
      id: 4,
      product: "Sugar",
      type: "Restock",
      quantity: +40,
      date: "2026-02-18",
      updatedStock: 80,
    },
  ]

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