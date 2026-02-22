export default function Stock() {
  const movements = [
    {
      id: 1,
      product: "Moong Dal",
      type: "Restock",
      quantity: +20,
      date: "2026-02-20",
      updatedStock: 65,
    },
    {
      id: 2,
      product: "Urad Dal",
      type: "Sale",
      quantity: -5,
      date: "2026-02-20",
      updatedStock: 1,
    },
    {
      id: 3,
      product: "Basmati Rice",
      type: "Sale",
      quantity: -3,
      date: "2026-02-19",
      updatedStock: 9,
    },
    {
      id: 4,
      product: "Sugar",
      type: "Restock",
      quantity: +40,
      date: "2026-02-18",
      updatedStock: 80,
    },
  ]

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-semibold">
        Stock Movement Logs
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">

          <thead className="bg-[#E6DED3]">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Updated Stock</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((move) => (
              <tr
                key={move.id}
                className="border-t hover:bg-[#F4F0EA] transition-all duration-200"
              >
                <td className="px-6 py-4 font-medium">
                  {move.product}
                </td>

                <td className="px-6 py-4">
                  {move.type === "Sale" ? (
                    <span className="text-red-500 font-medium">
                      Sale
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Restock
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={
                      move.quantity < 0
                        ? "text-red-500 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    {move.quantity}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {move.date}
                </td>

                <td className="px-6 py-4">
                  {move.updatedStock}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}