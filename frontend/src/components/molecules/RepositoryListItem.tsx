import { Link } from 'react-router-dom'
import { CopyButton } from '../CopyButton'
import type { Repository } from '../../types'

interface RepositoryListItemProps {
    repository: Repository
    selected: boolean
    onToggleSelect: (name: string) => void
}

export function RepositoryListItem({ repository, selected, onToggleSelect }: RepositoryListItemProps) {
    const registryHost = window.location.host
    const latestTag = repository.tags.filter(t => !t.startsWith('sha256:'))[0] || repository.tags[0]
    const pullCommand = `docker pull ${registryHost}/${repository.name}:${latestTag}`

    return (
        <Link
            to={`/browse/${repository.name}`}
            className="group block"
        >
            <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all ${selected ? 'ring-2 ring-blue-500/50' : ''}`}>
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none"></div>

                <div className="relative grid grid-cols-12 gap-4 items-center">
                    {/* Checkbox - 1 col */}
                    <div className="col-span-1 flex items-center">
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                                e.stopPropagation()
                                onToggleSelect(repository.name)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-blue-600"
                        />
                    </div>

                    {/* Icon & Name - 3 cols */}
                    <div className="col-span-3 flex items-center gap-3">
                        <div className="text-2xl">📦</div>
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-white truncate">{repository.name}</h3>
                            <p className="text-xs text-white/50">Repository</p>
                        </div>
                    </div>

                    {/* Tags - 2 cols */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs rounded-full">
                                {repository.tags.length} {repository.tags.length === 1 ? 'tag' : 'tags'}
                            </span>
                        </div>
                    </div>

                    {/* Latest Tag - 2 cols */}
                    <div className="col-span-2">
                        <span
                            className="text-sm text-white/80 font-mono truncate block"
                            title={latestTag}
                        >
                            {latestTag.startsWith('sha256:') ? latestTag.substring(0, 15) + '...' : latestTag}
                        </span>
                    </div>

                    {/* Pull Command - 4 cols */}
                    <div className="col-span-4 flex items-center gap-2">
                        <code
                            className="flex-1 text-xs text-cyan-300 font-mono bg-black/20 px-3 py-2 rounded-lg truncate"
                            title={pullCommand}
                        >
                            {pullCommand}
                        </code>
                        <div onClick={(e) => e.preventDefault()}>
                            <CopyButton text={pullCommand} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
