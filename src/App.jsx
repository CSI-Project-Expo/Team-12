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
import ShopsList from "./Pages/customer/ShopsList"
import Shop from "./Pages/customer/Shop"
import Cart from "./Pages/customer/Cart"
import Checkout from "./Pages/customer/Checkout"
import OrderConfirmation from "./Pages/customer/OrderConfirmation"

import AdminLayout from "./Layouts/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  const [cartItems, setCartItems] = useState([])
  const [cartShopId, setCartShopId] = useState(null)
  const [cartShopName, setCartShopName] = useState("")
  const [cartExpired, setCartExpired] = useState(false)

  const getToday = () => {
    return new Date().toISOString().split("T")[0]
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart)
        setCartItems(parsed.items || [])
        setCartShopId(parsed.shopId || null)
        setCartShopName(parsed.shopName || "")
      } catch (e) {
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Check cart expiry on load
  useEffect(() => {
    const storedDate = localStorage.getItem("cartDate")
    const today = getToday()

    if (storedDate && storedDate !== today) {
      setCartItems([])
      setCartShopId(null)
      setCartShopName("")
      localStorage.removeItem("cartDate")
      localStorage.removeItem("cart")
      setCartExpired(true)
    }
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify({
        shopId: cartShopId,
        shopName: cartShopName,
        items: cartItems
      }))
    } else {
      localStorage.removeItem("cart")
    }
  }, [cartItems, cartShopId, cartShopName])

  const addToCart = (product, quantity, shopId, shopName) => {
    const today = getToday()
    const storedDate = localStorage.getItem("cartDate")

    if (!storedDate) {
      localStorage.setItem("cartDate", today)
    }

    // If switching shops, clear cart
    if (cartShopId && cartShopId !== shopId) {
      setCartItems([])
      setCartShopId(shopId)
      setCartShopName(shopName)
    }

    // Set the shop if not set
    if (!cartShopId) {
      setCartShopId(shopId)
      setCartShopName(shopName)
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id)
      if (updated.length === 0) {
        setCartShopId(null)
        setCartShopName("")
      }
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    setCartShopId(null)
    setCartShopName("")
    localStorage.removeItem("cart")
    localStorage.removeItem("cartDate")
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
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="stock" element={<Stock />} />
          <Route path="supplier-bills" element={<SupplierBills />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/shops"
          element={<ProtectedRoute allowedRoles={['user']}><ShopsList /></ProtectedRoute>}
        />
        <Route
          path="/shop/:shopId"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Shop cartItems={cartItems} addToCart={addToCart} currentShopId={cartShopId} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                shopName={cartShopName}
                shopId={cartShopId}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Checkout
                cartItems={cartItems}
                shopId={cartShopId}
                shopName={cartShopName}
                clearCart={clearCart}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/order-confirmation" element={<ProtectedRoute allowedRoles={['user']}><OrderConfirmation /></ProtectedRoute>} />

      </Routes>
    </>
  )
}

export default App