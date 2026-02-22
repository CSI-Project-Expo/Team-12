import { useNavigate } from "react-router-dom"

export default function Checkout() {

  const navigate = useNavigate()

  const handleOrder = () => {

    const stockAvailable = Math.random() > 0.3

    if (stockAvailable) {
      navigate("/order-confirmation")
    } else {
      alert("Payment failed or item out of stock.")
    }
  }

  return (
    <div className="min-h-screen bg-[#EDE7DE] p-10 space-y-10">

      <h1 className="text-3xl font-semibold">
        Checkout
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-lg">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          onClick={handleOrder}
          className="w-full bg-[#1C1C1C] text-white py-3 rounded-md"
        >
          Place Order
        </button>

      </div>

    </div>
  )
}