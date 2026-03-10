import { apiClient } from "../api-client";

export const authService = {
    login: (credentials: any) => apiClient.post("/auth/login", credentials),
    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
    }
};
