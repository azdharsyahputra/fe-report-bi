"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { reportService } from "@/lib/services/report";
import { branchService } from "@/lib/services/branch";
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        regencies_code: "",
        regencies: "",
        office_type: ""
    });

    const SkeletonRow = () => (
        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            {Array.from({ length: 3 }).map((_, i) => (
                <td key={i} style={{ padding: "16px 16px" }}>
                    <div className="skeleton-box" style={{ 
                        height: i === 1 ? "16px" : "12px", 
                        width: i === 1 ? "80%" : "60%",
                        borderRadius: "4px"
                    }} />
                </td>
            ))}
        </tr>
    );

    const bankOptions = ["ARTHA", "BCA", "BNI", "BRI", "BSM", "CIMB NIAGA", "DANAMON", "MANDIRI"];

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

    const handleOpenModal = (item: any) => {
        setSelectedItem(item);
        setFormData({
            regencies_code: item.regencies_code || "",
            regencies: item.regencies || "",
            office_type: item.office_type || ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({ regencies_code: "", regencies: "", office_type: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        setIsSubmitting(true);
        try {
            await branchService.createBranchBank({
                name: selectedItem.name,
                branch_code: selectedItem.branch_code,
                regencies_code: formData.regencies_code,
                regencies: formData.regencies,
                office_type: formData.office_type
            });
            handleCloseModal();
            fetchMissingBranch(page, limit, startDate, endDate, filterBankTujuan);
        } catch (err: any) {
            alert(err.message || "Gagal melakukan update missing branch");
        } finally {
            setIsSubmitting(false);
        }
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
                                {["No", "Bank Tujuan", "Prefix Penerima", "Aksi"].map((h) => (
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
                                Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonRow key={`skeleton-${i}`} />
                                ))
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
                                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                style={{
                                                    background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
                                                    padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "0.2s"
                                                }}
                                                className="hover:bg-blue-100"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
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

            {isModalOpen && selectedItem && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24
                }}>
                    <div style={{
                        background: "#fff", padding: 32, borderRadius: 16, width: "100%", maxWidth: 500,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        animation: "fadeIn 0.2s ease"
                    }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8, marginTop: 0 }}>Update Missing Branch</h2>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>
                            Lengkapi data Mapping cabang bank berikut ini
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Bank Tujuan / Name</label>
                                    <input type="text" value={selectedItem.name} disabled style={{
                                        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 14, outline: "none"
                                    }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Branch Code</label>
                                    <input type="text" value={selectedItem.branch_code} disabled style={{
                                        width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 14, outline: "none"
                                    }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Regencies Code</label>
                                <input type="text" value={formData.regencies_code} onChange={e => setFormData({ ...formData, regencies_code: e.target.value })} required style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#ffffff", color: "#0f172a", fontSize: 14, outline: "none", transition: "0.2s"
                                }} className="focus:ring-2 focus:ring-blue-500" placeholder="Kode wilayah (e.g. 0100)" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Regencies</label>
                                <input type="text" value={formData.regencies} onChange={e => setFormData({ ...formData, regencies: e.target.value })} required style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#ffffff", color: "#0f172a", fontSize: 14, outline: "none", transition: "0.2s"
                                }} className="focus:ring-2 focus:ring-blue-500" placeholder="Nama wilayah (e.g. KOTA JAKARTA)" />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>Office Type</label>
                                <select value={formData.office_type} onChange={e => setFormData({ ...formData, office_type: e.target.value })} required style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#ffffff", color: "#0f172a", fontSize: 14, outline: "none", cursor: "pointer", transition: "0.2s"
                                }} className="focus:ring-2 focus:ring-blue-500">
                                    <option value="" disabled>Pilih tipe kantor</option>
                                    <option value="KCU">KCU</option>
                                    <option value="KCP">KCP</option>
                                    <option value="KC">KC</option>
                                    <option value="KAS">KAS</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                                <button type="button" onClick={handleCloseModal} style={{
                                    padding: "10px 20px", borderRadius: 10, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer"
                                }}>
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} style={{
                                    padding: "10px 20px", borderRadius: 10, background: isSubmitting ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer"
                                }}>
                                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .spinner {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top: 3px solid #fff;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                }
                .skeleton-box {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite linear;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
