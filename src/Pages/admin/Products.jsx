import { useState, useEffect } from "react"
import { Package, Plus, X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../../lib/api"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    sku: "",
    lowStockThreshold: "5"
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get("/products")
      setProducts(res.data)
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddProduct = (e) => {
    e.preventDefault()
    // API POST not available yet — will be added when product creation route exists
    const product = {
      _id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      stock: Number(newProduct.stock),
      price: Number(newProduct.price),
      sku: newProduct.sku,
      lowStockThreshold: Number(newProduct.lowStockThreshold)
    }
    setProducts([product, ...products])
    setNewProduct({ name: "", category: "", stock: "", price: "", sku: "", lowStockThreshold: "5" })
    setIsOpen(false)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Products Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search products by name, category, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {search ? "No products match your search" : "No products found. Add your first product!"}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price (₹)</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => {
                const isLow = product.stock < (product.lowStockThreshold || 5)
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-200">{product.name}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-400">{product.category || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${isLow ? "text-red-400" : "text-slate-200"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">₹{product.price}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLow
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                        {isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-100">Add New Product</h2>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                {[
                  { key: "name", label: "Product Name", type: "text" },
                  { key: "sku", label: "SKU", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "stock", label: "Stock Quantity", type: "number" },
                  { key: "price", label: "Price (₹)", type: "number" },
                  { key: "lowStockThreshold", label: "Low Stock Threshold", type: "number" },
                ].map(field => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.label}
                    required
                    value={newProduct[field.key]}
                    onChange={(e) => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}