export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type RequestOptions = {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
};

async function fetcher(endpoint: string, options: RequestOptions = {}) {
    const { method = "GET", body, headers = {} } = options;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body) {
        if (body instanceof FormData) {
            delete (config.headers as any)["Content-Type"];
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            let message = "Terjadi kesalahan pada server.";

            if (response.status === 401) {
                message = "Email atau password salah.";
            } else if (response.status === 403) {
                message = "Anda tidak memiliki akses ke fitur ini.";
            } else if (response.status === 404) {
                message = "Layanan tidak ditemukan.";
            } else if (response.status >= 500) {
                message = "Server sedang mengalami gangguan. Silakan coba lagi nanti.";
            } else if (result.message) {
                message = result.message;
            }

            const error = new Error(message);
            (error as any).status = response.status;
            (error as any).data = result.data;
            throw error;
        }

        return result;
    } catch (err: any) {
        if (err.name === "TypeError" && err.message === "Failed to fetch") {
            throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        }
        throw err;
    }
}

export const apiClient = {
    get: (endpoint: string, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "GET" }),
    post: (endpoint: string, body?: any, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "POST", body }),
    put: (endpoint: string, body?: any, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "PUT", body }),
    delete: (endpoint: string, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "DELETE" }),
};
