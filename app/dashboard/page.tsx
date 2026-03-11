"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { reportService } from "@/lib/services/report";
import { authService } from "@/lib/services/auth";
import Header from "@/components/header";
import { useDashboard } from "@/lib/context/dashboard-context";

export default function DashboardPage() {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useDashboard();
    const [search, setSearch] = useState("");
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [filterBankTujuan, setFilterBankTujuan] = useState("");

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



    const fetchReports = async (pageNum = 1, limitNum = 20, query = "", start = startDate, end = endDate, bankTujuan = filterBankTujuan) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await reportService.getPaybankReports({
                page: pageNum,
                limit: limitNum,
                search: query,
                start_date: start,
                end_date: end,
                bank_tujuan: bankTujuan
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
            fetchReports(page, limit, search, startDate, endDate, filterBankTujuan);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, limit, search, startDate, endDate, filterBankTujuan]);

    // Hardcode common bank tujuan since API filters out other banks
    const uniqueBankTujuan = ["BCA", "BRI", "BNI", "MANDIRI", "BTN", "BSI", "CIMB", "PERMATA", "DANAMON", "MEGA", "MAYBANK"];

    // Data is already filtered by backend
    const filteredData = dashboardData;


    const CellContent = ({ value, align = "left", bold = false, monospaced = false, blue = false, green = false }: any) => {
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
        <>
            <Header
                title="Dashboard Penjualan Paybank"
                subtitle="Rekap data transaksi harian"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <main style={{ padding: 28 }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                    <div>
                        <p style={{ fontSize: 14, color: "#334155", margin: 0, fontWeight: 500 }}>
                            Menampilkan {filteredData.length} dari {dashboardData.length} data transaksi
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

                        {/* Bank Tujuan Filter */}
                        <select
                            value={filterBankTujuan}
                            onChange={(e) => { setFilterBankTujuan(e.target.value); setPage(1); }}
                            style={{
                                background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 13, outline: "none",
                                cursor: "pointer", minWidth: 150
                            }}>
                            <option value="">Semua Bank Tujuan</option>
                            {uniqueBankTujuan.map((bank: string) => (
                                <option key={bank} value={bank}>{bank}</option>
                            ))}
                        </select>


                        {/* Export CSV */}
                        <button
                            onClick={async () => {
                                setIsExporting(true);
                                try {
                                    await reportService.exportCsv({ start_date: startDate, end_date: endDate, bank_tujuan: filterBankTujuan });
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
                                    await reportService.exportExcel({ start_date: startDate, end_date: endDate, bank_tujuan: filterBankTujuan });
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
                                <th colSpan={3} style={{ textAlign: "center", padding: "10px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Transaksi</th>
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
                            ) : filteredData.length > 0 ? (
                                filteredData.map((d: any) => (
                                    <tr key={d.id} style={{
                                        transition: "background 0.2s"
                                    }} className="hover:bg-slate-50">
                                        {/* Data Pengirim */}
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a" }}>
                                            <CellContent value={d.pengirim} bold />
                                        </td>

                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                            <CellContent value={d.prefix_pengirim} blue />
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                            <CellContent value={d.kota_pengirim} />
                                        </td>

                                        {/* Data Penerima */}
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", borderLeft: "1px solid #e2e8f0" }}>
                                            <CellContent value={d.nama_penerima} bold />
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9" }}>
                                            <div style={{ padding: "0 8px" }}>
                                                <span style={{
                                                    display: "inline-flex", alignItems: "center", padding: "4px 10px",
                                                    borderRadius: 6, fontSize: 12, fontWeight: 700,
                                                    color: "#2563eb", background: "#eff6ff", border: `1px solid rgba(59,130,246,0.3)`
                                                }}>{d.bank_tujuan}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                            <CellContent value={d.no_rek} monospaced />
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                                            <CellContent value={d.prefix_penerima} blue />
                                        </td>

                                        {/* Data Transaksi */}
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 13, borderLeft: "1px solid #e2e8f0" }}>
                                            <CellContent value={d.kode_produk} align="right" />
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a" }}>
                                            <CellContent value={d.volume} align="right" bold />
                                        </td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid #f1f5f9", fontSize: 15 }}>
                                            <CellContent value={d.jumlah} align="right" bold green monospaced />
                                        </td>
                                    </tr>
                                ))
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
        </>
    );
}
