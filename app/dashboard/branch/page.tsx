"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
    { name: "Dashboard", href: "/dashboard", active: false, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
    { name: "KYC", href: "/dashboard/kyc", active: false, icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { name: "Branch Data", href: "/dashboard/branch", active: true, icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-12h1m-1 4h1m-1 4h1" },
    { name: "Import Branch", href: "/dashboard/import-branch", active: false, icon: "M12 2L2 7l10 5 10-5-10-5z" },
    { name: "Pengaturan", href: "#", active: false, icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
];

import { branchService } from "@/lib/services/branch";

export default function BranchPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLogout = () => {
        router.push("/login");
    };

    const fetchBranches = async (bankName = "", query = "", pageNum = 1, limitNum = 20) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await branchService.getBranches({
                bank_name: bankName,
                search: query,
                page: pageNum,
                limit: limitNum
            });

            setBranches(result.data || []);
        } catch (err: any) {
            if (err.status === 401) {
                router.push("/login");
                return;
            }
            setError(err.message || "Terjadi kesalahan saat memuat data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEdit = (branch: any) => {
        setEditingBranch({ ...branch });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingBranch) return;

        setIsUpdating(true);
        try {
            await branchService.updateBranch(editingBranch.id, {
                name: editingBranch.name,
                branch_code: editingBranch.branch_code,
                regencies_code: editingBranch.regencies_code,
                regencies: editingBranch.regencies,
                office_type: editingBranch.office_type
            });

            setIsEditModalOpen(false);
            fetchBranches(search, searchQuery, page, limit);
        } catch (err: any) {
            alert(err.message || "Gagal memperbarui data.");
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBranches(search, searchQuery, page, limit);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, searchQuery, page, limit]);

    const handleRefresh = () => {
        fetchBranches(search, searchQuery, page, limit);
    };



    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#f8fafc",
        }}>
            {/* Sidebar Overlay */}
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

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 20, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        width: "100%", maxWidth: 500, background: "#ffffff",
                        borderRadius: 20, border: "1px solid #e2e8f0",
                        padding: 32, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>Update Branch</h3>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Ubah informasi detail cabang bank</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Nama Bank</label>
                                <input
                                    type="text"
                                    value={editingBranch?.name || ""}
                                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                                    style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", color: "#0f172a", outline: "none" }}
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Branch Code</label>
                                    <input
                                        type="text"
                                        value={editingBranch?.branch_code || ""}
                                        onChange={(e) => setEditingBranch({ ...editingBranch, branch_code: e.target.value })}
                                        style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", color: "#0f172a", outline: "none" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Regencies Code</label>
                                    <input
                                        type="text"
                                        value={editingBranch?.regencies_code || ""}
                                        onChange={(e) => setEditingBranch({ ...editingBranch, regencies_code: e.target.value })}
                                        style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", color: "#0f172a", outline: "none" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Wilayah</label>
                                <input
                                    type="text"
                                    value={editingBranch?.regencies || ""}
                                    onChange={(e) => setEditingBranch({ ...editingBranch, regencies: e.target.value })}
                                    style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", color: "#0f172a", outline: "none" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>Tipe Kantor</label>
                                <input
                                    type="text"
                                    value={editingBranch?.office_type || ""}
                                    onChange={(e) => setEditingBranch({ ...editingBranch, office_type: e.target.value })}
                                    style={{ width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", color: "#0f172a", outline: "none" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                style={{ flex: 1, padding: "12px", borderRadius: 12, background: "transparent", border: "1px solid #cbd5e1", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                                    border: "none", color: "#ffffff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}
                            >
                                {isUpdating && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== SIDEBAR ===== */}
            <aside
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
                                {link.icon.startsWith("M") ? (
                                    <path d={link.icon} />
                                ) : (
                                    <circle cx="12" cy="12" r="10" />
                                )}
                            </svg>
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div style={{ padding: "16px 12px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                        onClick={handleLogout}
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
                            className="md:!hidden"
                            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Data Branch Bank</h2>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Daftar seluruh cabang bank yang terdaftar</p>
                        </div>
                    </div>
                </header>

                <main style={{ padding: 28 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16 }}>
                        <div style={{ display: "flex", gap: 12, flex: 1, maxWidth: 900 }}>
                            <div style={{
                                display: "flex", alignItems: "center",
                                background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                border: "1px solid #e2e8f0", flex: 1
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari branch, wilayah, atau tipe..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", marginLeft: 10, outline: "none", fontSize: 14, width: "100%" }}
                                />
                            </div>
                            <select
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                style={{
                                    background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                    border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 14, outline: "none",
                                    cursor: "pointer", flex: 1
                                }}>
                                <option value="">Semua Bank</option>
                                <option value="BCA">Bank Central Asia (BCA)</option>
                                <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                                <option value="BNI">Bank Negara Indonesia (BNI)</option>
                                <option value="MANDIRI">Bank Mandiri</option>
                                <option value="BTN">Bank Tabungan Negara (BTN)</option>
                            </select>

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

                        <button
                            onClick={handleRefresh}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "10px 16px", borderRadius: 10,
                                background: "rgba(37, 99, 235, 0.1)",
                                border: "1px solid #e2e8f0", color: "#1d4ed8",
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isLoading ? "animate-spin" : ""}>
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div style={{
                            marginBottom: 24, padding: "16px", borderRadius: 12,
                            background: "rgba(239, 68, 68, 0.1)", border: "1px solid #fecaca",
                            color: "#f87171", fontSize: 14, display: "flex", alignItems: "center", gap: 12
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div style={{
                        background: "#ffffff", borderRadius: 16,
                        border: "1px solid #e2e8f0", padding: 24,
                        backdropFilter: "blur(8px)", overflowX: "auto"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["No", "Bank", "Branch Code", "Wilayah", "Tipe Kantor", "Aksi"].map((h) => (
                                        <th key={h} style={{
                                            padding: "14px 16px", fontSize: 12, fontWeight: 700,
                                            color: "#64748b", borderBottom: "1px solid #e2e8f0",
                                            textAlign: h === "Aksi" ? "center" : "left", textTransform: "uppercase", letterSpacing: "0.05em"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: "60px", textAlign: "center" }}>
                                            <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32, borderTopColor: "#2563eb" }} />
                                            <p style={{ color: "#64748b", fontSize: 14, marginTop: 16 }}>Memuat data branch...</p>
                                        </td>
                                    </tr>
                                ) : branches.length > 0 ? (
                                    branches.map((item: any, idx: number) => (
                                        <tr key={item.id} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b", fontFamily: "var(--font-geist-mono)" }}>{(page - 1) * limit + idx + 1}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{item.name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#1d4ed8", fontFamily: "var(--font-geist-mono)" }}>{item.branch_code}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#0f172a" }}>
                                                <div>{item.regencies}</div>
                                                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Kode: {item.regencies_code}</div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#0f172a" }}>
                                                <span style={{
                                                    display: "inline-flex", padding: "4px 10px", borderRadius: 6,
                                                    background: "#eff6ff", border: "1px solid rgba(59, 130, 246, 0.2)",
                                                    color: "#1d4ed8", fontWeight: 500
                                                }}>
                                                    {item.office_type}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", textAlign: "center" }}>
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    style={{
                                                        padding: "6px 12px", borderRadius: 8, background: "rgba(37, 99, 235, 0.1)",
                                                        border: "1px solid #e2e8f0", color: "#1d4ed8", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                                                    }}
                                                    className="hover:bg-blue-50"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                            Tidak ada data branch bank.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "0 8px" }}>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Halaman <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{page}</span></p>
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
                                    disabled={branches.length < limit || isLoading}
                                    onClick={() => setPage(p => p + 1)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "8px 16px", borderRadius: 10,
                                        background: branches.length < limit ? "#f1f5f9" : "#eff6ff",
                                        border: `1px solid ${branches.length < limit ? "#e2e8f0" : "#bfdbfe"}`,
                                        color: branches.length < limit ? "#94a3b8" : "#2563eb",
                                        cursor: branches.length < limit ? "not-allowed" : "pointer",
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

            <style jsx>{`
                .spinner {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top: 3px solid #fff;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
