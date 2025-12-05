import { cn } from '../../utils/cn'

interface StepCardProps {
    number: number
    title: string
    children: React.ReactNode
    hint?: string
    className?: string
}

export function StepCard({ number, title, children, hint, className }: StepCardProps) {
    return (
        <div className={cn('relative group', className)}>
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"></div>

            {/* Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                {/* Number Badge - Glass */}
                <div
                    className={cn(
                        'absolute -top-4 left-6',
                        'w-12 h-12 flex items-center justify-center',
                        'bg-gradient-to-br from-primary to-primary-dark',
                        'backdrop-blur-sm border border-white/30',
                        'text-white font-bold text-xl rounded-full',
                        'shadow-lg shadow-primary/30',
                        'group-hover:scale-110 transition-transform duration-300'
                    )}
                >
                    {number}
                </div>

                <div className="pt-6">
                    <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-sm">
                        {title}
                    </h3>

                    <div className="mb-3">
                        {children}
                    </div>

                    {hint && (
                        <p className="text-sm text-white/60 italic mt-3">
                            {hint}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
