import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertTriangle, Plus } from "lucide-react"
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
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Supplier Bills</h1>
        <p className="text-sm text-slate-500 mt-1">Manually enter incoming stock from supplier bills</p>
      </div>

      {message.text && (
        <div className={`px-6 py-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/10 border border-red-500 text-red-400' : 'bg-emerald-500/10 border border-emerald-500 text-emerald-400'
          }`}>
          {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          <p>{message.text}</p>
        </div>
      )}

      {/* Verification Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-800/50">
          <h2 className="text-base font-semibold text-slate-100">Match & Update Stock</h2>
          <button onClick={addRow} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">+ Add Row</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Inventory Product</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity (Add)</th>
                <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">New Price (Optional)</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map(item => (
                <tr key={item.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <select
                      value={item.matchedProductId}
                      onChange={(e) => handleUpdateItem(item.id, 'matchedProductId', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      className="w-24 mx-auto bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                      className="w-24 mx-auto bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={confirmAndUpdate}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          Confirm & Update Stock
        </button>
      </div>

    </div>
  )
}
