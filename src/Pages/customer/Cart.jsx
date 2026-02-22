import { Link } from "react-router-dom"

export default function Cart({ cartItems, removeFromCart }) {

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-[#EDE7DE] p-10 space-y-10">

      <h1 className="text-3xl font-semibold">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>
                  ₹{item.price} × {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Total: ₹{totalAmount}
            </h2>

            <Link
              to="/checkout"
              className="bg-[#1C1C1C] text-white px-6 py-2 rounded-md"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}