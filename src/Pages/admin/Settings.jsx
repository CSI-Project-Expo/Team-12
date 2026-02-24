import { motion } from "framer-motion"
import { Store, Shield, Bell } from "lucide-react"

export default function Settings() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your store and account preferences</p>
      </div>

      {/* Store Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Store size={20} className="text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-100">Store Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { placeholder: "Store Name", type: "text" },
            { placeholder: "Store Email", type: "email" },
            { placeholder: "Phone Number", type: "text" },
            { placeholder: "Address", type: "text" },
          ].map(field => (
            <input
              key={field.placeholder}
              type={field.type}
              placeholder={field.placeholder}
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
          ))}
        </div>
      </motion.div>

      {/* Inventory Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Bell size={20} className="text-amber-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-100">Inventory Settings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Low Stock Alert Threshold"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
          <input
            type="email"
            placeholder="Notification Email"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Shield size={20} className="text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-100">Security</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25">
          Save Settings
        </button>
      </div>

    </div>
  )
}