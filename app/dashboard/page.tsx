"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { reportService } from "@/lib/services/report";

export default function DashboardPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const getFormattedDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}${m}${d}`;
    };

    const getHtmlDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    // Default: 30 days ago to today
    const defaultEnd = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(defaultEnd.getDate() - 30);

    const [startDate, setStartDate] = useState(getFormattedDate(defaultStart));
    const [endDate, setEndDate] = useState(getFormattedDate(defaultEnd));
    const [inputStartDate, setInputStartDate] = useState(getHtmlDate(defaultStart));
    const [inputEndDate, setInputEndDate] = useState(getHtmlDate(defaultEnd));

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputStartDate(val);
        setStartDate(val.replace(/-/g, ""));
        setPage(1);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputEndDate(val);
        setEndDate(val.replace(/-/g, ""));
        setPage(1);
    };


    // States for row editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempEditData, setTempEditData] = useState<any>(null);

    const handleLogout = () => {
        router.push("/login");
    };

    const fetchReports = async (pageNum = 1, limitNum = 20, query = "", start = startDate, end = endDate) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await reportService.getPaybankReports({
                page: pageNum,
                limit: limitNum,
                search: query,
                start_date: start,
                end_date: end
            });
            setDashboardData(result.data || []);
        } catch (err: any) {
            if (err.status === 401) {
                router.push("/login");
                return;
            }
            setError(err.message || "Gagal memuat data laporan.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchReports(page, limit, search, startDate, endDate);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, limit, search, startDate, endDate]);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", active: true, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
        { name: "KYC", href: "/dashboard/kyc", active: false, icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
        { name: "Branch Data", href: "/dashboard/branch", active: false, icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-12h1m-1 4h1m-1 4h1" },
        { name: "Import Branch", href: "/dashboard/import-branch", active: false, icon: "M12 2L2 7l10 5 10-5-10-5z" },
        { name: "Pengaturan", href: "#", active: false, icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
    ];

    const handleEditClick = (record: any) => {
        setEditingId(record.id);
        setTempEditData({ ...record });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTempEditData(null);
    };

    const handleSaveEdit = () => {
        if (editingId && tempEditData) {
            // Local update (optional, usually you'd call an API here too)
            const newData = dashboardData.map(d => d.id === editingId ? tempEditData : d);
            setDashboardData(newData);
            setEditingId(null);
            setTempEditData(null);
        }
    };

    const handleTempChange = (field: string, value: string | number) => {
        if (tempEditData) {
            setTempEditData({ ...tempEditData, [field]: value });
        }
    };

    const CellContent = ({ isEditing, value, onChange, align = "left", bold = false, monospaced = false, blue = false, green = false, isNumber = false }: any) => {
        if (isEditing) {
            return (
                <input
                    type={isNumber ? "number" : "text"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="focus:border-blue-500 focus:bg-blue-900/30 transition-colors"
                    style={{
                        background: "#ffffff",
                        border: "1px solid #bfdbfe",
                        color: blue ? "#2563eb" : green ? "#10b981" : "#0f172a",
                        width: "100%",
                        fontSize: "inherit",
                        fontWeight: bold ? 600 : "inherit",
                        outline: "none",
                        textAlign: align as any,
                        fontFamily: monospaced ? "var(--font-geist-mono), monospace" : "inherit",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        minWidth: "60px",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
                    }}
                />
            );
        }
        return (
            <span style={{
                color: blue ? "#2563eb" : green ? "#10b981" : "inherit",
                fontWeight: bold ? 600 : "inherit",
                textAlign: align as any,
                fontFamily: monospaced ? "var(--font-geist-mono), monospace" : "inherit",
                display: "block"
            }}>
                {value}
            </span>
        );
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
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>Menu</p>
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
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Dashboard Penjualan Paybank</h2>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Rekap data transaksi harian</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ padding: 28 }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <p style={{ fontSize: 14, color: "#334155", margin: 0, fontWeight: 500 }}>
                                Menampilkan {dashboardData.length} data transaksi
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {/* Date Filters */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", borderRadius: 10, padding: "2px", border: "1px solid #e2e8f0" }}>
                                <input
                                    type="date"
                                    value={inputStartDate}
                                    onChange={(e: any) => handleStartDateChange(e)}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 12px", outline: "none", cursor: "pointer" }}
                                />
                                <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>-</span>
                                <input
                                    type="date"
                                    value={inputEndDate}
                                    onChange={(e: any) => handleEndDateChange(e)}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 12px", outline: "none", cursor: "pointer" }}
                                />
                            </div>

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
                                    placeholder="Cari pengirim atau penerima..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ background: "transparent", border: "none", color: "#0f172a", marginLeft: 10, outline: "none", fontSize: 14, minWidth: 240 }}
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

                            {/* Export CSV */}
                            <button
                                onClick={async () => {
                                    setIsExporting(true);
                                    try {
                                        await reportService.exportCsv({ start_date: startDate, end_date: endDate });
                                    } catch (err: any) {
                                        alert(err.message || "Gagal mengunduh CSV.");
                                    } finally {
                                        setIsExporting(false);
                                    }
                                }}
                                disabled={isExporting}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 16px", borderRadius: 10,
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    border: "none", color: "#ffffff",
                                    fontSize: 13, fontWeight: 600, cursor: isExporting ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                                    opacity: isExporting ? 0.7 : 1,
                                }}
                            >
                                {isExporting ? (
                                    <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                )}
                                Export CSV
                            </button>

                            {/* Export Excel */}
                            <button
                                onClick={async () => {
                                    setIsExporting(true);
                                    try {
                                        await reportService.exportExcel({ start_date: startDate, end_date: endDate });
                                    } catch (err: any) {
                                        alert(err.message || "Gagal mengunduh Excel.");
                                    } finally {
                                        setIsExporting(false);
                                    }
                                }}
                                disabled={isExporting}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 16px", borderRadius: 10,
                                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                    border: "none", color: "#ffffff",
                                    fontSize: 13, fontWeight: 600, cursor: isExporting ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                                    opacity: isExporting ? 0.7 : 1,
                                }}
                            >
                                {isExporting ? (
                                    <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                )}
                                Export Excel
                            </button>
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

                    {/* Table Container */}
                    <div style={{
                        background: "#ffffff", borderRadius: 16,
                        border: "1px solid #e2e8f0", padding: 20,
                        backdropFilter: "blur(8px)", overflowX: "auto"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1640 }}>
                            <thead>
                                <tr>
                                    <th colSpan={3} style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Data Pengirim</th>
                                    <th colSpan={4} style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Data Penerima</th>
                                    <th colSpan={3} style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Transaksi</th>
                                    <th colSpan={1} style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pengaturan</th>
                                </tr>
                                <tr>
                                    {/* Pengirim */}
                                    {["Nama", "Prefix", "Kota"].map(h => (
                                        <th key={'sender-' + h} style={{
                                            padding: "14px 10px", fontSize: 12, fontWeight: 600,
                                            color: "#334155", borderBottom: "1px solid #e2e8f0", textAlign: "left"
                                        }}>{h}</th>
                                    ))}
                                    {/* Penerima */}
                                    {["Nama", "Bank Tujuan", "No. Rek", "Prefix"].map(h => (
                                        <th key={'recv-' + h} style={{
                                            padding: "14px 10px", fontSize: 12, fontWeight: 600,
                                            color: "#334155", borderBottom: "1px solid #e2e8f0", textAlign: "left",
                                            borderLeft: h === "Nama" ? "1px solid #e2e8f0" : "none"
                                        }}>{h}</th>
                                    ))}
                                    {/* Transaksi */}
                                    {["Produk", "Volume", "Jumlah (Rp)"].map(h => (
                                        <th key={'txn-' + h} style={{
                                            padding: "14px 10px", fontSize: 12, fontWeight: 600,
                                            color: "#334155", borderBottom: "1px solid #e2e8f0", textAlign: "right",
                                            borderLeft: h === "Produk" ? "1px solid #e2e8f0" : "none"
                                        }}>{h}</th>
                                    ))}
                                    {/* Action */}
                                    <th style={{
                                        padding: "14px 10px", fontSize: 12, fontWeight: 600,
                                        color: "#334155", borderBottom: "1px solid #e2e8f0", textAlign: "center",
                                        borderLeft: "1px solid #e2e8f0"
                                    }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={11} style={{ padding: "60px", textAlign: "center" }}>
                                            <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32 }} />
                                            <p style={{ color: "#64748b", fontSize: 14, marginTop: 16 }}>Memuat data laporan...</p>
                                        </td>
                                    </tr>
                                ) : dashboardData.length > 0 ? (
                                    dashboardData.map((d, i) => {
                                        const isEditing = editingId === d.id;
                                        const currentData = isEditing ? tempEditData : d;

                                        return (
                                            <tr key={d.id} style={{
                                                transition: "background 0.2s",
                                                background: isEditing ? "#f8fafc" : "transparent"
                                            }} className="hover:bg-slate-50">
                                                {/* Data Pengirim */}
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a" }}>
                                                    <CellContent isEditing={isEditing} value={currentData.pengirim} onChange={(v: string) => handleTempChange('pengirim', v)} bold />
                                                </td>

                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                                    <CellContent isEditing={isEditing} value={currentData.prefix_pengirim} onChange={(v: string) => handleTempChange('prefix_pengirim', v)} blue />
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                                    <CellContent isEditing={isEditing} value={currentData.kota_pengirim} onChange={(v: string) => handleTempChange('kota_pengirim', v)} />
                                                </td>

                                                {/* Data Penerima */}
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", borderLeft: "1px solid #e2e8f0" }}>
                                                    <CellContent isEditing={isEditing} value={currentData.nama_penerima} onChange={(v: string) => handleTempChange('nama_penerima', v)} bold />
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                                                    <div style={{ padding: isEditing ? 0 : "0 8px" }}>
                                                        {isEditing ? (
                                                            <input
                                                                value={currentData.bank_tujuan}
                                                                onChange={(e) => handleTempChange('bank_tujuan', e.target.value)}
                                                                className="focus:border-blue-500 focus:bg-white/10 transition-colors"
                                                                style={{
                                                                    background: "#ffffff", border: "1px solid #bfdbfe",
                                                                    color: "#2563eb", fontWeight: 700, fontSize: 12, padding: "6px 8px",
                                                                    borderRadius: 6, outline: "none", width: "100%", textAlign: "center",
                                                                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{
                                                                display: "inline-flex", alignItems: "center", padding: "4px 10px",
                                                                borderRadius: 6, fontSize: 12, fontWeight: 700,
                                                                color: "#2563eb", background: "#eff6ff", border: `1px solid rgba(59,130,246,0.3)`
                                                            }}>{currentData.bank_tujuan}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                                    <CellContent isEditing={isEditing} value={currentData.no_rek} onChange={(v: string) => handleTempChange('no_rek', v)} monospaced />
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                                    <CellContent isEditing={isEditing} value={currentData.prefix_penerima} onChange={(v: string) => handleTempChange('prefix_penerima', v)} blue />
                                                </td>

                                                {/* Data Transaksi */}
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13, borderLeft: "1px solid #e2e8f0" }}>
                                                    <CellContent isEditing={isEditing} value={currentData.kode_produk} onChange={(v: string) => handleTempChange('kode_produk', v)} align={isEditing ? "left" : "right"} />
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a" }}>
                                                    <CellContent isEditing={isEditing} value={currentData.volume} onChange={(v: string) => handleTempChange('volume', parseInt(v) || 0)} align={isEditing ? "left" : "right"} bold isNumber={true} />
                                                </td>
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 15 }}>
                                                    <CellContent isEditing={isEditing} value={currentData.jumlah} onChange={(v: string) => handleTempChange('jumlah', v)} align={isEditing ? "left" : "right"} bold green monospaced />
                                                </td>

                                                {/* Action */}
                                                <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", borderLeft: "1px solid #e2e8f0", textAlign: "center", minWidth: 120 }}>
                                                    {isEditing ? (
                                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                style={{
                                                                    background: "#10b981", color: "#0f172a", border: "none", borderRadius: 6,
                                                                    padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                                    display: "flex", alignItems: "center", gap: 4
                                                                }}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                                Simpan
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                style={{
                                                                    background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 6,
                                                                    padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                                    display: "flex", alignItems: "center", gap: 4
                                                                }}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditClick(d)}
                                                            style={{
                                                                background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 6,
                                                                padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                                transition: "all 0.2s ease"
                                                            }}>
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={11} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                            Tidak ada data transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "0 8px" }}>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Halaman <span style={{ color: "#2563eb", fontWeight: 700 }}>{page}</span></p>
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
                                    disabled={dashboardData.length < limit || isLoading}
                                    onClick={() => setPage(p => p + 1)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "8px 16px", borderRadius: 10,
                                        background: dashboardData.length < limit ? "#f1f5f9" : "#eff6ff",
                                        border: `1px solid ${dashboardData.length < limit ? "#e2e8f0" : "#bfdbfe"}`,
                                        color: dashboardData.length < limit ? "#94a3b8" : "#2563eb",
                                        cursor: dashboardData.length < limit ? "not-allowed" : "pointer",
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
            `}</style>
        </div>
    );
}
