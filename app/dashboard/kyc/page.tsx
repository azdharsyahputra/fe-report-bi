"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function KYCPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filterProvinsi, setFilterProvinsi] = useState("Semua");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const handleLogout = () => {
        router.push("/login");
    };

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", active: false, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
        { name: "KYC", href: "/dashboard/kyc", active: true, icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
        { name: "Branch Data", href: "/dashboard/branch", active: false, icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-12h1m-1 4h1m-1 4h1" },
        { name: "Import Branch", href: "/dashboard/import-branch", active: false, icon: "M12 2L2 7l10 5 10-5-10-5z" },
        { name: "Pengaturan", href: "#", active: false, icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
    ];

    const kycData = [
        {
            id: "KYC-001", nama: "Budi Santoso", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", status: "Verified", color: "#10b981", bg: "rgba(16,185,129,0.12)",
            ktp: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            selfie: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: "KYC-002", nama: "Siti Aminah", kota: "Bandung", provinsi: "Jawa Barat", status: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",
            ktp: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            selfie: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: "KYC-003", nama: "Ahmad Dahlan", kota: "Surabaya", provinsi: "Jawa Timur", status: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)",
            ktp: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            selfie: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: "KYC-004", nama: "Rina Wati", kota: "Medan", provinsi: "Sumatera Utara", status: "Verified", color: "#10b981", bg: "rgba(16,185,129,0.12)",
            ktp: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            selfie: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: "KYC-005", nama: "Andi Saputra", kota: "Semarang", provinsi: "Jawa Tengah", status: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",
            ktp: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            selfie: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
        },
    ];

    const filteredData = kycData.filter(d =>
        (filterProvinsi === "Semua" || d.provinsi === filterProvinsi) &&
        (d.nama.toLowerCase().includes(search.toLowerCase()) || d.kota.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#f8fafc",
        }}>
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                        zIndex: 45, display: "block",
                    }}
                    className="md:!hidden"
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <aside
                id="sidebar"
                style={{
                    width: 260,
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
                    transition: "transform 0.3s ease",
                    transform: sidebarOpen ? "translateX(0)" : undefined,
                }}
                className={`max-md:${sidebarOpen ? "" : "-translate-x-full"}`}
            >
                {/* Brand */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "20px 24px",
                    borderBottom: "1px solid #e2e8f0",
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>Portal Report</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Bank Indonesia</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: "16px 12px", flex: 1 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>Menu</p>
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "10px 14px", borderRadius: 10,
                                fontSize: 14, fontWeight: 500, textDecoration: "none",
                                marginBottom: 2,
                                color: link.active ? "#2563eb" : "#64748b",
                                background: link.active ? "#eff6ff" : "transparent",
                                border: link.active ? "1px solid #bfdbfe" : "1px solid transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={link.icon} />
                            </svg>
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                        onClick={handleLogout}
                        id="logout-button"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            width: "100%", padding: "10px 14px", borderRadius: 10,
                            background: "#fee2e2",
                            border: "1px solid #fecaca",
                            color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* ===== MAIN AREA ===== */}
            <div style={{ marginLeft: 260, flex: 1, minWidth: 0 }} className="max-md:!ml-0">
                {/* Top Navbar */}
                <header style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 28px",
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid #e2e8f0",
                    position: "sticky", top: 0, zIndex: 30,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Mobile menu */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            id="mobile-menu-toggle"
                            className="md:!hidden"
                            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Data KYC</h2>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Verifikasi data nasabah (Know Your Customer)</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Notification */}
                        <button style={{
                            position: "relative", background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(37, 99, 235, 0.12)",
                            borderRadius: 10, padding: 8, cursor: "pointer", color: "#64748b",
                            transition: "all 0.2s ease",
                        }} id="notification-button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span style={{
                                position: "absolute", top: -4, right: -4,
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#2563eb", color: "#0f172a",
                                fontSize: 10, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>3</span>
                        </button>

                        {/* User */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#0f172a", fontWeight: 700, fontSize: 13,
                                boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
                            }}>AD</div>
                            <div className="max-md:!hidden">
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>Admin</p>
                                <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>admin@bi.go.id</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ padding: 28 }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <p style={{ fontSize: 14, color: "#0f172a", margin: 0, fontWeight: 500 }}>
                                Menampilkan {filteredData.length} data nasabah
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {/* Search Bar */}
                            <div style={{
                                display: "flex", alignItems: "center",
                                background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                border: "1px solid #e2e8f0"
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari nama atau kota..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", marginLeft: 10, outline: "none", fontSize: 14, minWidth: 200 }}
                                />
                            </div>

                            {/* Filter Provinsi */}
                            <select
                                value={filterProvinsi}
                                onChange={(e) => setFilterProvinsi(e.target.value)}
                                style={{
                                    background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                    border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 14, outline: "none",
                                    cursor: "pointer"
                                }}>
                                <option value="Semua">Semua Provinsi</option>
                                <option value="DKI Jakarta">DKI Jakarta</option>
                                <option value="Jawa Barat">Jawa Barat</option>
                                <option value="Jawa Tengah">Jawa Tengah</option>
                                <option value="Jawa Timur">Jawa Timur</option>
                                <option value="Sumatera Utara">Sumatera Utara</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{
                        background: "#ffffff", borderRadius: 16,
                        border: "1px solid #e2e8f0", padding: 20,
                        backdropFilter: "blur(8px)", overflowX: "auto"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                            <thead>
                                <tr>
                                    {["Nasabah", "Kota Asal", "Provinsi", "Foto KTP", "Selfie + KTP", "Status", "Aksi"].map(h => (
                                        <th key={h} style={{
                                            padding: "14px 16px", fontSize: 12, fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b",
                                            borderBottom: "1px solid #e2e8f0", textAlign: "left"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(d => (
                                    <tr key={d.id} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ fontSize: 15, color: "#0f172a", fontWeight: 600 }}>{d.nama}</div>
                                            <div style={{ fontSize: 12, color: "#1d4ed8", marginTop: 4, fontFamily: "var(--font-geist-mono), monospace" }}>{d.id}</div>
                                        </td>
                                        <td style={{ padding: "16px", fontSize: 14, color: "#0f172a", borderBottom: "1px solid #f1f5f9", fontWeight: 500 }}>{d.kota}</td>
                                        <td style={{ padding: "16px", fontSize: 14, color: "#0f172a", borderBottom: "1px solid #f1f5f9", fontWeight: 500 }}>{d.provinsi}</td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ position: "relative", width: 48, height: 48, overflow: "hidden", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", transition: "transform 0.2s" }}>
                                                <img src={d.ktp} alt="KTP" onClick={() => handleImageClick(d.ktp)} className="hover:scale-110" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, transition: "transform 0.2s" }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ position: "relative", width: 48, height: 48, overflow: "hidden", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", transition: "transform 0.2s" }}>
                                                <img src={d.selfie} alt="Selfie" onClick={() => handleImageClick(d.selfie)} className="hover:scale-110" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, transition: "transform 0.2s" }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", padding: "6px 14px",
                                                borderRadius: 20, fontSize: 12, fontWeight: 700,
                                                color: d.color, background: d.bg, border: `1px solid ${d.color}33`
                                            }}>{d.status}</span>
                                        </td>
                                        <td style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                                            <button style={{
                                                background: "#eff6ff",
                                                border: "1px solid rgba(59, 130, 246, 0.4)",
                                                color: "#1d4ed8", padding: "8px 16px", borderRadius: 8,
                                                fontSize: 13, cursor: "pointer", fontWeight: 600,
                                                transition: "all 0.2s ease"
                                            }}>Detail</button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                            Tidak ada data yang cocok dengan pencarian Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>


            {/* Image Enhancement Modal */}
            {isImageModalOpen && selectedImage && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 40, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)"
                }} onClick={() => setIsImageModalOpen(false)}>
                    {/* Close Button */}
                    <button style={{
                        position: "absolute", top: 24, right: 24,
                        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                        color: "#ffffff", width: 40, height: 40, borderRadius: 20,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.2s", zIndex: 101
                    }} className="hover:bg-white/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    {/* Image Container */}
                    <div style={{
                        position: "relative",
                        width: "100%", maxWidth: 800, maxHeight: "90vh",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        animation: "zoomIn 0.2s ease-out"
                    }} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={selectedImage} 
                            alt="Enlarged KYC Document" 
                            style={{ 
                                maxWidth: "100%", maxHeight: "85vh", 
                                objectFit: "contain", borderRadius: 12,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }} 
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

        </div>
    );
}
