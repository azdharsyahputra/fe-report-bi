"use client";

interface HeaderProps {
    title: string;
    subtitle: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Header({ title, subtitle, sidebarOpen, setSidebarOpen }: HeaderProps) {
    return (
        <header style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 28px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky", top: 0, zIndex: 30,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                    aria-label="Toggle Sidebar"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h2>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{subtitle}</p>
                </div>
            </div>
        </header>
    );
}
