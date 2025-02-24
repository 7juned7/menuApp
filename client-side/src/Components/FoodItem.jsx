import React from 'react'
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';

const FoodItem = ({ rating, img, price, alt, name, selectedFood }) => {

  return (
    <Link to={"/food"} state={selectedFood}>
      < p className="absolute  flex items-center text-white right-2 rounded-lg bg-green-600 px-1 top-1 z-10" > {rating} <span span > <FaStar className="text-[12px]" /></span > </p >
      <img src={img} alt={alt} className="w-full h-32 object-cover mb-4 rounded hover:scale-[1.1] cursor-pointer" />
      <div className="flex justify-between">
        <h2 className="text-lg text-gray-400 font-semibold">{name}</h2>
        <p className="text-gray-400">${price}</p>

      </div>
    </Link>
  )
}

export default FoodItem