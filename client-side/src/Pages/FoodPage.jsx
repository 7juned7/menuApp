import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { useCartContext } from '../Context/CartContext';

const FoodPage = () => {
    const { cart, setCart } = useCartContext();
    const location = useLocation();

    const food = location.state
    const [quantity, setQuantity] = useState(1);
    const increaseQty = () => setQuantity(quantity + 1);
    const decreaseQty = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const addToCart = (food) => {
        setCart([...cart, { ...food, quantity }]);

    }
    const goToBuy = (food) => {
        setCart([...cart, { ...food, quantity }]);

    }


    return (
        <>
            <Navbar />
            <div className="p-6 flex gap-6 items-center">
                <img src={food.image} alt={food.name} className="w-1/2 h-64 object-cover rounded" />
                <div className="space-y-4 w-1/2">
                    <h2 className="text-2xl font-bold">{food.name}</h2>
                    <p className="text-gray-600">Category: {food.category}</p>
                    <p className="text-gray-600">Price: ${food.price}</p>
                    <div className="flex items-center gap-4">
                        <label className="text-gray-700">Qty:</label>
                        <button className="px-3 py-1 bg-gray-300 rounded" onClick={decreaseQty}><FaMinus /></button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <button className="px-3 py-1 bg-gray-300 rounded" onClick={increaseQty}><FaPlus /></button>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() => addToCart(food, quantity)}
                        >
                            Add to Cart
                        </button>

                        <Link to="../cart"
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() => goToBuy(food, quantity)}
                        >
                            Buy
                        </Link>
                    </div>
                </div>
            </div>
        </>

    )
}

export default FoodPage