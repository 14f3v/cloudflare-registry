import { type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

export function Input({ className, error, ...props }: InputProps) {
    return (
        <div className="w-full">
            <input
                className={cn(
                    'w-full px-4 py-2 rounded-lg',
                    'bg-surface border text-text',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors',
                    error ? 'border-red-500' : 'border-border',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
