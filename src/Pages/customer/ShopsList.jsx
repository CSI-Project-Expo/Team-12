import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Store, MapPin, User, ArrowRight, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../lib/api"

export default function ShopsList() {
    const navigate = useNavigate()
    const [shops, setShops] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const userStr = localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("cart")
        localStorage.removeItem("cartDate")
        navigate("/login")
    }

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const { data } = await api.get("/shops")
                setShops(data)
            } catch (err) {
                console.error("Error fetching shops:", err)
                setError("Failed to load shops. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchShops()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Available Shops</h1>
                    <p className="text-sm text-slate-500 mt-1">Browse stores and their inventory</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-slate-900 border border-slate-800/50 p-6 rounded-2xl animate-pulse"
                        >
                            <div className="h-5 bg-slate-800 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-slate-800 rounded w-1/2 mb-3" />
                            <div className="h-4 bg-slate-800 rounded w-1/3 mb-6" />
                            <div className="h-10 bg-slate-800 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-slate-100 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 md:p-10 space-y-8">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Available Shops</h1>
                    <p className="text-sm text-slate-500 mt-1">Browse stores and their inventory</p>
                </div>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-sm text-slate-400">Hi, {user.name}</span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </div>

            {shops.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                >
                    <div className="text-6xl mb-4">🏪</div>
                    <h2 className="text-2xl font-semibold text-white">No shops available yet</h2>
                    <p className="text-gray-400 mt-2">Check back later for new stores.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shops.map((shop, idx) => (
                        <motion.div
                            key={shop._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.08 }}
                            className="bg-slate-900 border border-slate-800/50 p-6 rounded-2xl space-y-4 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Store size={20} className="text-emerald-400" />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-100">{shop.name}</h2>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <User size={14} className="text-slate-500" />
                                    <span>{shop.owner}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <MapPin size={14} className="text-slate-500" />
                                    <span>{shop.location}</span>
                                </div>
                            </div>

                            <Link
                                to={`/shop/${shop._id}`}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-emerald-500/25"
                            >
                                View Inventory
                                <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

        </div>
    )
}
