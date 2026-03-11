"use client";

import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardProvider, useDashboard } from "@/lib/context/dashboard-context";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { sidebarOpen, setSidebarOpen } = useDashboard();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-600">Memeriksa autentikasi...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div 
                style={{ 
                    marginLeft: sidebarOpen ? 260 : 80, 
                    flex: 1, 
                    minWidth: 0,
                    transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }} 
                className="max-md:!ml-0"
            >
                {children}
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
    );
}
