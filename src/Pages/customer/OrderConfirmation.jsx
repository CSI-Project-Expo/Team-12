import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag, Download, QrCode } from "lucide-react"
import QRCode from "qrcode"

export default function OrderConfirmation() {
  const location = useLocation()
  const state = location.state

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
        color: { dark: "#000000ff", light: "#ffffffff" }
      })
        .then(url => setQrSrc(url))
        .catch(err => console.error("QR generation error:", err))
    }
  }, [qrString])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-slate-800/50 p-10 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-emerald-400">
          Order Confirmed!
        </h1>

        <p className="text-slate-400">
          Thank you for your purchase.
        </p>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative mt-4">

          {/* Ticket Header (Jagged edge effect simulated with CSS or simple clean header) */}
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 relative">
            {/* Cutouts for ticket effect */}
            <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-slate-900 rounded-full border-t border-r border-slate-800"></div>
            <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-slate-900 rounded-full border-t border-l border-slate-800"></div>

            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">
              Confirmed Order
            </p>
            <h2 className="text-3xl font-bold text-slate-100 font-mono tracking-tight">
              {orderId}
            </h2>
            {shopName && (
              <p className="text-sm text-slate-400 mt-2 font-medium">
                Store: <span className="text-slate-200">{shopName}</span>
              </p>
            )}
          </div>

          {/* Ticket Body (QR Code & Details) */}
          <div className="p-8 flex flex-col items-center bg-slate-800 relative border-b border-dashed border-slate-600">
            {qrSrc ? (
              <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
                <img src={qrSrc} alt="Bill QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <div className="w-56 h-56 bg-slate-700/50 rounded-2xl mb-6 flex items-center justify-center animate-pulse">
                <QrCode className="text-slate-500" size={48} />
              </div>
            )}

            <p className="text-sm text-slate-300 font-medium mb-1">Present this Pass at the counter</p>
            <p className="text-xs text-slate-500">Scan for instant bill verification</p>
          </div>

          {/* Ticket Footer (Totals) */}
          <div className="p-6 bg-slate-800/80 flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Items</p>
              <p className="text-base font-semibold text-slate-300">{itemCount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Total Paid</p>
              <p className="text-xl font-bold text-emerald-400">₹{totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
          {qrSrc && (
            <a
              href={qrSrc}
              download={`ticket-${orderId}.png`}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-slate-700"
            >
              <Download size={16} />
              Download Ticket
            </a>
          )}
          <Link
            to="/shops"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-800/50">
          Your receipt has been sent to your email! (If you don't see it, please check your Spam/Junk folder and mark it as 'Not Spam')
        </p>

        <Link
          to="/shops"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>

      </motion.div>

    </div>
  )
}