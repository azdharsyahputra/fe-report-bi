"use client";

import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { navLinks } from "@/lib/constants/nav-links";

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                        zIndex: 45, display: "block",
                    }}
                    className="md:!hidden"
                />
            )}

            <aside
                style={{
                    width: open ? 260 : 80,
                    minHeight: "100vh",
                    background: "#ffffff",
                    borderRight: "1px solid #e2e8f0",
                    backdropFilter: "blur(20px)",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden"
                }}
                className={`max-md:${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Brand */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: open ? "20px 24px" : "20px 0",
                    justifyContent: open ? "flex-start" : "center",
                    borderBottom: "1px solid #e2e8f0",
                    minHeight: 81,
                }}>
                    <img
                        src="/cashplus-logo.png"
                        alt="Cashplus Logo"
                        style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }}
                    />
                    {open && (
                        <div style={{ animation: "fadeIn 0.2s ease" }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>Portal Report</p>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Bank Indonesia</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ padding: open ? "16px 12px" : "16px 8px", flex: 1 }}>
                    {open && (
                        <p style={{ 
                            fontSize: 10, fontWeight: 600, color: "#475569", 
                            textTransform: "uppercase", letterSpacing: "0.08em", 
                            padding: "0 12px", marginBottom: 8,
                            animation: "fadeIn 0.2s ease"
                        }}>Menu</p>
                    )}
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                title={!open ? link.name : ""}
                                style={{
                                    display: "flex", alignItems: "center", 
                                    gap: 12,
                                    padding: "10px 14px", borderRadius: 10,
                                    fontSize: 14, fontWeight: 500, textDecoration: "none",
                                    marginBottom: 4,
                                    justifyContent: open ? "flex-start" : "center",
                                    color: isActive ? "#2563eb" : "#64748b",
                                    background: isActive ? "#eff6ff" : "transparent",
                                    border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d={link.icon} />
                                </svg>
                                {open && <span style={{ whiteSpace: "nowrap", animation: "fadeIn 0.2s ease" }}>{link.name}</span>}
                            </a>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: open ? "16px 12px" : "16px 8px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                        onClick={handleLogout}
                        title={!open ? "Keluar" : ""}
                        style={{
                            display: "flex", alignItems: "center", 
                            justifyContent: open ? "flex-start" : "center", 
                            gap: 12,
                            width: "100%", padding: "10px 14px", borderRadius: 10,
                            background: "#fee2e2",
                            border: "1px solid #fecaca",
                            color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {open && <span style={{ animation: "fadeIn 0.2s ease" }}>Keluar</span>}
                    </button>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateX(-4px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>
            </aside>
        </>
    );
}
