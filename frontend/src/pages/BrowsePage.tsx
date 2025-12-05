import { useState, useEffect } from 'react'
import { RepositoryListItem } from '../components/molecules/RepositoryListItem'
import type { Repository } from '../types'

export function BrowsePage() {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/repositories')
            .then(res => res.json())
            .then(data => {
                setRepositories(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch repositories:', err)
                setLoading(false)
            })
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative container mx-auto px-6 max-w-7xl pt-20 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Browse Repositories
                    </h1>
                    <p className="text-white/60">
                        View all container images in your registry
                    </p>
                </div>

                {/* Table Header */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-2">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/70">
                        <div className="col-span-4">Repository</div>
                        <div className="col-span-2">Tags</div>
                        <div className="col-span-2">Latest</div>
                        <div className="col-span-4">Pull Command</div>
                    </div>
                </div>

                {/* Repository List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/80"></div>
                        <p className="text-white/60 mt-4">Loading repositories...</p>
                    </div>
                ) : repositories.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No repositories yet</h3>
                        <p className="text-white/60">Push your first image to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {repositories.map(repo => (
                            <RepositoryListItem key={repo.name} repository={repo} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
