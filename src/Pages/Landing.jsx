import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Package, Zap, Shield } from "lucide-react"

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative flex justify-between items-center px-8 md:px-16 py-6">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">Stock</span>Flow
        </h1>

        <Link
          to="/login"
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 mt-24 md:mt-32">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-8">
            <Zap size={12} className="mr-1.5" />
            Next-Gen Inventory Platform
          </span>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
            Smart Inventory Management
            <span className="block mt-3 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Designed for Modern Retail
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-base md:text-lg max-w-2xl text-slate-400 leading-relaxed"
        >
          Manage stock effortlessly, prevent overselling in real-time, scan
          supplier bills with intelligent OCR, and receive AI-driven stock
          recommendations — all within one elegant platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="px-7 py-3 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200 text-center"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative max-w-5xl mx-auto mt-24 mb-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { icon: Package, title: "Real-time Stock", desc: "Atomic stock updates prevent overselling with concurrent request safety." },
          { icon: Zap, title: "OCR Processing", desc: "Upload supplier bills and auto-extract product data with intelligent OCR." },
          { icon: Shield, title: "Transaction Safe", desc: "ACID-compliant MongoDB transactions guarantee data integrity." },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800/50 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <feature.icon size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-100 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.section>

    </div>
  )
}