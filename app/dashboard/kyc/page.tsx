"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { kycService } from "@/lib/services/kyc";

export default function KYCPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [kycData, setKycData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalData, setTotalData] = useState(0);
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

    const fetchKycData = async (pageNum = 1, limitNum = 20, query = "") => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await kycService.getKycData({
                page: pageNum,
                limit: limitNum,
                search: query,
            });
            setKycData(result.data || []);
            setTotalData(result.meta?.total || 0);
        } catch (err: any) {
            if (err.status === 401) {
                router.push("/login");
                return;
            }
            setError(err.message || "Gagal memuat data KYC.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchKycData(page, limit, search);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [page, limit, search]);

    const getImageUrl = (fileName: string) => {
        if (!fileName) return "";
        // Convert Windows path to a URL-friendly path served by backend
        const cleanName = fileName.replace(/\\/g, "/").split("/").pop() || "";
        return `http://localhost:8080/kyc/images/${cleanName}`;
    };

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
                </header>

                {/* Main Content */}
                <main style={{ padding: 28 }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <p style={{ fontSize: 14, color: "#0f172a", margin: 0, fontWeight: 500 }}>
                                Menampilkan {kycData.length} data nasabah
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
                                    placeholder="Cari nama atau username..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", marginLeft: 10, outline: "none", fontSize: 14, minWidth: 200 }}
                                />
                            </div>

                            {/* Row Limit */}
                            <select
                                value={limit}
                                onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                                style={{
                                    background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                    border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 14, outline: "none",
                                    cursor: "pointer", width: 120
                                }}>
                                <option value={10}>10 Baris</option>
                                <option value={20}>20 Baris</option>
                                <option value={50}>50 Baris</option>
                                <option value={100}>100 Baris</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            marginBottom: 24, padding: "16px", borderRadius: 12,
                            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", gap: 12
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div style={{
                        background: "#ffffff", borderRadius: 16,
                        border: "1px solid #e2e8f0", padding: 20,
                        backdropFilter: "blur(8px)", overflowX: "auto"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
                            <thead>
                                <tr>
                                    {["No", "Username", "Nama Lengkap", "Alamat", "ZIP", "Kota", "Provinsi", "Email", "Tipe Upload", "File", "Aksi"].map(h => (
                                        <th key={h} style={{
                                            padding: "14px 16px", fontSize: 12, fontWeight: 700,
                                            textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b",
                                            borderBottom: "1px solid #e2e8f0", textAlign: "left"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={11} style={{ padding: "60px", textAlign: "center" }}>
                                            <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32, borderTopColor: "#2563eb" }} />
                                            <p style={{ color: "#64748b", fontSize: 14, marginTop: 16 }}>Memuat data KYC...</p>
                                        </td>
                                    </tr>
                                ) : kycData.length > 0 ? (
                                    kycData.map((d: any, idx: number) => (
                                        <tr key={d.user_name + '-' + idx} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b", fontFamily: "var(--font-geist-mono)" }}>{(page - 1) * limit + idx + 1}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#1d4ed8", fontFamily: "var(--font-geist-mono)" }}>{d.user_name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{d.full_name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                                <div>{d.address1}</div>
                                                {d.address2 && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{d.address2}</div>}
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b", fontFamily: "var(--font-geist-mono)" }}>{d.zip}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>{d.kode_kota}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>{d.kode_prov}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b" }}>{d.email}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                    {(Array.isArray(d.upload_type) ? d.upload_type : [d.upload_type]).filter(Boolean).map((ut: string, i: number) => (
                                                        <span key={i} style={{
                                                            display: "inline-flex", padding: "3px 8px", borderRadius: 6,
                                                            background: "#eff6ff", border: "1px solid rgba(59, 130, 246, 0.2)",
                                                            color: "#1d4ed8", fontSize: 11, fontWeight: 600
                                                        }}>{ut}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    {(Array.isArray(d.file_name) ? d.file_name : [d.file_name]).filter(Boolean).map((fn: string, i: number) => (
                                                        <div
                                                            key={i}
                                                            style={{ position: "relative", width: 42, height: 42, overflow: "hidden", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", transition: "transform 0.2s" }}
                                                            onClick={() => handleImageClick(getImageUrl(fn))}
                                                        >
                                                            <img src={getImageUrl(fn)} alt={`KYC-${i}`} className="hover:scale-110" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.2s" }} />
                                                        </div>
                                                    ))}
                                                    {(!d.file_name || (Array.isArray(d.file_name) && d.file_name.length === 0)) && (
                                                        <span style={{ color: "#94a3b8", fontSize: 12 }}>-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                                                <button style={{
                                                    background: "#eff6ff",
                                                    border: "1px solid rgba(59, 130, 246, 0.4)",
                                                    color: "#1d4ed8", padding: "8px 16px", borderRadius: 8,
                                                    fontSize: 13, cursor: "pointer", fontWeight: 600,
                                                    transition: "all 0.2s ease"
                                                }}>Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                            Tidak ada data KYC.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "0 8px" }}>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Halaman <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{page}</span> dari <span style={{ fontWeight: 600 }}>{Math.ceil(totalData / limit) || 1}</span> &middot; Total <span style={{ fontWeight: 600 }}>{totalData}</span> data</p>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button
                                    disabled={page <= 1 || isLoading}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "8px 16px", borderRadius: 10,
                                        background: page <= 1 ? "#f1f5f9" : "#eff6ff",
                                        border: `1px solid ${page <= 1 ? "#e2e8f0" : "#bfdbfe"}`,
                                        color: page <= 1 ? "#94a3b8" : "#2563eb",
                                        cursor: page <= 1 ? "not-allowed" : "pointer",
                                        fontSize: 13, fontWeight: 600, transition: "all 0.2s ease"
                                    }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    Sebelumnya
                                </button>
                                <button
                                    disabled={page >= Math.ceil(totalData / limit) || isLoading}
                                    onClick={() => setPage(p => p + 1)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "8px 16px", borderRadius: 10,
                                        background: page >= Math.ceil(totalData / limit) ? "#f1f5f9" : "#eff6ff",
                                        border: `1px solid ${page >= Math.ceil(totalData / limit) ? "#e2e8f0" : "#bfdbfe"}`,
                                        color: page >= Math.ceil(totalData / limit) ? "#94a3b8" : "#2563eb",
                                        cursor: page >= Math.ceil(totalData / limit) ? "not-allowed" : "pointer",
                                        fontSize: 13, fontWeight: 600, transition: "all 0.2s ease"
                                    }}>
                                    Selanjutnya
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
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
                .spinner {
                    border: 3px solid #e2e8f0;
                    border-radius: 50%;
                    border-top: 3px solid #2563eb;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
