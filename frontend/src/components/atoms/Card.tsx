import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    children: React.ReactNode
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-surface border border-border rounded-xl p-6',
                'transition-all duration-200',
                hover && 'hover:border-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
