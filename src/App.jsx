import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Landing from "./Pages/Landing"
import Login from "./Pages/Login"
import UserSignup from "./Pages/UserSignup"
import AdminSignup from "./Pages/AdminSignup"

// Admin Pages
import Dashboard from "./Pages/admin/Dashboard"
import Products from "./Pages/admin/Products"
import Stock from "./Pages/admin/Stock"
import SupplierBills from "./Pages/admin/SupplierBills"
import Orders from "./Pages/admin/Orders"
import Settings from "./Pages/admin/Settings"

// Customer Pages
import Shop from "./Pages/customer/Shop"
import Cart from "./Pages/customer/Cart"
import Checkout from "./Pages/customer/Checkout"
import OrderConfirmation from "./Pages/customer/OrderConfirmation"

import AdminLayout from "./Layouts/AdminLayout"

function App() {

  const [cartItems, setCartItems] = useState([])
  const [cartExpired, setCartExpired] = useState(false)

  const getToday = () => {
    return new Date().toISOString().split("T")[0]
  }

  // Check cart expiry on load
  useEffect(() => {
    const storedDate = localStorage.getItem("cartDate")
    const today = getToday()

    if (storedDate && storedDate !== today) {
      setCartItems([])
      localStorage.removeItem("cartDate")
      setCartExpired(true)
    }
  }, [])

  const addToCart = (product, quantity) => {
    const today = getToday()
    const storedDate = localStorage.getItem("cartDate")

    if (!storedDate) {
      localStorage.setItem("cartDate", today)
    }

    const existing = cartItems.find(item => item.id === product.id)

    if (existing) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCartItems([
        ...cartItems,
        { ...product, quantity }
      ])
    }
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  return (
    <>
      {cartExpired && (
        <div className="bg-red-500 text-white text-center py-2">
          Your cart has expired because it was not ordered on the same day.
        </div>
      )}

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/signup/admin" element={<AdminSignup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<Stock />} />
          <Route path="supplier-bills" element={<SupplierBills />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/shop"
          element={<Shop cartItems={cartItems} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

      </Routes>
    </>
  )
}

export default App