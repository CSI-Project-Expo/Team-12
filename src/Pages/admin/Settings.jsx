import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Store, Shield, Bell, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import api from "../../lib/api"

export default function Settings() {
  const [formData, setFormData] = useState({
    storeName: "", email: "", phone: "", location: "",
    lowStockThreshold: 5, notificationEmail: "",
    password: "", confirmPassword: ""
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile')
        setFormData(prev => ({
          ...prev,
          storeName: data.storeName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          lowStockThreshold: data.lowStockThreshold || 5,
          notificationEmail: data.notificationEmail || ""
        }))
      } catch (err) {
        console.error("Profile fetch error:", err)
        setMessage({ type: "error", text: "Failed to load settings." })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      return
    }

    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const payload = {
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        lowStockThreshold: Number(formData.lowStockThreshold),
        notificationEmail: formData.notificationEmail
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const { data } = await api.put('/auth/profile', payload)

      // Update local storage user data
      const oldUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...oldUser, ...data }))

      setMessage({ type: "success", text: "Settings saved successfully!" })
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }))
    } catch (err) {
      console.error("Save error:", err)
      const errText = err.response?.data?.message || "Failed to save settings."
      setMessage({ type: "error", text: errText })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-emerald-400" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your store and account preferences</p>
      </div>

      {message.text && (
        <div className={`px-6 py-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/10 border border-red-500 text-red-400' : 'bg-emerald-500/10 border border-emerald-500 text-emerald-400'
          }`}>
          {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          <p>{message.text}</p>
        </div>
      )}

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
            { placeholder: "Store Name", type: "text", name: "storeName" },
            { placeholder: "Store Email", type: "email", name: "email" },
            { placeholder: "Phone Number", type: "text", name: "phone" },
            { placeholder: "Address", type: "text", name: "location" },
          ].map(field => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
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
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            placeholder="Low Stock Alert Threshold"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
          <input
            type="email"
            name="notificationEmail"
            value={formData.notificationEmail}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (Leave blank to keep current)"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Save Settings
        </button>
      </div>

    </div>
  )
}