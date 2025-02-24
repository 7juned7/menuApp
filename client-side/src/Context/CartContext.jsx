import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    console.log(cart)
    useEffect(() => {
        console.log(cart)
    }, [cart])

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}