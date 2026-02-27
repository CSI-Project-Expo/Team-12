import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard, ArrowLeft } from "lucide-react"
import api from "../../lib/api"
import ThemeToggle from "../../components/ThemeToggle"

export default function Checkout({ cartItems, shopId, shopName, clearCart }) {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 0
  )

  const handleOrder = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in all fields.")
      return
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const orderPayload = {
        shopId,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        customerName: name,
        customerEmail: email,
        customerPhone: phone
      }

      const { data } = await api.post("/orders", orderPayload)

      // Clear cart after successful order
      if (clearCart) clearCart()

      navigate("/order-confirmation", {
        state: {
          orderId: data.orderId,
          totalAmount: data.totalAmount,
          itemCount: data.itemCount,
          shopName,
          qrString: data.qrString
        }
      })

    } catch (err) {
      console.error("Order error:", err)
      const message = err.response?.data?.message || "Failed to place order. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 md:p-10 transition-colors duration-300">

      {/* Top Header Section inside Checkout */}
      <div className="w-full max-w-lg mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-4">
            <ArrowLeft size={16} />
            Return to Cart
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Checkout</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Complete your order details securely.</p>
          {shopName && (
            <p className="text-sm font-medium text-slate-500 mt-2 flex flex-col gap-1.5">
              <span className="flex items-center gap-2">
                Ordering from:
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold shadow-sm dark:shadow-none">
                  {shopName}
                </span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} • Total: <span className="font-bold text-slate-600 dark:text-slate-300">₹{totalAmount.toLocaleString('en-IN')}</span>
              </span>
            </p>
          )}
        </div>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg perspective-1000">

        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-10 space-y-6 transition-all duration-300"
        >

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">1</span>
              Customer Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 shadow-sm dark:shadow-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 shadow-sm dark:shadow-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 shadow-sm dark:shadow-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="text-lg flex-shrink-0">⚠️</span>
              {error}
            </motion.div>
          )}

          <div className="pt-4 mt-8 border-t border-slate-100 dark:border-slate-800/50">
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <CreditCard size={18} />
              )}
              {loading ? "Processing Order..." : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
            </button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Secure Checkout
            </p>
          </div>

        </motion.div>

      </div>

    </div>
  )
}