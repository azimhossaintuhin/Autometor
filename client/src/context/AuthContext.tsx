'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import baseApi from '@/utils/api';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await baseApi.get('/user/me/');
                setUser(response.data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            await baseApi.post('/login', { email, password });
            const response = await baseApi.get('/user');
            setUser(response.data);
            setError(null);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await baseApi.post('/logout');
            setUser(null);
            router.push('/login');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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