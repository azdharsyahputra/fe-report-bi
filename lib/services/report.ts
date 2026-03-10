import { apiClient, BASE_URL } from "../api-client";

export const reportService = {
    getPaybankReports: (params: { page?: number; limit?: number; search?: string; start_date?: string; end_date?: string; bank_tujuan?: string } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.search) query.append("search", params.search);
        if (params.start_date) query.append("start_date", params.start_date);
        if (params.end_date) query.append("end_date", params.end_date);
        if (params.bank_tujuan) query.append("bank_tujuan", params.bank_tujuan);

        return apiClient.get(`/reports/paybank?${query.toString()}`);
    },

    exportCsv: async (params: { start_date: string; end_date: string; bank_tujuan?: string }) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const bankQuery = params.bank_tujuan ? `&bank_tujuan=${params.bank_tujuan}` : "";
        const res = await fetch(
            `${BASE_URL}/reports/paybank/export-csv?start_date=${params.start_date}&end_date=${params.end_date}${bankQuery}`,
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

    exportExcel: async (params: { start_date: string; end_date: string; bank_tujuan?: string }) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const bankQuery = params.bank_tujuan ? `&bank_tujuan=${params.bank_tujuan}` : "";
        const res = await fetch(
            `${BASE_URL}/reports/paybank/export-excel?start_date=${params.start_date}&end_date=${params.end_date}${bankQuery}`,
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            }
        );
        if (!res.ok) throw new Error("Gagal mengunduh Excel.");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `paybank_${params.start_date}_${params.end_date}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },
};
