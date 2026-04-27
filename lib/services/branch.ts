import { apiClient } from "../api-client";

export const branchService = {
    getBranches: (params: { bank_name?: string; search?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params.bank_name) query.append("bank_name", params.bank_name);
        if (params.search) query.append("search", params.search);
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());

        return apiClient.get(`/branch-bank?${query.toString()}`);
    },
    createBranchBank: (data: any) => apiClient.post("/branch-bank", data),
    updateBranch: (id: number, data: any) => apiClient.put(`/branch-bank/${id}`, data),
    importExcel: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post("/import/branch-bank-excel", formData);
    },
};
