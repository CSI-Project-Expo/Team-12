import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"

export default function AdminSignup() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [storeName, setStoreName] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, storeName, role: "admin" }),
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
                navigate("/admin/dashboard")
            } else {
                alert(data.message || "Signup failed")
            }
        } catch (error) {
            console.error("Signup error:", error)
            alert("Something went wrong. Please check if the server is running.")
        }
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#E6DED3] via-[#EDE7DE] to-[#D8CFC3] flex items-center justify-center overflow-hidden">

            {/* Soft Glow Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-[#A89B8A]/20 rounded-full blur-3xl"></div>
            </div>

            {/* Signup Card */}
            <div className="relative bg-white/60 backdrop-blur-md shadow-lg rounded-xl p-10 w-full max-w-md transition-all duration-300">

                <h2 className="text-3xl font-semibold text-center mb-8 text-[#1C1C1C]">
                    Create Admin Account
                </h2>

                <form onSubmit={handleSignup} className="flex flex-col gap-5">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A89B8A] transition-all duration-300"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A89B8A] transition-all duration-300"
                    />

                    <input
                        type="text"
                        placeholder="Store Name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                        className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A89B8A] transition-all duration-300"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A89B8A] transition-all duration-300"
                    />

                    <button
                        type="submit"
                        className="mt-4 px-6 py-3 bg-[#1C1C1C] text-white rounded-md hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        Register Store Admin
                    </button>

                    <div className="mt-4 flex justify-center text-sm text-[#1C1C1C]/80">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold underline hover:text-black">
                                Login
                            </Link>
                        </p>
                    </div>

                </form>

            </div>
        </div>
    )
}
