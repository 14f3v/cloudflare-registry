import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CopyButton } from '../components/CopyButton'

interface Artifact {
    tag: string
    digest: string
    size?: number
    pushed?: string
}

export function RepositoryDetailPage() {
    const { repository } = useParams<{ repository: string }>()
    const [artifacts, setArtifacts] = useState<Artifact[]>([])
    const [loading, setLoading] = useState(true)
    const registryHost = window.location.host

    useEffect(() => {
        if (!repository) return

        fetch(`/api/repositories/${repository}`)
            .then(res => res.json())
            .then(data => {
                setArtifacts(data.artifacts || [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch repository details:', err)
                setLoading(false)
            })
    }, [repository])

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative container mx-auto px-6 max-w-7xl pt-20 pb-12">
                {/* Header with back button */}
                <div className="mb-8">
                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to repositories
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="text-5xl">📦</div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{repository}</h1>
                            <p className="text-white/60 mt-1">
                                {artifacts.length} {artifacts.length === 1 ? 'artifact' : 'artifacts'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Artifacts Table */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/80"></div>
                        <p className="text-white/60 mt-4">Loading artifacts...</p>
                    </div>
                ) : artifacts.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">🏷️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No artifacts found</h3>
                        <p className="text-white/60">This repository has no tags</p>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-white/5 border-b border-white/10 p-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/70">
                                <div className="col-span-3">Tag</div>
                                <div className="col-span-5">Digest</div>
                                <div className="col-span-4">Pull Command</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-white/5">
                            {artifacts.map(artifact => {
                                const pullCommand = `docker pull ${registryHost}/${repository}:${artifact.tag}`
                                const isDigest = artifact.tag.startsWith('sha256:')

                                return (
                                    <div key={artifact.tag} className="p-4 hover:bg-white/5 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Tag */}
                                            <div className="col-span-3">
                                                {isDigest ? (
                                                    <span
                                                        className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs rounded-full font-mono inline-block truncate max-w-full"
                                                        title={artifact.tag}
                                                    >
                                                        {artifact.tag.substring(0, 15)}...
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm rounded-full inline-block">
                                                        {artifact.tag}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Digest */}
                                            <div className="col-span-5">
                                                <code
                                                    className="text-xs text-white/70 font-mono truncate block"
                                                    title={artifact.digest}
                                                >
                                                    {artifact.digest}
                                                </code>
                                            </div>

                                            {/* Pull Command */}
                                            <div className="col-span-4 flex items-center gap-2">
                                                <code className="flex-1 text-xs text-cyan-300 font-mono bg-black/20 px-3 py-2 rounded-lg truncate">
                                                    {pullCommand}
                                                </code>
                                                <CopyButton text={pullCommand} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
