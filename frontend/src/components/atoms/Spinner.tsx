import { cn } from '../../utils/cn'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-surface border-t-primary',
                {
                    'w-4 h-4': size === 'sm',
                    'w-8 h-8': size === 'md',
                    'w-12 h-12': size === 'lg',
                },
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}
