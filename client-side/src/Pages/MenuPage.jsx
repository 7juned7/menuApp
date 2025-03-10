import { useState } from "react";

import foodimg from "../assets/FoodImages/chole-bhature.jpg"

import FoodItem from "../Components/FoodItem";
import Hero from "../Components/Hero";
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
        <div className="min-h-screen bg-[#FFF8EE] p-0 items-center justify-center flex flex-col ">
            <Hero />
            <div className="my-10 w-full">
                <h2 className=" text-center text-xl p-2 font-bold text-[#2A435D]" >It's the food that you Love</h2>
                <div className="flex gap-4 justify-around flex-wrap my-10">
                    <div className="flex gap-4">
                        <input className="w-50 h-10 border" type="text" />
                        <button className="bg-red-500 px-4 text-white" >Go</button>

                    </div>
                    <div>

                        <select

                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose an option --</option>
                            <option value="pizza">🍕 Pizza</option>
                            <option value="burger">🍔 Burger</option>
                            <option value="sushi">🍣 Sushi</option>
                            <option value="pasta">🍝 Pasta</option>
                            <option value="salad">🥗 Salad</option>
                        </select>
                    </div>
                </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>
            <div className="flex flex-col w-full p-4 gap-4">
                {menuItems.map((item, i) => (

                    <div key={i} className="">


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
