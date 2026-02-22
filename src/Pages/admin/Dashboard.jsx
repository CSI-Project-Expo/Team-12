export default function Dashboard() {
  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold">
        Dashboard Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-2xl font-semibold mt-2">124</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <h2 className="text-2xl font-semibold mt-2 text-red-500">8</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-sm text-gray-500">Today's Sales</p>
          <h2 className="text-2xl font-semibold mt-2">₹12,450</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-[1.02]">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <h2 className="text-2xl font-semibold mt-2">₹2,48,000</h2>
        </div>

      </div>

      {/* Chart Section Placeholder */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-xl font-semibold mb-4">
          Sales Overview
        </h2>

        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart will be added here
        </div>
      </div>

    </div>
  )
}