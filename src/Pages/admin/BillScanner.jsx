import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScanLine, CheckCircle, XCircle, Loader2, Search, ShoppingBag, Package, User, Calendar, IndianRupee, Upload, Camera } from "lucide-react"
import api from "../../lib/api"
import QRCodeScanner from "../../components/QRCodeScanner"

export default function BillScanner() {
    const [qrInput, setQrInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")
    const [scannerMode, setScannerMode] = useState("upload") // "upload" or "camera"
    const fileInputRef = useRef(null)

    const handleVerifyStr = async (str) => {
        if (!str || !str.trim()) {
            setError("Please enter a valid QR code.")
            return
        }

        setLoading(true)
        setError("")
        setResult(null)

        try {
            const { data } = await api.get(`/bills/verify/${encodeURIComponent(str.trim())}`)
            if (data.success) {
                setResult(data)
            }
        } catch (err) {
            const message = err.response?.data?.message || "Verification failed. Invalid QR code or server error."
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = () => handleVerifyStr(qrInput)

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Need dynamic import or use standard qr-scanner since html-qrcode is moved
            // But actually we can just use the html5-qrcode class directly since we installed it
            const { Html5Qrcode } = await import('html5-qrcode');
            const html5QrCode = new Html5Qrcode("reader");
            const decodedText = await html5QrCode.scanFile(file, true);
            setQrInput(decodedText);

            // clear the instance memory
            html5QrCode.clear();

            // verify
            handleVerifyStr(decodedText);
        } catch (err) {
            console.error("QR Scan Error:", err);
            setError("Could not find or read a QR code in the uploaded image.");
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        })

    return (
        <div className="space-y-8">

            {/* Search Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-8 shadow-sm dark:shadow-none"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <ScanLine size={20} className="text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Bill Verification</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Scan customer QR or enter code manually</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                            onClick={() => setScannerMode("camera")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scannerMode === "camera"
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                        >
                            <Camera size={16} />
                            Scan with Camera
                        </button>
                        <button
                            onClick={() => setScannerMode("upload")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scannerMode === "upload"
                                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                        >
                            <Upload size={16} />
                            Upload QR Image
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {scannerMode === "camera" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <QRCodeScanner
                                onScanSuccess={(decodedText) => {
                                    setQrInput(decodedText);
                                    handleVerifyStr(decodedText);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hidden reader div required by html5-qrcode for file uploads */}
                <div id="reader" style={{ display: 'none' }}></div>

                <AnimatePresence mode="wait">
                    {scannerMode === "upload" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-center mb-8 overflow-hidden"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                id="qr-upload"
                            />
                            <label
                                htmlFor="qr-upload"
                                className="flex flex-col items-center justify-center w-full max-w-sm h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-2xl cursor-pointer transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <Upload size={24} className="text-emerald-500 dark:text-emerald-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Click to upload QR image</p>
                                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG</p>
                            </label>
                        </motion.div>
                    )}
                </AnimatePresence>


                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Paste or enter QR code string..."
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono shadow-sm dark:shadow-none"
                    />
                    <button
                        onClick={handleVerify}
                        disabled={loading || !qrInput.trim()}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/25 dark:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        Verify
                    </button>
                </div>

                {
                    error && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm"
                        >
                            <XCircle size={16} />
                            {error}
                        </motion.div>
                    )
                }
            </motion.div >

            {/* Results */}
            {
                result && result.verified && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Verified Badge */}
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">Bill Verified ✓</h3>
                                <p className="text-sm text-emerald-600/80 dark:text-slate-400">This bill is authentic and matches our records</p>
                            </div>
                        </div>

                        {/* Sale Details */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <ShoppingBag size={18} className="text-emerald-500 dark:text-emerald-400" />
                                Sale Details
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                                    <p className="text-sm font-mono text-slate-700 dark:text-slate-200 truncate">{result.sale.id}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <IndianRupee size={10} /> Total
                                    </p>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.sale.totalAmount)}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Calendar size={10} /> Date
                                    </p>
                                    <p className="text-sm text-slate-700 dark:text-slate-200">{formatDate(result.sale.createdAt)}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${result.sale.status === "completed"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                        : result.sale.status === "pending"
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                        }`}>
                                        {result.sale.status}
                                    </span>
                                </div>
                            </div>

                            {result.sale.customer && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                                        <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{result.sale.customer.name}</p>
                                        <p className="text-xs text-slate-500">{result.sale.customer.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Items Table */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <Package size={14} /> Items ({result.sale.items.length})
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700/50 text-xs text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-transparent">
                                                <th className="text-left py-3 px-3">Product</th>
                                                <th className="text-left py-3 px-3">SKU</th>
                                                <th className="text-right py-3 px-3">Qty</th>
                                                <th className="text-right py-3 px-3">Price</th>
                                                <th className="text-right py-3 px-3">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {result.sale.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-transparent transition-colors">
                                                    <td className="py-3 px-3 text-slate-700 dark:text-slate-200">{item.productName}</td>
                                                    <td className="py-3 px-3 font-mono text-slate-500 text-xs">{item.sku}</td>
                                                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">{item.quantity}</td>
                                                    <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400">{formatCurrency(item.priceAtSale)}</td>
                                                    <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(item.subtotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-transparent">
                                                <td colSpan={4} className="py-3 px-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">Total</td>
                                                <td className="py-3 px-3 text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.sale.totalAmount)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </div >
    )
}
