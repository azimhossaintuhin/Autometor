"use client"
import React from 'react'
import { LiaWalletSolid } from "react-icons/lia";

import { useAuth } from '@/context/AuthContext';
const Navbar = () => {
    const { user } = useAuth();
    const userData = user?.data
    return (
        <header className='bg-white shadow-md  mb-2 flex justify-between items-center px-4'>
            <div className=' px-4 py-2  text-4xl  '>
                <h1>Deautometor</h1>
            </div>
            <div className='flex items-center  '>
                {/* wallet info */}
                <LiaWalletSolid className='text-2xl item' />
                <p className='text-md text-gray-500 ml-2 '>{userData?.balance} Tk</p>
            </div>
        </header>
    )
}

export default Navbar
