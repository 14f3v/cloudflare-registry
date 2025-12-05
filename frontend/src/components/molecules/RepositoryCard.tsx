import { CommandBlock } from '../molecules/CommandBlock'
import type { Repository } from '../../types'
import { cn } from '../../utils/cn'

interface RepositoryCardProps {
    repository: Repository
    className?: string
}

export function RepositoryCard({ repository, className }: RepositoryCardProps) {
    const registryHost = typeof window !== 'undefined' ? window.location.host : 'registry.example.com'
    const pullCommand = `docker pull ${registryHost}/${repository.name}:${repository.tags[0]}`

    return (
        <div className={cn('group relative', className)}>
            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"></div>

            {/* Glass Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl drop-shadow-lg">📦</span>
                        <span className="font-semibold text-white drop-shadow-sm">{repository.name}</span>
                        {repository.is_public && (
                            <span className="px-2 py-0.5 text-xs bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 rounded-full">
                                Public
                            </span>
                        )}
                    </div>
                    <span className="px-2 py-1 text-xs bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 rounded-lg">
                        {repository.tags.length}
                    </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {repository.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 rounded-md hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Pull Command */}
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
                    <code className="text-sm text-white/90 font-mono flex-1 truncate">{pullCommand}</code>
                    <CommandBlock command={pullCommand} />
                </div>
            </div>
        </div>
    )
}
