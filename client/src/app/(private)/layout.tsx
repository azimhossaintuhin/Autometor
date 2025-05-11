import React from 'react'
import ProtectedRoute from '@/utils/ProtectedRoute'
import Navbar from '@/components/custom/Navbar'
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  )
}

export default layout