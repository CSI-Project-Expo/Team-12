import { Link } from "react-router-dom"
import { Trash2, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function Cart({ cartItems, removeFromCart }) {

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Your Cart</h1>
        <p className="text-sm text-slate-500 mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart</p>
      </div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800/50 rounded-2xl p-12 text-center"
        >
          <ShoppingBag size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">Your cart is empty.</p>
          <Link to="/shop" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-2 inline-block">
            Continue Shopping
          </Link>
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
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}

          <div className="bg-slate-900 border border-slate-800/50 p-5 rounded-2xl flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-100">
              Total: <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </h2>

            <Link
              to="/checkout"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}