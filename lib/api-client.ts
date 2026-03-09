const BASE_URL = "http://localhost:8080";

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

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || "Something went wrong");
        (error as any).status = response.status;
        (error as any).data = result.data;
        throw error;
    }

    return result;
}

export const apiClient = {
    get: (endpoint: string, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "GET" }),
    post: (endpoint: string, body?: any, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "POST", body }),
    put: (endpoint: string, body?: any, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "PUT", body }),
    delete: (endpoint: string, options?: RequestOptions) => fetcher(endpoint, { ...options, method: "DELETE" }),
};
