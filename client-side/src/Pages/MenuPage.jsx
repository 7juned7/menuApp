import { useState } from "react";

import foodimg from "../assets/FoodImages/chole-bhature.jpg"

import FoodItem from "../Components/FoodItem";
const menuItems = [
    { id: 1, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 2, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 3, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 4, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 5, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 6, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
    { id: 7, name: "Chole Bhature", category: "Fast Food", price: 5, image: foodimg, rating: "4.5" },
];

export default function MenuPage() {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuItems.map((item, i) => (

                    <div key={i} className="bg-white px-2 pb-5 py-2 relative rounded-lg shadow-md text-center overflow-hidden">


                        <FoodItem
                            key={item.id}
                            rating={item.rating}
                            img={item.image}
                            alt={item.name}
                            price={item.price}
                            name={item.name}
                            selectedFood={item} />
                    </div>


                ))}
            </div>

        </div>
    );
}
