import { Link } from "react-router-dom"

export default function OrderConfirmation() {

  const orderId = "ORD" + Math.floor(Math.random() * 100000)

  return (
    <div className="min-h-screen bg-[#EDE7DE] flex items-center justify-center p-10">

      <div className="bg-white p-10 rounded-xl shadow-md max-w-md w-full text-center space-y-6">

        <h1 className="text-2xl font-semibold text-green-600">
          Order Confirmed!
        </h1>

        <p>
          Thank you for your purchase.
        </p>

        <div className="bg-[#F4F0EA] p-4 rounded-md">
          <p className="font-medium">
            Order ID:
          </p>
          <p className="text-lg font-semibold">
            {orderId}
          </p>
        </div>

        <p className="text-sm text-gray-600">
          A confirmation email will be sent shortly.
        </p>

        <Link
          to="/shop"
          className="inline-block bg-[#1C1C1C] text-white px-6 py-3 rounded-md"
        >
          Continue Shopping
        </Link>

      </div>

    </div>
  )
}