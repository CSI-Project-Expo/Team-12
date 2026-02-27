import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../lib/api"
import ThemeToggle from "../../components/ThemeToggle"

export default function Shop({ cartItems, addToCart, currentShopId }) {
  const { shopId } = useParams()

  const [products, setProducts] = useState([])
  const [shopInfo, setShopInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantities, setQuantities] = useState({})
  const [addedProductId, setAddedProductId] = useState(null)
  const [animateCart, setAnimateCart] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/shops/${shopId}/products`)
        setProducts(data.products)
        setShopInfo(data.shop)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [shopId])

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
    const quantity = quantities[product._id] || 1
    addToCart(
      { id: product._id, name: product.name, price: product.price, stock: product.stock },
      quantity,
      shopId,
      shopInfo?.name || "Shop"
    )
    setQuantities(prev => ({ ...prev, [product._id]: 1 }))
    setAddedProductId(product._id)
    setTimeout(() => setAddedProductId(null), 1200)
    setAnimateCart(true)
    setTimeout(() => setAnimateCart(false), 400)
  }

  // Count items in cart for this shop only
  const cartCount = currentShopId === shopId ? cartItems.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-10 space-y-8 transition-colors duration-300">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/shops" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm shadow-emerald-500/20">
            Back to Shops
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-10 space-y-8 transition-colors duration-300">

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <Link to="/shops" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-4">
            <ArrowLeft size={16} />
            Back to Shops
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pr-10">{shopInfo?.name || "Shop Inventory"}</h1>
          <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
            {shopInfo?.owner ? (
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs">
                by {shopInfo.owner}
              </span>
            ) : "Browse and add items to your cart"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/cart"
            className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
          >
            <ShoppingCart size={18} />
            Cart
            <span className={`ml-1 flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-bold bg-white text-emerald-600 rounded-full shadow-sm ${animateCart ? 'animate-bounce' : ''}`}>
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-[50vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-12 text-center shadow-sm dark:shadow-none"
        >
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-4xl filter drop-shadow-sm">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">No products available</h2>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto">This shop hasn't added any products to their inventory yet. Check back later.</p>
          <Link
            to="/shops"
            className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all duration-200"
          >
            Browse Other Shops
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {products.map((product, idx) => {
            const qty = quantities[product._id] || 1
            const isOutOfStock = product.stock === 0
            const isAdded = addedProductId === product._id

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 ${isOutOfStock ? 'opacity-75' : ''}`}
              >
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                    Out of Stock
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight pr-12">{product.name}</h2>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-3 tracking-tight">₹{product.price}</p>
                  </div>

                  {!isOutOfStock && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500">{product.stock} available</span>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <button
                          onClick={() => decreaseQty(product._id)}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-500 transition-colors shadow-sm"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="font-semibold text-slate-700 dark:text-slate-200 w-6 text-center text-sm">{qty}</span>

                        <button
                          onClick={() => increaseQty(product._id, product.stock)}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-500 transition-colors shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full mt-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isOutOfStock
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : isAdded
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/50"
                      : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
                    }`}
                >
                  {isOutOfStock
                    ? "Unavailable"
                    : isAdded
                      ? "✓ Added"
                      : "Add to Cart"}
                </button>
              </motion.div>
            )
          })}

        </div>
      )}

    </div>
  )
}