import React from 'react'
import clock from "../assets/icons/watch_icon.svg"
import phone from "../assets/icons/phone_icon.svg"
const SubNav = () => {
    return (
        <div className='bg-red-500 flex gap-5 md:px-10 px-1 py-1'>
            <div className='flex gap-2'>
                <img src={clock} alt="clock" />

                <p className='text-white text-sm'> 7:30 AM-9:30 PM</p>

            </div>
            <div className='flex gap-2'>
                <img src={phone} alt="phone" />
                <p className='text-white text-sm'>+880 1630 225 015</p>

            </div>
        </div>
    )
}

export default SubNav