'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import baseApi from '@/utils/api';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await baseApi.get('/user/me/');
            return response.data;
        },
       
    });

    return (
        <AuthContext.Provider value={{ user: data, loading: isLoading, error: error ? String(error) : null }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
