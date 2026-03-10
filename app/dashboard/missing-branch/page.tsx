"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { reportService } from "@/lib/services/report";
import Header from "@/components/header";
import { useDashboard } from "@/lib/context/dashboard-context";

export default function MissingBranchPage() {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useDashboard();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [filterBankTujuan, setFilterBankTujuan] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);

    const bankOptions = ["BCA", "BRI", "BNI", "MANDIRI", "BTN", "BSI", "CIMB", "PERMATA", "DANAMON", "MEGA", "MAYBANK"];

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

    const fetchMissingBranch = async (pageNum = 1, limitNum = 20, start = startDate, end = endDate, bankTujuan = filterBankTujuan) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await reportService.getMissingBranchReports({
                page: pageNum,
                limit: limitNum,
                start_date: start,
                end_date: end,
                bank_tujuan: bankTujuan
            });
            setData(result.data || []);
            setTotal(result.meta?.total || 0);
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

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMissingBranch(page, limit, startDate, endDate, filterBankTujuan);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, limit, startDate, endDate, filterBankTujuan]);

    return (
        <>
            <Header
                title="Missing Branch Report"
                subtitle="Data bank tujuan dan prefix yang tidak terdaftar di sistem"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main style={{ padding: 28, background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", borderRadius: 10, padding: "2px", border: "1px solid #e2e8f0" }}>
                        <input
                            type="date"
                            value={inputStartDate}
                            onChange={handleStartDateChange}
                            style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 12px", outline: "none", cursor: "pointer" }}
                        />
                        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>-</span>
                        <input
                            type="date"
                            value={inputEndDate}
                            onChange={handleEndDateChange}
                            style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 12px", outline: "none", cursor: "pointer" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <select
                            value={filterBankTujuan}
                            onChange={(e) => { setFilterBankTujuan(e.target.value); setPage(1); }}
                            style={{
                                background: "#ffffff", borderRadius: 10, padding: "10px 14px",
                                border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 13, outline: "none",
                                cursor: "pointer", minWidth: 150
                            }}>
                            <option value="">Semua Bank Tujuan</option>
                            {bankOptions.map((bank: string) => (
                                <option key={bank} value={bank}>{bank}</option>
                            ))}
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
                                {["No", "Bank Tujuan", "Prefix Penerima"].map((h) => (
                                    <th key={h} style={{
                                        padding: "14px 16px", fontSize: 12, fontWeight: 700,
                                        color: "#64748b", borderBottom: "1px solid #e2e8f0",
                                        textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} style={{ padding: "60px", textAlign: "center" }}>
                                        <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32, borderTopColor: "#2563eb" }} />
                                        <p style={{ color: "#64748b", fontSize: 14, marginTop: 16 }}>Memuat data missing branch...</p>
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((item, idx) => (
                                    <tr key={idx} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b", fontFamily: "var(--font-geist-mono)" }}>{(page - 1) * limit + idx + 1}</td>
                                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{item.bank_tujuan}</td>
                                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#1d4ed8", fontFamily: "var(--font-geist-mono)", fontWeight: 600 }}>
                                            <span style={{ padding: "4px 8px", background: "#eff6ff", borderRadius: 6, border: "1px solid #bfdbfe" }}>
                                                {item.prefix_penerima}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                                        Tidak ada data missing branch.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, padding: "0 8px" }}>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                            Halaman <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{page}</span> dari total <span style={{ color: "#0f172a", fontWeight: 700 }}>{total}</span> data
                        </p>
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
                                disabled={data.length < limit || (page * limit >= total) || isLoading}
                                onClick={() => setPage(p => p + 1)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 16px", borderRadius: 10,
                                    background: (data.length < limit || (page * limit >= total)) ? "#f1f5f9" : "#eff6ff",
                                    border: `1px solid ${(data.length < limit || (page * limit >= total)) ? "#e2e8f0" : "#bfdbfe"}`,
                                    color: (data.length < limit || (page * limit >= total)) ? "#94a3b8" : "#2563eb",
                                    cursor: (data.length < limit || (page * limit >= total)) ? "not-allowed" : "pointer",
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
            `}</style>
        </>
    );
}
