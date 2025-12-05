import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                // Base styles
                'inline-flex items-center justify-center rounded-lg font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',

                // Size variants
                {
                    'px-3 py-1.5 text-sm': size === 'sm',
                    'px-4 py-2 text-base': size === 'md',
                    'px-6 py-3 text-lg': size === 'lg',
                },

                // Color variants
                {
                    'bg-primary text-white hover:bg-primary-dark active:scale-95': variant === 'primary',
                    'bg-surface border border-border text-text hover:border-primary': variant === 'secondary',
                    'bg-transparent text-text hover:bg-surface': variant === 'ghost',
                    'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
                },

                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
