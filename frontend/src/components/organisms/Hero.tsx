import { StatCard } from '../molecules/StatCard'
import { cn } from '../../utils/cn'

interface HeroProps {
    className?: string
}

export function Hero({ className }: HeroProps) {
    return (
        <div className={cn('relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl mb-12', className)}>
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0">
                {/* Animated orbs */}
                <div className="absolute w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-float-orb top-[-100px] left-[-100px]" />
                <div className="absolute w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-float-orb bottom-[-50px] right-[-50px]" style={{ animationDelay: '2s' }} />
                <div className="absolute w-60 h-60 bg-purple-500/30 rounded-full blur-3xl animate-float-orb top-1/2 left-1/2" style={{ animationDelay: '4s' }} />
            </div>

            {/* Glassmorphism Content */}
            <div className="relative z-10 text-center px-8 py-16 max-w-4xl">
                {/* Glass Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                    <span className="animate-pulse-slow text-lg">✨</span>
                    <span className="text-white/90 font-medium">Serverless Docker Registry</span>
                </div>

                <h1 className="text-6xl font-extrabold leading-tight mb-6">
                    <span className="text-white drop-shadow-lg">Production-Ready</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl">
                        Container Registry
                    </span>
                </h1>

                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    Enterprise-grade Docker Registry v2 running on Cloudflare's global network.
                    <br />
                    Built for speed, security, and scale.
                </p>

                {/* Glass Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
                        <StatCard icon="⚡" value="~50ms" label="Global Latency" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
                        <StatCard icon="🌍" value="300+" label="Edge Locations" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
                        <StatCard icon="🔒" value="100%" label="Secure by Default" />
                    </div>
                </div>
            </div>
        </div>
    )
}
