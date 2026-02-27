import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertTriangle, Plus, Link as LinkIcon, Save } from "lucide-react"
import api from "../../lib/api"

export default function SupplierBills() {
  const [products, setProducts] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [billItems, setBillItems] = useState([
    { id: 1, matchedProductId: "", quantity: 0, price: 0 }
  ])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        setProducts(data)
      } catch (err) {
        console.error("Failed to load products")
      }
    }
    fetchProducts()
  }, [])

  const handleUpdateItem = (id, field, value) => {
    setBillItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const addRow = () => {
    setBillItems(prev => [...prev, { id: Date.now(), matchedProductId: "", quantity: 0, price: 0 }])
  }

  const removeItem = (id) => {
    if (billItems.length === 1) return;
    setBillItems(prev => prev.filter(item => item.id !== id))
  }

  const confirmAndUpdate = async () => {
    const validItems = billItems.filter(item => item.matchedProductId && item.quantity > 0)

    if (validItems.length === 0) {
      setMessage({ type: "error", text: "Please match at least one product and specify a quantity > 0." })
      return
    }

    setIsUpdating(true)
    setMessage({ type: "", text: "" })

    try {
      for (const item of validItems) {
        const product = products.find(p => p._id === item.matchedProductId)
        if (product) {
          const newStock = Number(product.stock) + Number(item.quantity)
          await api.put(`/products/${product._id}`, {
            stock: newStock,
            price: Number(item.price) > 0 ? Number(item.price) : undefined
          })
        }
      }
      setMessage({ type: "success", text: "Stock updated successfully!" })
      setBillItems([{ id: 1, matchedProductId: "", quantity: 0, price: 0 }])

      // Refresh products list
      const { data } = await api.get('/products')
      setProducts(data)

    } catch (err) {
      console.error(err)
      setMessage({ type: "error", text: "Failed to update stock." })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-6 lg:p-10 max-w-6xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Supplier Bills Integration</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Manually enter and match incoming stock from supplier invoices</p>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-medium ${message.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
        >
          {message.type === 'error' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
          <p>{message.text}</p>
        </motion.div>
      )}

      {/* Verification Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 md:p-8 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <LinkIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Match & Update Stock</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Link bill items to your inventory</p>
            </div>
          </div>
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[40%]">Inventory Product</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quantity (Add)</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">New Price <span className="font-normal normal-case opacity-70 ml-1">(Optional)</span></th>
                <th className="text-center py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {billItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors duration-200 group">
                  <td className="py-4 px-6">
                    <select
                      value={item.matchedProductId}
                      onChange={(e) => handleUpdateItem(item.id, 'matchedProductId', e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:bg-white dark:hover:bg-slate-700/50 cursor-pointer shadow-sm dark:shadow-none appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                      <option value="" disabled className="text-slate-400">Select a product to match...</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (Current Stock: {p.stock})</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity === 0 ? '' : item.quantity}
                      placeholder="0"
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      className="w-32 mx-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:bg-white dark:hover:bg-slate-700/50 shadow-sm dark:shadow-none"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="relative w-32 mx-auto">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={item.price === 0 ? '' : item.price}
                        placeholder="0.00"
                        onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-8 pr-4 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:bg-white dark:hover:bg-slate-700/50 shadow-sm dark:shadow-none"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={billItems.length === 1}
                      className="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      title={billItems.length === 1 ? "Cannot remove last row" : "Remove row"}
                    >
                      <AlertTriangle size={18} className="rotate-180 hidden" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Stock additions are permanent. Double check quantities.
          </p>
          <button
            onClick={confirmAndUpdate}
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/10 disabled:opacity-50 active:scale-95 w-full sm:w-auto"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
            {isUpdating ? "Updating Inventory..." : "Confirm & Update Stock"}
          </button>
        </div>
      </motion.div>

    </div>
  )
}
