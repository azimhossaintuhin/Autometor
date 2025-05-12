'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import baseApi from '@/utils/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
    invalidateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await baseApi.get('/user/me/');
            return response.data;
        },
        retry: false,
    });

    const invalidateUser = async () => {
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    const logout = async () => {
        const response = await baseApi.post('/logout/');
        if (response.status === 200) {
            router.replace("/login")
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user: data, 
            loading: isLoading, 
            error: error ? String(error) : null,
            invalidateUser 
        }}>
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
