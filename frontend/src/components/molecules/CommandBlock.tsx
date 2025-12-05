import { CopyButton } from '../CopyButton'
import { cn } from '../../utils/cn'

interface CommandBlockProps {
    command: string
    className?: string
}

export function CommandBlock({ command, className }: CommandBlockProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between gap-3',
                'bg-black/30 backdrop-blur-sm border border-white/10',
                'rounded-xl px-4 py-3',
                'hover:bg-black/40 hover:border-white/20 transition-all',
                className
            )}
        >
            <code className="flex-1 text-white/90 font-mono text-sm truncate drop-shadow-sm">
                {command}
            </code>
            <CopyButton text={command} />
        </div>
    )
}
