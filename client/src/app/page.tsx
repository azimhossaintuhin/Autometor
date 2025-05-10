"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        
        if (!user) {
            router.replace("/login");
        } else {
            router.replace("/profile");
        }
    }, [user, router]);

    // Optional loader while redirecting
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <TailSpin color="#00BFFF" height={80} width={80} />
        </div>
    );
}
