'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { RiGitRepositoryCommitsLine } from 'react-icons/ri';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { useQuery, useMutation } from '@tanstack/react-query';
import RepoCards from '@/components/custom/RepoCards';
import baseApi from '@/utils/api';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { BiLogOut } from 'react-icons/bi';
interface Repo {
  id: number;
  name: string;
  description: string;
  stars?: number;
  forks?: number;
  language?: string;
  updatedAt?: string;
  [key: string]: any;
}

const UserProfile = () => {
  const router = useRouter();
  const { user} = useAuth();
  const userData = user?.data;

  const {
    data: repos,
    isLoading,
    isError,
    refetch,
  } = useQuery<Repo[]>({
    queryKey: ['repos'],
    queryFn: async () => {
      const res = await baseApi.get(`/get-repos/`);
      return res.data.data;
    },
    enabled: false,
  });

  const { mutate: logout, isPending: logoutLoading } = useMutation({
    mutationFn: async () => {
      await baseApi.post('/logout/');
    },
    onSuccess: () => {
      router.replace('/login');
    },
  });

  return (
    <div className="container w-full min-h-screen px-6 py-4">
      {/* Profile Header */}
      <div className="w-full flex flex-col justify-center items-center mb-6">
        {userData?.avatar_url && (
          <Image
            src={userData.avatar_url}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        <div className="text-center mt-2">
          <h1 className="text-2xl font-bold">{userData?.full_name}</h1>
          <p className="text-sm text-gray-500">{userData?.email || 'demo@gmail.com'}</p>
         <button className='bg-emerald-500 px-1 py-1 rounded-md flex mx-auto items-center gap-2 text-white' onClick={()=>{
          logout()
         }}>
          
         {logoutLoading ? <TailSpin height="20" width="20" color="#fff"  ariaLabel="loading" /> : <BiLogOut className='text-xl' />}
         </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-2xl font-semibold">Options</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => refetch()}
            className="bg-emerald-500 px-4 py-2 rounded-md flex items-center gap-2 text-white"
          >
            <RiGitRepositoryCommitsLine className="text-xl" />
            <span>Get All Repos</span>
          </button>
          <button className="bg-emerald-500 px-4 py-2 rounded-md flex items-center gap-2 text-white">
            <MdAccountBalanceWallet className="text-xl" />
            <span>Add Balance</span>
          </button>
        </div>
      </div>

      {/* Repo Cards or States */}
      {isLoading && (
        <div className="flex justify-center items-center h-[300px] w-full">
          <TailSpin height="60" width="60" color="green" />
        </div>
      )}

      {isError && (
        <div className="flex justify-center items-center h-[300px] w-full">
          <p className="text-red-500 text-center text-lg">⚠️ Failed to load repositories.</p>
        </div>
      )}

      {!isLoading && !isError && repos && (
        <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center">
          {repos.map((repo) => (
            <RepoCards key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
