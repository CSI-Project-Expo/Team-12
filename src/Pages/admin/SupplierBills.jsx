import { motion } from "framer-motion"
import { Upload, ScanLine } from "lucide-react"

export default function SupplierBills() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Supplier Bills (OCR)</h1>
        <p className="text-sm text-slate-500 mt-1">Upload and process supplier bills with OCR</p>
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <h2 className="text-base font-semibold text-slate-100 mb-4">Upload Supplier Bill</h2>

        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors">
          <Upload size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-3">Drag & drop a bill image, or click to browse</p>
          <input
            type="file"
            className="hidden"
            id="bill-upload"
          />
          <label
            htmlFor="bill-upload"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
          >
            <Upload size={14} />
            Choose File
          </label>
        </div>

        <button className="mt-4 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25">
          <ScanLine size={16} />
          Process OCR
        </button>
      </motion.div>

      {/* OCR Raw Extract */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <h2 className="text-base font-semibold text-slate-100 mb-4">OCR Extracted Data (Raw)</h2>

        <div className="bg-slate-800/50 rounded-xl p-4 font-mono text-xs text-slate-400 space-y-1">
          <p>Product: Dal</p>
          <p>Quantity: 50</p>
          <p>Price: 110</p>
        </div>
      </motion.div>

      {/* Verification Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Extracted Name</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Matched Product</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-200">Dal</td>
              <td className="px-6 py-4">
                <select className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option>Moong Dal</option>
                  <option>Urad Dal</option>
                </select>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="number"
                  defaultValue="50"
                  className="w-24 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="number"
                  defaultValue="110"
                  className="w-24 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      <div className="flex justify-end">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25">
          Confirm & Update Stock
        </button>
      </div>

    </div>
  )
}