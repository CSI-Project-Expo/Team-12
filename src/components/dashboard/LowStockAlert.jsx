import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export default function LowStockAlert({ products = [] }) {
    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-100">Low Stock Alerts</h3>
                        <p className="text-xs text-slate-500">All products are well-stocked</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">No items require restocking at this time.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/50">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-100">Low Stock Alerts</h3>
                    <p className="text-xs text-slate-500">
                        {products.length} product{products.length > 1 ? "s" : ""} below threshold
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800/50">
                            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Threshold</th>
                            <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => {
                            const isCritical = product.stock <= 2
                            return (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                                    className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-6 py-3 font-medium text-slate-200">{product.name}</td>
                                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">{product.sku}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`font-semibold ${isCritical ? "text-red-400" : "text-amber-400"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center text-slate-400">{product.lowStockThreshold}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCritical
                                                ? "bg-red-500/10 text-red-400"
                                                : "bg-amber-500/10 text-amber-400"
                                            }`}>
                                            {isCritical ? "Critical" : "Warning"}
                                        </span>
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}
