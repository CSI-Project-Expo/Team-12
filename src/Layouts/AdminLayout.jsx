import { Link, Outlet } from "react-router-dom"
import { useState } from "react"

export default function AdminLayout() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#EDE7DE] text-[#1C1C1C] relative">

      {/* Sidebar */}
      <aside className="w-64 bg-[#D8CFC3] p-6 flex flex-col shadow-md">
        <h2 className="text-2xl font-semibold mb-10">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-4 text-sm font-medium">

          <Link
            to="/admin/dashboard"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Products
          </Link>

          <Link
            to="/admin/stock"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Stock
          </Link>

          <Link
            to="/admin/supplier-bills"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Supplier Bills
          </Link>

          <Link
            to="/admin/orders"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Orders
          </Link>

          <Link
            to="/admin/settings"
            className="hover:text-[#A89B8A] transition-all duration-200"
          >
            Settings
          </Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>

      {/* Floating AI Button */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-8 right-8 bg-[#1C1C1C] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
      >
        AI
      </button>

      {/* AI Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
          aiOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">AI Assistant</h3>
          <button
            onClick={() => setAiOpen(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-sm text-gray-700">
          <p>
            Ask questions like:
          </p>

          <ul className="mt-4 space-y-2">
            <li>• Which items are overstocked?</li>
            <li>• What is selling fastest?</li>
            <li>• What should I reorder?</li>
          </ul>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Ask something..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
            />
          </div>
        </div>
      </div>

      {/* Overlay when AI is open */}
      {aiOpen && (
        <div
          onClick={() => setAiOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        />
      )}

    </div>
  )
}