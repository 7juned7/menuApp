import { useEffect, useState } from "react";

import foodimg from "../assets/FoodImages/chole-bhature.jpg"

import FoodItem from "../Components/FoodItem";
import Hero from "../Components/Hero";


export default function MenuPage() {
    const [menuItems, setMenuItems] = useState([])
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getmenu");
                if (!response.ok) {
                    throw new Error(` error in fetching${response.status}`)
                }
                const data = await response.json();

                setMenuItems(data.menu);

                return data;

            } catch (error) {
                console.error("Error fetching data:", error)
                return null
            }
        }
        fetchMenuData();

    }, [])


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
                {menuItems.map((item) => (

                    <div key={item._id} className="">


                        <FoodItem
                            id={item._id}
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
