import { motion } from "framer-motion"

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
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track customer orders</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
              <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount (₹)</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="text-center px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-200 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4 text-slate-300">{order.customer}</td>
                <td className="px-6 py-4 text-center text-slate-400">{order.items}</td>
                <td className="px-6 py-4 text-right text-slate-300">₹{order.amount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-slate-400">{order.date}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                    }`}>
                    {order.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}