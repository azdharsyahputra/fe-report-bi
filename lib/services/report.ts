import { apiClient } from "../api-client";

export const reportService = {
    getPaybankReports: (params: { page?: number; limit?: number; search?: string } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.search) query.append("search", params.search);

        return apiClient.get(`/reports/paybank?${query.toString()}`);
    },
};
