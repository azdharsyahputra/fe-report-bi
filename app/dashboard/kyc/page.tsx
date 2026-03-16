"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { kycService, KycItem } from "@/lib/services/kyc";
import { authService } from "@/lib/services/auth";
import { BASE_URL } from "@/lib/api-client";
import Header from "@/components/header";
import { useDashboard } from "@/lib/context/dashboard-context";

export default function KYCPage() {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useDashboard();
    const [search, setSearch] = useState("");
    const [kycData, setKycData] = useState<KycItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    
    // Date Helpers
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

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };


    const fetchKycData = async (pageNum = 1, limitNum = 20, query = "", start = startDate, end = endDate) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await kycService.getKycData({
                page: pageNum,
                limit: limitNum,
                search: query,
                start_date: start,
                end_date: end,
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
            fetchKycData(page, limit, search, startDate, endDate);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [page, limit, search, startDate, endDate]);

    const SkeletonRow = () => (
        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            {Array.from({ length: 9 }).map((_, i) => (
                <td key={i} style={{ padding: "16px 16px" }}>
                    <div className="skeleton-box" style={{ 
                        height: i === 2 ? "16px" : "12px", 
                        width: i === 2 ? "90%" : i === 3 ? "70%" : "60%",
                        borderRadius: "4px"
                    }} />
                    {i === 3 && <div className="skeleton-box" style={{ height: "10px", width: "40%", marginTop: "6px", borderRadius: "4px" }} />}
                </td>
            ))}
        </tr>
    );

    // No longer needed as API returns full URLs, but kept as helper for safety
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const cleanName = url.replace(/\\/g, "/").split("/").pop() || "";
        return `${BASE_URL}/kyc/images/${cleanName}`;
    };

    return (
        <>
            <Header
                title="Verifikasi KYC Nasabah"
                subtitle="Data verifikasi identitas nasabah"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <main style={{ padding: 28, background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Date Filter */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", borderRadius: 10, padding: "2px", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", alignItems: "center", padding: "0 8px 0 12px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <input
                                type="date"
                                value={inputStartDate}
                                onChange={handleStartDateChange}
                                style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 0", outline: "none", cursor: "pointer", width: 110 }}
                            />
                            <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>-</span>
                            <input
                                type="date"
                                value={inputEndDate}
                                onChange={handleEndDateChange}
                                style={{ background: "transparent", border: "none", color: "#0f172a", fontSize: 13, padding: "8px 12px 8px 0", outline: "none", cursor: "pointer", width: 125 }}
                            />
                        </div>

                        <div>
                            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                                <span style={{ fontWeight: 600, color: "#0f172a" }}>{totalData}</span> nasabah ditemukan
                            </p>
                        </div>
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
                                {["No", "Username", "Nama Lengkap", "Alamat", "Kec/Kel", "Kab/Provinsi", "Saldo", "Status", "File"].map(h => (
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
                                Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonRow key={`skeleton-${i}`} />
                                ))
                            ) : kycData.length > 0 ? (
                                kycData.map((d: KycItem, idx: number) => {
                                    const kycFiles = d.kyc_files ? d.kyc_files.split(',') : [];
                                    const isApproved = d.is_kyc_approved === "1";
                                    
                                    return (
                                        <tr key={d.user_name + '-' + idx} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#64748b", fontFamily: "var(--font-geist-mono)" }}>{(page - 1) * limit + idx + 1}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#1d4ed8", fontFamily: "var(--font-geist-mono)" }}>{d.user_name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{d.full_name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                                <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.alamat}>
                                                    {d.alamat}
                                                </div>
                                                <div style={{ fontSize: 11, color: "#64748b" }}>ZIP: {d.kode_pos}</div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                                <div>{d.kec}</div>
                                                <div style={{ fontSize: 11, color: "#64748b" }}>{d.kel_des}</div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" }}>
                                                <div>{d.kab_kota}</div>
                                                <div style={{ fontSize: 11, color: "#64748b" }}>{d.province}</div>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#059669", fontWeight: 600 }}>
                                                Rp {parseInt(d.saldo).toLocaleString('id-ID')}
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                                                <span style={{
                                                    display: "inline-flex", padding: "4px 10px", borderRadius: 20,
                                                    background: isApproved ? "#ecfdf5" : "#fff7ed",
                                                    color: isApproved ? "#059669" : "#ea580c",
                                                    fontSize: 11, fontWeight: 600, border: `1px solid ${isApproved ? "#10b98133" : "#f9731633"}`
                                                }}>
                                                    {isApproved ? "Approved" : "Pending"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    {kycFiles.length > 0 ? kycFiles.map((url: string, i: number) => (
                                                        <div
                                                            key={i}
                                                            style={{ position: "relative", width: 42, height: 42, overflow: "hidden", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", cursor: "pointer", transition: "transform 0.2s" }}
                                                            onClick={() => handleImageClick(getImageUrl(url))}
                                                        >
                                                            <img src={getImageUrl(url)} alt={`KYC-${i}`} className="hover:scale-110" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.2s" }} />
                                                        </div>
                                                    )) : (
                                                        <span style={{ color: "#94a3b8", fontSize: 12 }}>-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })

                            ) : (
                                <tr>
                                    <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
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
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
}
