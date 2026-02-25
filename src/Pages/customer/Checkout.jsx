import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import api from "../../lib/api"

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-lg">

        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-100 mb-2">Checkout</h1>
          <p className="text-gray-400 mb-2">Complete your order</p>
          {shopName && (
            <p className="text-sm text-emerald-400">
              Ordering from: {shopName} • {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} • ₹{totalAmount.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0f172a] border border-gray-700 rounded-2xl shadow-xl p-8 space-y-4 transition-all duration-300"
        >

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Phone Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <CreditCard size={16} />
            )}
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </motion.div>

      </div>

    </div>
  )
}