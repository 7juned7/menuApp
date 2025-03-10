import React from 'react'
import banner from "../assets/banner.svg"
const Hero = () => {
    return (
        <div className='bg-cover w-full bg-cente relative  bg-no-repeat h-64  text-center flex items-center justify-center flex-col text-white'
            style={{ backgroundImage: `url(${banner})` }}>
            <div className='inset-0 bg-black absolute opacity-40 z-10' ></div>
            <h2 className='text-3xl z-20 font-bold'>ITEMS</h2>
            <p className='z-20'>Lorem ipsum, dolor sit amet consectetur  aperiam facilis alias ducimus?</p>
        </div>
    )
}

export default Hero