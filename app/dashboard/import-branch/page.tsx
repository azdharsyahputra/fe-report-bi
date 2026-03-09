"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const navLinks = [
    { name: "Dashboard", href: "/dashboard", active: false, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
    { name: "KYC", href: "/dashboard/kyc", active: false, icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { name: "Branch Data", href: "/dashboard/branch", active: false, icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-12h1m-1 4h1m-1 4h1" },
    { name: "Import Branch", href: "/dashboard/import-branch", active: true, icon: "M12 2L2 7l10 5 10-5-10-5z" },
    { name: "Pengaturan", href: "#", active: false, icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
];

import { branchService } from "@/lib/services/branch";

export default function ImportBranchPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [importSummary, setImportSummary] = useState<any>(null);
    const [importErrors, setImportErrors] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogout = () => {
        router.push("/login");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Check if it's an excel file
        if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
            setError("Harap pilih file Excel (.xlsx atau .xls)");
            return;
        }

        setError(null);
        setSuccessMsg(null);
        setImportSummary(null);
        setImportErrors([]);
        setIsLoading(true);

        try {
            const result = await branchService.importExcel(selectedFile);

            // Store summary and errors from new API structure
            setImportSummary(result.data);
            setImportErrors(result.data.errors || []);
            setSuccessMsg(result.message || "Import selesai");

            // Clear input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat mengunggah file.");
        } finally {
            setIsLoading(false);
        }
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
                                <path d={link.icon} />
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
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Import Branch Bank</h2>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Unggah file Excel untuk memperbarui data cabang</p>
                        </div>
                    </div>
                </header>

                <main style={{ padding: 28 }}>
                    {/* Upload Section */}
                    <div style={{
                        background: "#ffffff",
                        borderRadius: 16,
                        border: "1px solid #e2e8f0",
                        padding: 32,
                        backdropFilter: "blur(8px)",
                        marginBottom: 28,
                        textAlign: "center"
                    }}>
                        <div
                            style={{
                                cursor: "pointer",
                                border: "2px dashed rgba(37, 99, 235, 0.3)",
                                borderRadius: 12,
                                padding: "48px 20px",
                                transition: "all 0.2s ease",
                                background: "#f8fafc",
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.6)")}
                            onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.3)")}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20,
                                    background: "rgba(37, 99, 235, 0.12)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto", color: "#1d4ed8"
                                }}>
                                    {isLoading ? (
                                        <div className="spinner" style={{ width: 24, height: 24, borderTopColor: "#2563eb" }} />
                                    ) : (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <h3 style={{ fontSize: 18, color: "#0f172a", marginBottom: 8, fontWeight: 600 }}>
                                {isLoading ? "Sedang Mengimpor..." : "Pilih File Excel"}
                            </h3>
                            <p style={{ color: "#64748b", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
                                Klik atau seret file `.xlsx` atau `.xls` di sini untuk mulai mengimpor data branch bank.
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div style={{
                                marginTop: 16, padding: "12px 16px", borderRadius: 8,
                                background: "rgba(239, 68, 68, 0.1)", border: "1px solid #fecaca",
                                color: "#f87171", fontSize: 14, display: "flex", alignItems: "center", gap: 8, justifyContent: "center"
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{
                                marginTop: 16, padding: "12px 16px", borderRadius: 8,
                                background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)",
                                color: "#10b981", fontSize: 14, display: "flex", alignItems: "center", gap: 8, justifyContent: "center"
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                {successMsg}
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    {importSummary && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 28 }}>
                            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, backdropFilter: "blur(8px)" }}>
                                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Total Baris</p>
                                <p style={{ color: "#0f172a", fontSize: 24, fontWeight: 700, margin: 0 }}>{importSummary.total_rows_found}</p>
                            </div>
                            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid rgba(16, 185, 129, 0.15)", padding: 20, backdropFilter: "blur(8px)" }}>
                                <p style={{ color: "#10b981", fontSize: 12, marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Berhasil</p>
                                <p style={{ color: "#10b981", fontSize: 24, fontWeight: 700, margin: 0 }}>{importSummary.total_success}</p>
                            </div>
                            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #fecaca", padding: 20, backdropFilter: "blur(8px)" }}>
                                <p style={{ color: "#f87171", fontSize: 12, marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Gagal</p>
                                <p style={{ color: "#f87171", fontSize: 24, fontWeight: 700, margin: 0 }}>{importSummary.total_failed}</p>
                            </div>
                            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, backdropFilter: "blur(8px)" }}>
                                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Durasi Insert</p>
                                <p style={{ color: "#0f172a", fontSize: 18, fontWeight: 600, margin: 0 }}>{(importSummary.insert_duration / 1000000).toFixed(2)} ms</p>
                            </div>
                        </div>
                    )}

                    {/* Table Section - Errors Only */}
                    {importErrors.length > 0 && (
                        <div style={{
                            background: "#ffffff", borderRadius: 16,
                            border: "1px solid #fecaca", padding: 24,
                            backdropFilter: "blur(8px)", overflowX: "auto"
                        }}>
                            <div style={{ marginBottom: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Daftar Kesalahan</h3>
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Detail baris yang gagal diimpor</p>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {["Baris", "Indeks Tabel", "Pesan Kesalahan"].map((h) => (
                                            <th key={h} style={{
                                                padding: "14px 16px", fontSize: 12, fontWeight: 700,
                                                color: "#64748b", borderBottom: "1px solid #e2e8f0",
                                                textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em"
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {importErrors.map((err, idx) => (
                                        <tr key={idx} style={{ transition: "background 0.2s" }} className="hover:bg-red-50">
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #fecaca", fontSize: 14, color: "#0f172a", fontFamily: "var(--font-geist-mono)" }}>{err.row}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #fecaca", fontSize: 14, color: "#0f172a" }}>{err.table_index}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid #fecaca", fontSize: 13, color: "#f87171" }}>{err.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
            `}</style>
        </div>
    );
}
