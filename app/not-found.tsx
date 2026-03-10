import Link from "next/link";

export default function NotFound() {
    return (
        <div className="login-bg flex min-h-screen flex-col items-center justify-center px-4 text-center">
            {/* Floating Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="glass-card relative z-10 w-full max-w-md space-y-8 rounded-2xl p-10">
                <div className="animate-fade-in-up">
                    <div className="logo-glow mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500">
                        <span className="text-3xl font-bold text-white">404</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="mt-4 text-slate-500">
                        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                    </p>
                </div>

                <div className="animate-fade-in-up animate-delay-200 pt-4">
                    <Link
                        href="/dashboard"
                        className="btn-primary inline-flex items-center justify-center gap-2 no-underline"
                    >
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
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                </div>

                <div className="animate-fade-in-up animate-delay-400 mt-8 text-sm text-slate-400">
                    © 2026 Portal Report BI. All rights reserved.
                </div>
            </div>
        </div>
    );
}
