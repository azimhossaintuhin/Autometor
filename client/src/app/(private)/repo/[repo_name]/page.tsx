"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery,useMutation} from '@tanstack/react-query'
import baseApi from '@/utils/api'
import { GoRepo } from 'react-icons/go';
import { FaStar, FaCodeBranch } from 'react-icons/fa';
import { LuWorkflow } from "react-icons/lu";
import { FaDocker } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner';  
import { toast } from 'react-toastify';
interface CiCDState {
  cicd: boolean,
  docker: boolean,
}

interface EnvVariables {
  HOST: string,
  USERNAME: string,
  SSH_KEY: string,
  PROJECT_PATH: string,
  SERVICE_NAME: string,
}

const RepoCiCD = () => {
  const { repo_name } = useParams()
  const [form, setForm] = useState<CiCDState>({
    cicd: true,
    docker: false,
  })
  const [framework, setFramework] = useState<string>("")
  const[envVariables, setEnvVariables] = useState<EnvVariables>({
    HOST: "",
    USERNAME: "",
    SSH_KEY: "",
    PROJECT_PATH: "",
    SERVICE_NAME: "",
  })

  // Get Repo Info
  const { data, isLoading, error } = useQuery({
    queryKey: ['repo-cicd', repo_name],
    queryFn: async () => {
      const response = await baseApi.get(`/get-repo/${repo_name}/`)
      return response.data.data
    },
  })

  // Get Frameworks
  const { data: frameworks, isLoading: frameworksLoading, error: frameworksError } = useQuery({
    queryKey: ['frameworks', data?.language],
    queryFn: async () => {
      const response = await baseApi.get(`/get-frameworks/${data?.language}/`)
      return response.data.data
    },
    enabled: !!data?.language,
  })
  
  // Create Workf low
  const { mutate: createWorkflow, isPending: createWorkflowLoading, error: createWorkflowError } = useMutation({
    mutationFn: async () => {
      const response = await baseApi.post(`/create-workflow/${repo_name}/`, {
        framework: framework,
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  // create env variables
  const { mutate: createEnvVariables, isPending: createEnvVariablesLoading, error: createEnvVariablesError } = useMutation({
    mutationFn: async () => {
      const response = await baseApi.post(`/set-env-variables/${repo_name}/`, {
        ...envVariables,
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      console.log(error)
    }
  })



  if (isLoading || frameworksLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-center  p-5">
        <TailSpin height="80" width="80" color="#000" ariaLabel="loading" />
      </div>
    );
  }

  if (error || frameworksError) {
    return (
      <div className='w-full h-screen flex justify-center items-center text-center  p-5'>
        <p className='text-red-500 text-md font-bold'>Sorry CICD is not available for {data?.language}</p>
      </div>
    );
  }

  return (
    <div className='w-full h-full p-2 sm:p-5'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between gap-5 border-b-2 border-gray-200 pb-5'>
        {/* Repo Info */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2 text-gray-700'>
            <GoRepo className='text-xl sm:text-2xl' />
            <h1 className='text-xl sm:text-2xl font-bold'>{data?.name}</h1>
          </div>
          <p className='text-sm text-gray-500'>{data?.description}</p>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-gray-700'>
                <div className='w-2 h-2 rounded-full bg-gray-600'></div>
                <p className='text-sm font-bold'>{data?.language}</p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <FaStar className='text-sm text-yellow-500' />
              <p className='text-sm font-bold'>{data?.stars}</p>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className='flex flex-row sm:flex-col items-center gap-2 mt-4 sm:mt-0'>
          <button className='flex items-center gap-2 text-white bg-emerald-700 px-3 sm:px-4 py-2 rounded-md text-sm'>
            <LuWorkflow className='text-sm' />
            <p className='text-sm font-bold'>CI/CD Workflow</p>
          </button>
          <button className='flex items-center gap-2 text-white bg-emerald-700 px-3 sm:px-4 py-2 rounded-md text-sm' disabled>
            <FaDocker className='text-sm' />
            <p className='text-sm font-bold'>Dockerize (Coming Soon)</p>
          </button>
        </div>
      </div>

      {
        form.cicd && (
          <div className='mt-5'>
            <div className='flex items-center gap-2 text-gray-700 px-2 sm:px-5'>
              <p className='text-md font-bold'>Set The Environmental Variables</p>
            </div>
            <form onSubmit={(e)=>{
              e.preventDefault()
              createWorkflow()
              createEnvVariables()
            }}>
              <div className='w-full p-2 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className="flex flex-col justify-start mb-3">
                  <label htmlFor="framework" className='text-slate-700 font-bold mb-1'>Framework</label>
                  <select
                    name="framework"
                    id="framework"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    onChange={(e)=>{
                      setFramework(e.target.value.toLowerCase())
                    }}
                  >
                    <option value="">Select {data?.language} Framework</option>
                    {frameworks && frameworks.map((framework:{name:string,id:number}) => (
                      <option key={framework.id} value={framework.name}>{framework.name}</option>
                    ))}
                  </select>   
                </div>
                <div className='flex flex-col justify-start mb-3'>
                  <label htmlFor="branches" className='text-slate-700 font-bold mb-1'>Working Directory</label>
                  <input
                    type="text"
                    name="Working_Directory"
                    id="working_directory"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    placeholder='Enter the server working directory'
                    onChange={(e)=>{
                      setEnvVariables({...envVariables, PROJECT_PATH: e.target.value})
                    }}
                    value={envVariables.PROJECT_PATH}
                  />
                </div>
              </div>
              <div className='w-full px-2 sm:px-5 grid grid-cols-1 md:grid-cols-2 gap-5 mb-3'>
                <div className='flex flex-col justify-start mb-3'>
                  <label htmlFor="host" className='text-slate-700 font-bold mb-1'>Server Host Name</label>
                  <input
                    type="text"
                    name="Host"
                    id="host"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    placeholder='Enter the server host name'
                    onChange={(e)=>{
                      setEnvVariables({...envVariables, HOST: e.target.value})
                    }}
                    value={envVariables.HOST}
                  />
                </div>
                <div className='flex flex-col justify-start mb-3'>
                  <label htmlFor="username" className='text-slate-700 font-bold mb-1'>Server Host Username</label>
                  <input
                    type="text"
                    name="Username"
                    id="username"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    placeholder='Enter the server Username name'
                    onChange={(e)=>{
                      setEnvVariables({...envVariables, USERNAME: e.target.value})
                    }}
                    value={envVariables.USERNAME}
                  />
                </div>
              </div>

              <div className='w-full px-2 sm:px-5 grid grid-cols-1 md:grid-cols-2 gap-5 mb-3'>
                <div className='flex flex-col justify-start mb-3'>
                  <label htmlFor="host" className='text-slate-700 font-bold mb-1'>Service Name <span className='text-sm text-gray-500'>(Optional)</span></label>
                  <input
                    type="text"
                    name="Host"
                    id="host"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    placeholder='Example: your-service.service'
                    onChange={(e)=>{
                      setEnvVariables({...envVariables, SERVICE_NAME: e.target.value})
                    }}
                    value={envVariables.SERVICE_NAME}
                  />
                </div>
                <div className='flex flex-col justify-start mb-3'>
                  <label htmlFor="username" className='text-slate-700 font-bold mb-1'>Server SSH Key</label>
                  <input
                    type="text"
                    name="Username"
                    id="username"
                    className='border-2 border-slate-300 rounded-md px-3 py-2 placeholder:text-slate-400'
                    placeholder='Enter the server ssh key'
                    onChange={(e)=>{
                      setEnvVariables({...envVariables, SSH_KEY: e.target.value})
                    }}
                    value={envVariables.SSH_KEY}
                  />
                </div>
              </div>
              <div className='w-full px-2 sm:px-5'>
                <button className='w-full bg-emerald-700 text-white px-4 py-2 rounded-md text-center' type='submit'>{createWorkflowLoading || createEnvVariablesLoading ? <div className='flex justify-center items-center'><TailSpin height="20" width="20" color="#fff"  ariaLabel="loading" /></div> : "Create Workflow"}</button>
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
