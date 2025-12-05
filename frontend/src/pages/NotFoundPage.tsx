import { Link } from 'react-router-dom'

export function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-[600px] px-4">
            {/* Glassmorphism Card */}
            <div className="relative max-w-md w-full">
                {/* Gradient Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-purple-500/30 blur-3xl opacity-50"></div>

                {/* Glass Card */}
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
                    {/* Animated Icon */}
                    <div className="text-8xl mb-6 text-center animate-float">
                        🔍
                    </div>

                    {/* Title */}
                    <h1 className="text-7xl font-extrabold mb-4 text-center">
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            404
                        </span>
                    </h1>

                    <h2 className="text-3xl font-bold text-white mb-3 text-center">
                        Page Not Found
                    </h2>

                    <p className="text-lg text-white/70 mb-8 text-center leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    {/* Glass Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/"
                            className="group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-75 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition-all">
                                <span>🏠</span>
                                <span>Go Home</span>
                            </div>
                        </Link>
                        <Link
                            to="/browse"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/30 transition-all"
                        >
                            <span>📦</span>
                            <span>Browse Images</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
