import React from 'react'
import loginbg from  "@/assets/login.jpg"
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${loginbg.src})` }}>
        <div className="flex flex-col bg-white w-[400px] items-center justify-center border-2 border-green-300 rounded-md p-4 shadow-md">
            <h1 className='text-2xl font-bold text-slate-700 mb-5'>Login</h1>
           <form action="" className='w-full px-2'>
            <div className="flex flex-col justify-start mb-3">
                <label htmlFor="email" className='text-slate-700 font-bold mb-1'>Email</label>
                <input type="email" placeholder='Enter your email' name="email" id="email" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'  />
            </div>
            
            <div className="flex flex-col align-bottom mb-4">
                <label htmlFor="password" className='text-slate-700 font-bold'>Password</label>
                <input type="password" placeholder='Enter your password' name="password" id="password" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'  />
            </div>
            <button type="submit" className='bg-green-500 text-white font-bold py-2 px-4 rounded-md w-full'>Login</button>
           </form>
        </div>

    </div>
  )
}

export default Login;