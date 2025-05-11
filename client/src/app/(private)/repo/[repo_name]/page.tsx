"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import baseApi from '@/utils/api'
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
    <></>
  )
}

export default RepoCiCD
