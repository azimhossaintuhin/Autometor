"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        
        if (!user?.status) {
            router.replace("/login");
        } else {
            setIsLoading(false);
        }
    }, [user, loading, router]);

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <TailSpin color="#000" height={50} width={50} />
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
