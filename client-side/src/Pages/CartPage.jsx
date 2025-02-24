import React from 'react'
import { Link } from 'react-router-dom';
import { useCartContext } from '../Context/CartContext';

const CartPage = () => {
    const { cart } = useCartContext();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log(cart)
    return (

        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                            <span className="text-lg">{item.name} (x{item.quantity})</span>
                            <span className="text-gray-600">${item.price * item.quantity}</span>
                            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => removeFromCart(index)}>Remove</button>
                        </div>
                    ))}
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            )}
            <div className="flex justify-between mt-4">
                <Link to="/" className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">Continue Shopping</Link>
                {cart.length > 0 && <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Checkout</button>}
            </div>
        </div>
    )
}

export default CartPage