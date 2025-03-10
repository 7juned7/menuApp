import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [itemCount, setItemCount] = useState(0);


    useEffect(() => {
        console.log(cart)
    }, [cart])

    return (
        <CartContext.Provider value={{ cart, setCart, itemCount, setItemCount }}>
            {children}
        </CartContext.Provider>
    )
}