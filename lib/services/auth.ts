import { apiClient } from "../api-client";

export const authService = {
    login: (credentials: any) => apiClient.post("/auth/login", credentials),
};
