import React from 'react'
import ProtectedRoute from '@/utils/ProtectedRoute'
const layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <ProtectedRoute>
    {children}
    </ProtectedRoute>
  )
}

export default layout