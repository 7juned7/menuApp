import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className='p-10 font-extrabold text-center text-xl' >Our Branches</div>
            <div className='bg-red-500'>
                <div className='flex justify-around text-center p-5 gap-'>

                    <div className='flex flex-col'>
                        <h2 className='text-white font-bold text-xl' >Robert Food</h2>
                        <p className='text-white'>1986 Hilltop DriveBorger,TX 79007</p>
                        <button className='text-green-500'>Click to View Google Map</button>
                    </div>
                    <div className='flex flex-col'>
                        <h2 className='text-white font-bold text-xl' >Robert Food</h2>
                        <p className='text-white'>1986 Hilltop DriveBorger,TX 79007</p>
                        <button className='text-green-500'>Click to View Google Map</button>
                    </div>

                </div>
                <div className='bg-black text-white text-center p-10'>
                    Copyright 2024 © |foodiee
                </div>
            </div>
        </div>
    )
}

export default Footer