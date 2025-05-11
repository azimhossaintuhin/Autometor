"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user?.status) {
            router.replace("/login");
        }
    }, [loading, user?.status, router]);

    if (loading) {
        console.log("loading")  
        return (
            <div className="flex items-center justify-center h-screen">
                <TailSpin color="#000" height={50} width={50} />
            </div>
        );
    }
    console.log(user)

    return <>{children}</>;
};

export default ProtectedRoute;
