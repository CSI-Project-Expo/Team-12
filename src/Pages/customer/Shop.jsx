import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"

export default function Shop({ cartItems, addToCart }) {

  const products = [
    { id: 1, name: "Moong Dal", price: 120, stock: 45 },
    { id: 2, name: "Basmati Rice", price: 95, stock: 12 },
    { id: 3, name: "Urad Dal", price: 110, stock: 6 },
    { id: 4, name: "Sugar", price: 40, stock: 80 },
  ]

  const [quantities, setQuantities] = useState({})

  const increaseQty = (id, stock) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, stock)
    }))
  }

  const decreaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1)
    }))
  }

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1
    addToCart(product, quantity)
    setQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Shop Products</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and add items to your cart</p>
        </div>

        <Link
          to="/cart"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <ShoppingCart size={16} />
          Cart: {cartItems.length}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product, idx) => {
          const qty = quantities[product.id] || 1

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-slate-900 border border-slate-800/50 p-6 rounded-2xl space-y-4 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-base font-semibold text-slate-100">{product.name}</h2>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-emerald-400">₹{product.price}</p>
                <p className="text-xs text-slate-500">{product.stock} in stock</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(product.id)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <Minus size={14} />
                </button>

                <span className="font-semibold text-slate-200 w-8 text-center">{qty}</span>

                <button
                  onClick={() => increaseQty(product.id, product.stock)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Add to Cart
              </button>
            </motion.div>
          )
        })}

      </div>

    </div>
  )
}