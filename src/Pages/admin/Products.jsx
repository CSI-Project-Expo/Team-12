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

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/products", {
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        stock: Number(newProduct.stock),
        price: Number(newProduct.price),
        lowStockThreshold: Number(newProduct.lowStockThreshold)
      })
      setProducts([res.data, ...products])
      setNewProduct({ name: "", category: "", stock: "", price: "", sku: "", lowStockThreshold: "5" })
      setIsOpen(false)
    } catch (err) {
      console.error("Error adding product:", err)
      const errMsg = err.response?.data?.message || "Failed to add product"
      alert(errMsg)
    }
  }

  return (
    <div className="space-y-6 p-6 lg:p-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Products Inventory</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">{products.length} total products</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 dark:hover:shadow-emerald-500/10 active:scale-95"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search products by name, category, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/50 rounded-2xl m-6 transition-colors duration-300">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
              {search ? "No products match your search" : "No products found. Add your first product!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price (₹)</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/30">
                {filteredProducts.map((product, idx) => {
                  const isLow = product.stock < (product.lowStockThreshold || 5)
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{product.name}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs font-medium">{product.sku}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{product.category || "—"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-black ${isLow ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-200"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 dark:text-emerald-400">₹{product.price}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${isLow
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                          : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                          }`}>
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Add New Product</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Fill in the details for the new inventory item.</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                {[
                  { key: "name", label: "Product Name", type: "text" },
                  { key: "sku", label: "SKU", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "stock", label: "Stock Quantity", type: "number" },
                  { key: "price", label: "Price (₹)", type: "number" },
                  { key: "lowStockThreshold", label: "Low Stock Threshold", type: "number", hint: "Alert when stock goes below this number" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={`e.g. ${field.label}`}
                      required
                      value={newProduct[field.key]}
                      onChange={(e) => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
                    />
                    {field.hint && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{field.hint}</p>}
                  </div>
                ))}

                <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}