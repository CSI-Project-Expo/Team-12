import { useState } from "react"

export default function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: "Moong Dal", category: "Pulses", stock: 45, price: 120 },
    { id: 2, name: "Basmati Rice", category: "Grains", stock: 12, price: 95 },
    { id: 3, name: "Urad Dal", category: "Pulses", stock: 6, price: 110 },
    { id: 4, name: "Sugar", category: "Essentials", stock: 80, price: 40 },
  ])

  const [isOpen, setIsOpen] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    price: ""
  })

  const handleAddProduct = (e) => {
    e.preventDefault()

    const product = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      stock: Number(newProduct.stock),
      price: Number(newProduct.price)
    }

    setProducts([...products, product])
    setNewProduct({ name: "", category: "", stock: "", price: "" })
    setIsOpen(false)
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Products Inventory
        </h1>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1C1C1C] text-white px-5 py-2.5 rounded-md hover:scale-105 transition-all duration-300 shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">

          <thead className="bg-[#E6DED3]">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price (₹)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-[#F4F0EA] transition-all duration-200"
              >
                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                <td className="px-6 py-4">
                  {product.category}
                </td>

                <td className="px-6 py-4">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  {product.price}
                </td>

                <td className="px-6 py-4">
                  {product.stock < 10 ? (
                    <span className="text-red-500 font-medium">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      In Stock
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 space-x-3">
                  <button className="text-[#A89B8A] hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-6">
              Add New Product
            </h2>

            <form onSubmit={handleAddProduct} className="space-y-4">

              <input
                type="text"
                placeholder="Product Name"
                required
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
              />

              <input
                type="text"
                placeholder="Category"
                required
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                required
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
              />

              <input
                type="number"
                placeholder="Price"
                required
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A89B8A]"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1C1C] text-white rounded-md hover:scale-105 transition-all duration-300"
                >
                  Add
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}