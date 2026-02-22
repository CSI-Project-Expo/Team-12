import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Temporary mock login
  const handleLogin = (e) => {
    e.preventDefault()

    // Later backend will decide role.
    // For now we simulate:
    if (email.includes("admin")) {
      navigate("/admin/dashboard")
    } else {
      navigate("/shop")
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6DED3] via-[#EDE7DE] to-[#D8CFC3] flex items-center justify-center overflow-hidden">

      {/* Soft Glow Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A89B8A]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white/60 backdrop-blur-md shadow-lg rounded-xl p-10 w-full max-w-md transition-all duration-300">

        <h2 className="text-3xl font-semibold text-center mb-8 text-[#1C1C1C]">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Login
          </button>

        </form>

      </div>
    </div>
  )
}