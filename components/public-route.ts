"use client";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setIsAuth(true);
            router.replace("/home");
        } else {
            setIsAuth(false);
        }
    }, [router]);

    if (isAuth) {
        return null; 
    }

    return children;
}