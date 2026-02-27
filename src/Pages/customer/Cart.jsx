import { Link, useNavigate } from "react-router-dom"
import { Trash2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import ThemeToggle from "../../components/ThemeToggle"

export default function Cart({ cartItems, removeFromCart, shopName, shopId }) {
  const navigate = useNavigate()

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-10 space-y-8 transition-colors duration-300">

      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <Link to={shopId ? `/shop/${shopId}` : "/shops"} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-4">
            <ArrowLeft size={16} />
            {shopId ? "Back to Shop" : "Back to Shops"}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pr-10">Your Cart</h1>
          {shopName && (
            <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
              Shopping from:
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold">
                {shopName}
              </span>
            </p>
          )}
          <p className="text-sm font-medium text-slate-500 mt-2">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart</p>
        </div>

        <ThemeToggle />
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm dark:shadow-none"
        >
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-4xl filter drop-shadow-sm">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your cart is empty</h2>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/shops')}
            className="mt-8 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 shadow-sm shadow-emerald-500/20 hover:-translate-y-0.5"
          >
            Browse Shops
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">

          {cartItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 p-5 rounded-2xl flex justify-between items-center shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md"
            >
              <div>
                <h2 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm font-medium text-slate-500">
                    ₹{item.price} <span className="text-slate-300 dark:text-slate-600 mx-1">×</span> {item.quantity}
                  </p>
                  <span className="text-slate-300 dark:text-slate-700">=</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{item.price * item.quantity}</span>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-200 active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl flex justify-between items-center shadow-sm dark:shadow-none mt-8"
          >
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Amount</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ₹<span className="text-emerald-600 dark:text-emerald-400">{totalAmount.toLocaleString('en-IN')}</span>
              </h2>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={cartItems.length === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none active:scale-95"
            >
              Proceed to Checkout
            </button>
          </motion.div>

        </div>
      )}

    </div>
  )
}