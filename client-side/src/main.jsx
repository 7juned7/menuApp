import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import FoodPage from './Pages/FoodPage'
import { CartProvider } from './Context/CartContext'
import CartPage from './Pages/CartPage'
createRoot(document.getElementById('root')).render(
  <CartProvider>

    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </StrictMode >
  </CartProvider>

)
