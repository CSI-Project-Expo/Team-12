import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E6DED3] via-[#EDE7DE] to-[#D8CFC3] text-[#1C1C1C] overflow-hidden">

      {/* Soft Glow Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#A89B8A]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative flex justify-between items-center px-10 py-7">
        <h1 className="text-2xl font-semibold tracking-wide">
          StockFlow
        </h1>

        <Link
          to="/login"
          className="px-6 py-2.5 bg-[#A89B8A] text-white rounded-md
                     hover:bg-[#948777] transition-all duration-300 shadow-sm"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 mt-32">

        <h2 className="text-5xl md:text-6xl font-semibold leading-tight max-w-4xl">
          Smart Inventory Management
          <span className="block mt-4 text-[#A89B8A]">
            Designed for Modern Retail
          </span>
        </h2>

        <p className="mt-10 text-lg max-w-2xl text-gray-700 leading-relaxed">
          Manage stock effortlessly, prevent overselling in real-time, scan
          supplier bills with intelligent OCR, and receive AI-driven stock
          recommendations — all within one elegant platform.
        </p>

        <div className="mt-12 flex gap-6">
          <Link
            to="/login"
            className="px-7 py-3 bg-[#1C1C1C] text-white rounded-md
                       hover:scale-105 transition-all duration-300 shadow-md"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-7 py-3 border border-[#A89B8A] rounded-md
                       hover:bg-[#DCD4C8] transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>

    </div>
  )
}