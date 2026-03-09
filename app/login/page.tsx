"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });

      // Simpan token atau data user jika diperlukan
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      // Redirect ke dashboard setelah login berhasil
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login gagal. Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg flex min-h-screen items-center justify-center px-4">
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Login Card */}
      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 sm:p-10">
        {/* Logo / Brand */}
        <div className="animate-fade-in-up mb-8 text-center">
          <div className="logo-glow mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portal Report BI
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message mb-5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {/* Email Field */}
          <div className="animate-fade-in-up animate-delay-100">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <div className="input-wrapper relative">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="animate-fade-in-up animate-delay-200">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="input-wrapper relative">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input-field pr-12"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="animate-fade-in-up animate-delay-300 flex items-center justify-between">
            <label
              htmlFor="remember-me"
              className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600"
            >
              <input
                id="remember-me"
                type="checkbox"
                className="custom-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ingat saya
            </label>
            <a href="#" className="link-accent text-sm" id="forgot-password-link">
              Lupa password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in-up animate-delay-400 pt-1">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              id="login-button"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="animate-fade-in-up animate-delay-500 mt-8 text-center">
          <p className="text-sm text-slate-500">
            © 2026 Portal Report BI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
