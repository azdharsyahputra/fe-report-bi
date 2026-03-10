"use client";

import { createContext, useContext, useState } from "react";

interface DashboardContextType {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <DashboardContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
