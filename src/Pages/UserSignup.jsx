import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"

export default function UserSignup() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role: "user" }),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                }))
                navigate("/shop")
            } else {
                alert(data.message || "Signup failed")
            }
        } catch (error) {
            console.error("Signup error:", error)
            alert("Something went wrong. Please check if the server is running.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-slate-900 border border-slate-800/50 shadow-2xl rounded-2xl p-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold tracking-tight mb-2">
                        <span className="text-emerald-400">Stock</span><span className="text-slate-100">Flow</span>
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-100">Create User Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Start shopping from your favorite stores</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">

                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserPlus size={16} />
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>

                    <div className="mt-4 flex justify-center text-sm text-slate-500">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>

                </form>

            </motion.div>
        </div>
    )
}
