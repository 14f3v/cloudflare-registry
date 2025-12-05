import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    children: React.ReactNode
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
                {
                    'bg-surface border border-border text-text': variant === 'default',
                    'bg-primary/10 border border-primary/20 text-primary': variant === 'primary',
                    'bg-green-500/10 border border-green-500/20 text-green-500': variant === 'success',
                    'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500': variant === 'warning',
                    'bg-red-500/10 border border-red-500/20 text-red-500': variant === 'danger',
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
