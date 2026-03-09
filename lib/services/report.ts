import { apiClient } from "../api-client";

export const reportService = {
    getPaybankReports: (params: { page?: number; limit?: number; search?: string; start_date?: string; end_date?: string } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.search) query.append("search", params.search);
        if (params.start_date) query.append("start_date", params.start_date);
        if (params.end_date) query.append("end_date", params.end_date);

        return apiClient.get(`/reports/paybank?${query.toString()}`);
    },

    exportCsv: async (params: { start_date: string; end_date: string }) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
            `http://localhost:8080/reports/paybank/export-csv?start_date=${params.start_date}&end_date=${params.end_date}`,
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            }
        );
        if (!res.ok) throw new Error("Gagal mengunduh CSV.");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `paybank_${params.start_date}_${params.end_date}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },
};
