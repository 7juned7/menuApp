import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import FoodPage from './Pages/FoodPage'
import { CartProvider } from './Context/CartContext'
import CartPage from './Pages/CartPage'
import { CheckoutPage } from './Pages/CheckoutPage'
import AdminPage from './Pages/AdminPage'
import { OrderProvider } from './Context/OrderContext'
createRoot(document.getElementById('root')).render(
  <OrderProvider>

    <CartProvider>

      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </StrictMode >
    </CartProvider>
  </OrderProvider>

)
