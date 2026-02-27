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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500 dark:text-emerald-400" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-4xl">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Manage your store and account preferences</p>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-medium ${message.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
        >
          {message.type === 'error' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
          <p>{message.text}</p>
        </motion.div>
      )}

      {/* Store Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <Store size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Store Information</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Basic details about your business</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { placeholder: "Store Name", type: "text", name: "storeName", label: "Store Name" },
            { placeholder: "Store Email", type: "email", name: "email", label: "Email Address" },
            { placeholder: "Phone Number", type: "text", name: "phone", label: "Phone Number" },
            { placeholder: "Address", type: "text", name: "location", label: "Location" },
          ].map(field => (
            <div key={field.name}>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Inventory Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Bell size={24} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Inventory Settings</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Configure stock alerts</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Low Stock Threshold</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              placeholder="e.g. 5"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Notification Email</label>
            <input
              type="email"
              name="notificationEmail"
              value={formData.notificationEmail}
              onChange={handleChange}
              placeholder="Alerts will be sent here"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <Shield size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Security</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Update your password</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm dark:shadow-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end pt-4 mb-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 dark:hover:shadow-emerald-500/10 disabled:opacity-50 active:scale-95"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>

    </div>
  )
}