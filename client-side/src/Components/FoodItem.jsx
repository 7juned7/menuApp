import React from 'react'
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';

const FoodItem = ({ rating, img, price, alt, name, id }) => {

  return (
    <Link to={"/food"} state={id} className="flex w-full drop-shadow-md bg-[white] shadow-[0_4px_6px_#f8dab0] justify-between p-2 rounded">
      <p className="absolute  flex items-center text-white right-2 rounded-lg bg-green-600 px-1 top-1 z-10" > {rating} <span span > <FaStar className="text-[12px]" /></span > </p >
      <div className="flex flex-col gap-2">
        <h2 className="text-md text-black font-semibold">{name}</h2>
        <p className='text-sm'>Topped with chicken,onion,capsicum,black olive</p>
        <p className="text-black-400 font-bold">From ${price}</p>

      </div>
      <img src={`data:image/jpeg;base64,${img}`} alt={alt} className=" w-25 h-25 rounded object-cover" />
    </Link>
  )
}

export default FoodItem