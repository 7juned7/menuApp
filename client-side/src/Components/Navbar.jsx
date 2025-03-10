import React from 'react'
import { FaCartArrowDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.svg"
import { useCartContext } from '../Context/CartContext';
import SubNav from './SubNav';
const Navbar = () => {
    const { itemCount } = useCartContext();
    return (
        <>
            <SubNav />
            <nav className="bg-[#FFF8EE] shadow-md py-4 px-8 flex justify-between items-center">
                <img className='w-15' src={logo} alt="logo" />
                <ul className='flex gap-5 font-bold'>
                    <li>HOME</li>
                    <li>ABOUT</li>
                </ul>
                <Link to="/cart" className='relative' ><FaCartArrowDown className='text-4xl z-10 relative' /> <span className='absolute bottom-7 left-7 bg-black text-white p-1 w-6 h-6 items-center flex justify-center rounded-full'>{itemCount}</span></Link>

            </nav>
        </>
    )
}

export default Navbar