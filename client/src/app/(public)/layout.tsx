"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PublicLayout = ({children}: {children: React.ReactNode}) => {
    // const { user,loading } = useAuth();
    // const router = useRouter();

    // useEffect(() => {

    //     if (user && !loading) {
    //         router.replace("/profile");
    //     }
    // }, [user, router, loading]);

    return <>{children}</>;
}

export default PublicLayout;