import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag } from "lucide-react"

export default function OrderConfirmation() {

  const orderId = "ORD" + Math.floor(Math.random() * 100000)

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-slate-800/50 p-10 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-emerald-400">
          Order Confirmed!
        </h1>

        <p className="text-slate-400">
          Thank you for your purchase.
        </p>

        <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Order ID
          </p>
          <p className="text-lg font-bold text-slate-100 mt-1 font-mono">
            {orderId}
          </p>
        </div>

        <p className="text-sm text-slate-500">
          A confirmation email will be sent shortly.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>

      </motion.div>

    </div>
  )
}