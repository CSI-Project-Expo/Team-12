export default function Orders() {
  const orders = [
    {
      id: "ORD001",
      customer: "Rahul Sharma",
      amount: 1450,
      items: 3,
      date: "2026-02-21",
      status: "Paid",
    },
    {
      id: "ORD002",
      customer: "Priya Mehta",
      amount: 780,
      items: 2,
      date: "2026-02-21",
      status: "Pending",
    },
    {
      id: "ORD003",
      customer: "Amit Verma",
      amount: 2240,
      items: 5,
      date: "2026-02-20",
      status: "Paid",
    },
  ]

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-semibold">
        Orders
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">

          <thead className="bg-[#E6DED3]">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Amount (₹)</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-[#F4F0EA] transition-all duration-200"
              >
                <td className="px-6 py-4 font-medium">
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  {order.customer}
                </td>

                <td className="px-6 py-4">
                  {order.items}
                </td>

                <td className="px-6 py-4">
                  {order.amount}
                </td>

                <td className="px-6 py-4">
                  {order.date}
                </td>

                <td className="px-6 py-4">
                  {order.status === "Paid" ? (
                    <span className="text-green-600 font-medium">
                      Paid
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      Pending
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}