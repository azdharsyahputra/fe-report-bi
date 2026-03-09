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
};
