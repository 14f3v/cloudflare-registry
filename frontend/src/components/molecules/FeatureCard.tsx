import { cn } from '../../utils/cn'

interface FeatureCardProps {
    icon: string
    title: string
    description: string
    className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
    return (
        <div className={cn(
            'group relative overflow-hidden',
            className
        )}>
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

            {/* Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon with Glass Background */}
                <div
                    className={cn(
                        'w-14 h-14 flex items-center justify-center',
                        'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm',
                        'border border-white/20',
                        'rounded-xl mb-4',
                        'group-hover:scale-110 transition-transform duration-300'
                    )}
                >
                    <span className="text-3xl drop-shadow-lg">{icon}</span>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-sm">
                    {title}
                </h3>

                <p className="text-white/70 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}
