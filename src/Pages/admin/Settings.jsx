export default function Settings() {
  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold">
        Settings
      </h1>

      {/* Store Information */}
      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          Store Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Store Name"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

          <input
            type="email"
            placeholder="Store Email"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

          <input
            type="text"
            placeholder="Address"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

        </div>
      </div>

      {/* Inventory Settings */}
      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          Inventory Settings
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="number"
            placeholder="Low Stock Alert Threshold"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

          <input
            type="email"
            placeholder="Notification Email"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          Security
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="password"
            placeholder="New Password"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
          />

        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#1C1C1C] text-white px-6 py-3 rounded-md hover:scale-105 transition-all duration-300 shadow-md">
          Save Settings
        </button>
      </div>

    </div>
  )
}