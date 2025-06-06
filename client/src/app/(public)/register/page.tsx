"use client"
import React,{useState} from 'react'
import { useMutation } from '@tanstack/react-query'
import baseApi from '@/utils/api'
import { useRouter } from 'next/navigation'
import loginbg from "@/assets/login.jpg"
import { TailSpin } from 'react-loader-spinner'
const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
        phone:""
      })
  const router = useRouter()
  const {mutate,isPending ,  isError } = useMutation({
    mutationFn: (data: any) => baseApi.post("/register/", data),
    onSuccess: (data) => {
      router.replace("/login")
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(formData.password !== formData.confirm_password){
      alert("Password and Confirm Password do not match")
      return
    }
    mutate(formData)
    setFormData({
      email: "",
      password: "",
      confirm_password: "",
      phone:""
    })
  }



  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${loginbg.src})` }}>
    <div className="flex flex-col bg-white lg:w-[400px] md:w-[380] w-[350px]  items-center justify-center border-2 border-green-300 rounded-md p-4 shadow-md">
      <h1 className='text-2xl font-bold text-slate-700 mb-5'>Login</h1>
      <form onSubmit={
        (e) => handleSubmit(e)
      } className='w-full px-2'
      >
        <div className="flex flex-col justify-start mb-3">
          <label htmlFor="email" className='text-slate-700 font-bold mb-1'>Email</label>
          <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" placeholder='Enter your email' name="email" id="email" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400' />
        </div>
        <div className="flex flex-col justify-start mb-3">
            <label htmlFor="phone" className='text-slate-700 font-bold mb-1'>Phone</label>
            <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} type="text" placeholder='Enter your phone' name="phone" id="phone" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400' />
        </div>
        <div className="flex flex-col align-bottom mb-4">
          <label htmlFor="password" className='text-slate-700 font-bold'>Password</label>
          <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" placeholder='Enter your password' name="password" id="password" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400' />
        </div>
        <div className="flex flex-col align-bottom mb-4">
            <label htmlFor="confirm_password" className='text-slate-700 font-bold'>Confirm Password</label>
            <input value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} type="password" placeholder='Enter your password' name="confirm_password" id="confirm_password" className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400' />
        </div>
        <button type="submit" className='bg-green-500 text-white font-bold py-2 px-4 rounded-md w-full' >
          {isPending ? <div className='flex items-center justify-center'><TailSpin color="#fff" height={20} width={20}   /></div> : "Login"}
        </button>
      </form>
    </div>

  </div>
  )
}

export default Register;