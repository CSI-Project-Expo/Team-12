import { useState } from "react"
import { Link } from "react-router-dom"

export default function Shop({ cartItems, addToCart }) {

  const products = [
    { id: 1, name: "Moong Dal", price: 120, stock: 45 },
    { id: 2, name: "Basmati Rice", price: 95, stock: 12 },
    { id: 3, name: "Urad Dal", price: 110, stock: 6 },
    { id: 4, name: "Sugar", price: 40, stock: 80 },
  ]

  const [quantities, setQuantities] = useState({})

  const increaseQty = (id, stock) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, stock)
    }))
  }

  const decreaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1)
    }))
  }

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1
    addToCart(product, quantity)
    setQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  return (
    <div className="min-h-screen bg-[#EDE7DE] p-10 space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Shop Products
        </h1>

        <Link
          to="/cart"
          className="bg-[#1C1C1C] text-white px-5 py-2 rounded-md"
        >
          Cart: {cartItems.length}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {products.map((product) => {
          const qty = quantities[product.id] || 1

          return (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
              <h2 className="text-lg font-semibold">
                {product.name}
              </h2>

              <p className="text-gray-600">
                ₹{product.price}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">

                <button
                  onClick={() => decreaseQty(product.id)}
                  className="px-3 py-1 border rounded-md"
                >
                  -
                </button>

                <span className="font-medium">
                  {qty}
                </span>

                <button
                  onClick={() => increaseQty(product.id, product.stock)}
                  className="px-3 py-1 border rounded-md"
                >
                  +
                </button>

              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#1C1C1C] text-white py-2 rounded-md"
              >
                Add to Cart
              </button>
            </div>
          )
        })}

      </div>

    </div>
  )
}