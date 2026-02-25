import { Link, useNavigate } from "react-router-dom"
import { Trash2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function Cart({ cartItems, removeFromCart, shopName, shopId }) {
  const navigate = useNavigate()

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">

      <div>
        <Link to={shopId ? `/shop/${shopId}` : "/shops"} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-3">
          <ArrowLeft size={14} />
          {shopId ? "Back to Shop" : "Back to Shops"}
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Your Cart</h1>
        {shopName && (
          <p className="text-sm text-emerald-400 mt-1">Shopping from: {shopName}</p>
        )}
        <p className="text-sm text-slate-500 mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart</p>
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
          <p className="text-gray-400 mt-2">Add items from a shop to get started.</p>
          <button
            onClick={() => navigate('/shops')}
            className="mt-6 px-6 py-2 bg-white text-black rounded-lg hover:scale-105 transition-all font-medium"
          >
            Browse Shops
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">

          {cartItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-slate-900 border border-slate-800/50 p-5 rounded-2xl flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-slate-200">{item.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  ₹{item.price} × {item.quantity} = <span className="text-emerald-400 font-medium">₹{item.price * item.quantity}</span>
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 active:scale-95"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}

          <div className="bg-slate-900 border border-slate-800/50 p-5 rounded-2xl flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-100">
              Total: <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </h2>

            <button
              onClick={() => navigate('/checkout')}
              disabled={cartItems.length === 0}
              className="bg-gradient-to-r from-white to-gray-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}

    </div>
  )
}