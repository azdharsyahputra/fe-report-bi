"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { branchService } from "@/lib/services/branch";
import Header from "@/components/header";
import { useDashboard } from "@/lib/context/dashboard-context";

export default function ImportBranchPage() {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [importSummary, setImportSummary] = useState<any>(null);
    const [importErrors, setImportErrors] = useState<any[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (selectedFile: File) => {
        // Check if it's an excel file
        if (!selectedFile.name.match(/\.(xlsx|xls|xlsm)$/)) {
            setError("Harap pilih file Excel (.xlsx, .xls, atau .xlsm)");
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <>
            <Header
                title="Import Branch Bank"
                subtitle="Unggah file Excel untuk memperbarui data cabang"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main style={{ padding: 28, background: "#f8fafc" }}>
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
                            border: isDragging ? "2px dashed #2563eb" : "2px dashed rgba(37, 99, 235, 0.3)",
                            borderRadius: 12,
                            padding: "48px 20px",
                            transition: "all 0.2s ease",
                            background: isDragging ? "rgba(37, 99, 235, 0.05)" : "#f8fafc",
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onMouseOver={(e) => {
                            if (!isDragging) e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.6)";
                        }}
                        onMouseOut={(e) => {
                            if (!isDragging) e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.3)";
                        }}
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
                            Klik atau seret file `.xlsx`, `.xls`, atau `.xlsm` di sini untuk mulai mengimpor data branch bank.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept=".xlsx, .xls, .xlsm"
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
                    <>
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
                    </>
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
