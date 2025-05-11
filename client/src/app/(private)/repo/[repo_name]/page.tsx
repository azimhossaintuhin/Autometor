"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import baseApi from '@/utils/api'
import { GoRepo } from 'react-icons/go';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
import { LuWorkflow } from "react-icons/lu";
import { FaDocker } from "react-icons/fa";

const RepoCiCD = () => {
  const { repo_name } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['repo-cicd', repo_name],
    queryFn: async () => {
      const response = await baseApi.get(`/get-repo/${repo_name}/`)
      return response.data.data
    },
  })

  console.log(data)

  return (
    
   <div className='w-full h-full p-5'>
    <div className='flex justify-between  gap-5 border-b-2 border-gray-200 pb-5'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 text-gray-700'>
        <GoRepo className='text-2xl' />
        <h1 className='text-2xl font-bold'>{data?.name}</h1>
        </div>
        <p className='text-sm text-gray-500'>{data?.description}</p>
        <div className='flex items-center  gap-4'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 text-gray-700'>
              <div className='w-2 h-2 rounded-full bg-gray-600'></div>
              <p className='text-sm font-bold'>{data?.language}</p>
            </div>
          </div>
          <div className='flex items-center gap-2 text-gray-700'>
            <FaStar className='text-sm text-yellow-500  ' />
            <p className='text-sm font-bold'>{data?.stars}</p>    
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2'>
        <button className='flex items-center gap-2 text-white bg-emerald-700 px-4 py-2 rounded-md'>
          <LuWorkflow className='text-sm' />
          <p className='text-sm font-bold'>Create Workflow</p>
        </button>
        <button className='flex items-center gap-2 text-white bg-emerald-700 px-4 py-2 rounded-md' disabled>
          <FaDocker className='text-sm' />
          <p className='text-sm font-bold'>Dockerize (Coming Soon)</p>
        </button>
      </div>
    </div>

   </div>
  )
}

export default RepoCiCD
