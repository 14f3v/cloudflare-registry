import { cn } from '../../utils/cn'

interface StatCardProps {
    icon: string
    value: string | number
    label: string
    className?: string
}

export function StatCard({ icon, value, label, className }: StatCardProps) {
    return (
        <div className={cn('text-center', className)}>
            <div className="text-4xl mb-2 animate-float">
                {icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
                {value}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wide">
                {label}
            </div>
        </div>
    )
}
