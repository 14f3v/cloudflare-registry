import { useAuth } from '../context/AuthContext'

export function LoginModal() {
    const { showLoginModal, setShowLoginModal } = useAuth()

    if (!showLoginModal) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={() => setShowLoginModal(false)}
        >
            {/* Glassmorphism Modal */}
            <div
                className="relative max-w-md w-full mx-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Background Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-purple-500/40 blur-3xl opacity-60"></div>

                {/* Glass Card */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Close Button - Glass Style */}
                    <button
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all"
                        onClick={() => setShowLoginModal(false)}
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4 drop-shadow-lg">🔐</div>
                            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                                Sign In
                            </h2>
                            <p className="text-white/70">
                                Access your private repositories
                            </p>
                        </div>

                        {/* Glass Auth Buttons */}
                        <div className="flex flex-col gap-3">
                            {/* Google - White Glass */}
                            <a
                                href="/auth/google"
                                className="group relative overflow-hidden rounded-2xl"
                            >
                                <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex items-center justify-center gap-3 px-6 py-4 backdrop-blur-sm">
                                    <img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    <span className="font-semibold text-gray-900">Continue with Google</span>
                                </div>
                            </a>

                            {/* GitHub - Dark Glass */}
                            <a
                                href="/auth/github"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                                    alt="GitHub"
                                    className="w-5 h-5 invert"
                                />
                                Continue with GitHub
                            </a>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-white/50">
                                By continuing, you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
