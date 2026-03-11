import { apiClient } from "../api-client";

export interface KycItem {
    user_name: string;
    full_name: string;
    is_kyc_approved: string;
    saldo: string;
    nik: string;
    kode_prov: string;
    province: string;
    kode_kota: string;
    alamat: string;
    kab_kota: string;
    kode_kec: string;
    kec: string;
    kode_kel_des: string;
    kel_des: string;
    kode_pos: string;
    tanggal_gabung: string;
    kyc_files: string;
    email?: string; // Kept as optional if still comes from backend in some cases
}

export const kycService = {
    getKycData: (params: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: KycItem[], meta: { total: number } }> => {
        const query = new URLSearchParams();
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.search) query.append("search", params.search);

        const queryStr = query.toString();
        return apiClient.get(`/kyc${queryStr ? `?${queryStr}` : ""}`);
    },
};

