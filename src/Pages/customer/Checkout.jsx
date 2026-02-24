import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export default function Checkout() {

  const navigate = useNavigate()

  const handleOrder = () => {
    const stockAvailable = Math.random() > 0.3

    if (stockAvailable) {
      navigate("/order-confirmation")
    } else {
      alert("Payment failed or item out of stock.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Complete your order</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8 space-y-4 max-w-lg"
      >

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Phone Number</label>
          <input
            type="text"
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>

        <button
          onClick={handleOrder}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <CreditCard size={16} />
          Place Order
        </button>

      </motion.div>

    </div>
  )
}