"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import baseApi from '@/utils/api'
import { GoRepo } from 'react-icons/go';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
import { LuWorkflow } from "react-icons/lu";
import { FaDocker } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner';  // Import TailSpin loader

interface CiCDState {
  cicd: boolean,
  docker: boolean,
}

const RepoCiCD = () => {
  const { repo_name } = useParams()
  const [form, setForm] = useState<CiCDState>({
    cicd: true,
    docker: false,
  })
  const [branches, setBranches] = useState<string[]>(["main"])

  const { data, isLoading, error } = useQuery({
    queryKey: ['repo-cicd', repo_name],
    queryFn: async () => {
      const response = await baseApi.get(`/get-repo/${repo_name}/`)
      return response.data.data
    },
  })

  useEffect(() => {
    setBranches(data?.branches || ["main"]);
  }, [data])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center  p-5">
        <TailSpin height="80" width="80" color="#000" ariaLabel="loading" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className='w-full h-full p-5'>
      {/* Header */}
      <div className='flex justify-between  gap-5 border-b-2 border-gray-200 pb-5'>
        {/* Repo Info */}
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
        {/* Buttons */}
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

      {
        form.cicd && (
          <div>
            <form>
              <div className="flex flex-col justify-start mb-3">
                <label htmlFor="branches" className='text-slate-700 font-bold mb-1'>Branches</label>
                <input
                  value={branches.join(",") || ""}
                  onChange={(e) => setBranches(e.target.value.split(","))}
                  type="text"
                  placeholder='Enter your branches'
                  name="branch"
                  id="branch"
                  className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                />
              </div>
            </form>
          </div>
        )
      }

      {/* Docker Form */}
      {
        form.docker && (
          <div className='mt-5 h-screen p-4'>
            <div className='w-full flex items-center justify-center'>
              <p>Docker Coming Soon</p>
            </div>
          </div>
        )
      }

      {/* TailSpin Loader at the Bottom */}
      {isLoading && (
        <div className="w-full flex justify-center items-center py-4">
          <TailSpin height="40" width="40" color="#00BFFF" ariaLabel="loading" />
        </div>
      )}
    </div>
  )
}

export default RepoCiCD
