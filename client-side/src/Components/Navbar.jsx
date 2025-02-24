import React from 'react'
import { FaCartArrowDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <nav className="bg-white shadow-md py-6 px-8 flex justify-between items-center">
            <div>Order Food</div>
            <Link to="/cart" className='relative' ><FaCartArrowDown className='text-4xl z-10 relative' /> <span className='absolute bottom-7 left-7 bg-black text-white p-1 w-6 h-6 items-center flex justify-center rounded-full'>0</span></Link>

        </nav>
    )
}

export default Navbar