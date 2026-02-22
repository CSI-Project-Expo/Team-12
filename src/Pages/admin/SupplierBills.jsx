export default function SupplierBills() {
  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold">
        Supplier Bills (OCR)
      </h1>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
        <h2 className="text-xl font-semibold">
          Upload Supplier Bill
        </h2>

        <input
          type="file"
          className="border p-2 rounded-md"
        />

        <button className="bg-[#1C1C1C] text-white px-5 py-2 rounded-md hover:scale-105 transition-all duration-300">
          Process OCR
        </button>
      </div>

      {/* OCR Raw Extract Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-xl font-semibold mb-4">
          OCR Extracted Data (Raw)
        </h2>

        <div className="text-gray-600 text-sm">
          <p>Product: Dal</p>
          <p>Quantity: 50</p>
          <p>Price: 110</p>
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">

          <thead className="bg-[#E6DED3]">
            <tr>
              <th className="px-6 py-4">Extracted Name</th>
              <th className="px-6 py-4">Matched Product</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Price</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="px-6 py-4">Dal</td>

              <td className="px-6 py-4">
                <select className="border px-2 py-1 rounded-md">
                  <option>Moong Dal</option>
                  <option>Urad Dal</option>
                </select>
              </td>

              <td className="px-6 py-4">
                <input
                  type="number"
                  defaultValue="50"
                  className="border px-2 py-1 rounded-md w-24"
                />
              </td>

              <td className="px-6 py-4">
                <input
                  type="number"
                  defaultValue="110"
                  className="border px-2 py-1 rounded-md w-24"
                />
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#1C1C1C] text-white px-6 py-3 rounded-md hover:scale-105 transition-all duration-300">
          Confirm & Update Stock
        </button>
      </div>

    </div>
  )
}