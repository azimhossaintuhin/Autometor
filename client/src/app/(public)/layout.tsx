"use client"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PublicLayout = ({children}: {children: React.ReactNode}) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/profile");
        }
    }, [user, router]);

    return <>{children}</>;
}

export default PublicLayout;