import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag, Download, QrCode } from "lucide-react"
import QRCode from "qrcode"
import ThemeToggle from "../../components/ThemeToggle"
import { useTheme } from "../../context/ThemeContext"

export default function OrderConfirmation() {
  const location = useLocation()
  const state = location.state
  const { isDarkMode } = useTheme()

  // If there's no state, user navigated here directly, redirect to shops
  if (!state || !state.orderId) {
    return <Navigate to="/shops" replace />
  }

  const orderId = `ORD-${state.orderId.substring(state.orderId.length - 8).toUpperCase()}`
  const totalAmount = state.totalAmount
  const itemCount = state.itemCount
  const shopName = state.shopName
  const qrString = state.qrString

  const [qrSrc, setQrSrc] = useState("")

  useEffect(() => {
    if (qrString) {
      QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff"
        }
      })
        .then(url => setQrSrc(url))
        .catch(err => console.error("QR generation error:", err))
    }
  }, [qrString])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 md:p-10 transition-colors duration-300">

      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 p-8 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl max-w-md w-full text-center space-y-6 transition-colors duration-300"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto shadow-inner dark:shadow-none">
          <CheckCircle size={40} className="text-emerald-500 dark:text-emerald-400" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Thank you for your purchase.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl relative mt-4">

          {/* Ticket Header */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20 p-6 relative">
            {/* Cutouts for ticket effect */}
            <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-t border-r border-emerald-100 dark:border-slate-800 transition-colors duration-300"></div>
            <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-t border-l border-emerald-100 dark:border-slate-800 transition-colors duration-300"></div>

            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Confirmed Order
            </p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {orderId}
            </h2>
            {shopName && (
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Store: <span className="text-slate-700 dark:text-slate-200 font-bold">{shopName}</span>
              </p>
            )}
          </div>

          {/* Ticket Body (QR Code & Details) */}
          <div className="p-8 flex flex-col items-center bg-white dark:bg-slate-800 relative border-b border-dashed border-slate-200 dark:border-slate-600 transition-colors duration-300">
            {qrSrc ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm mb-6 transition-colors duration-300">
                <img src={qrSrc} alt="Bill QR Code" className="w-48 h-48 rounded-xl mix-blend-multiply dark:mix-blend-normal" />
              </div>
            ) : (
              <div className="w-56 h-56 bg-slate-100 dark:bg-slate-700/50 rounded-2xl mb-6 flex items-center justify-center animate-pulse">
                <QrCode className="text-slate-400 dark:text-slate-500" size={48} />
              </div>
            )}

            <p className="text-sm text-slate-800 dark:text-slate-300 font-bold mb-1">Present this Pass at the counter</p>
            <p className="text-xs font-medium text-slate-500">Scan for instant bill verification</p>
          </div>

          {/* Ticket Footer (Totals) */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center transition-colors duration-300">
            <div className="text-left">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Items</p>
              <p className="text-base font-black text-slate-700 dark:text-slate-300">{itemCount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Paid</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center w-full">
          {qrSrc && (
            <a
              href={qrSrc}
              download={`ticket-${orderId}.png`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-sm dark:shadow-none"
            >
              <Download size={18} />
              Save Ticket
            </a>
          )}
          <Link
            to="/shops"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
          >
            <ShoppingBag size={18} />
            Shop More
          </Link>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Your receipt has been sent to your email!<br />
            (Check Spam/Junk folder if not in Inbox)
          </p>
        </div>

      </motion.div>

    </div>
  )
}