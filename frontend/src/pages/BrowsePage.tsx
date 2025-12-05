import { useState, useEffect } from 'react'
import { RepositoryListItem } from '../components/molecules/RepositoryListItem'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import type { Repository } from '../types'

export function BrowsePage() {
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const loadRepositories = () => {
        setLoading(true)
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
    }

    useEffect(() => {
        loadRepositories()
    }, [])

    const toggleSelect = (name: string) => {
        const newSelected = new Set(selected)
        if (newSelected.has(name)) {
            newSelected.delete(name)
        } else {
            newSelected.add(name)
        }
        setSelected(newSelected)
    }

    const toggleSelectAll = () => {
        if (selected.size === repositories.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(repositories.map(r => r.name)))
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const response = await fetch('/api/repositories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repositories: Array.from(selected) })
            })

            if (response.ok) {
                setSelected(new Set())
                setShowDeleteModal(false)
                loadRepositories()
            } else {
                alert('Failed to delete repositories')
            }
        } catch (err) {
            console.error('Delete failed:', err)
            alert('Failed to delete repositories')
        } finally {
            setDeleting(false)
        }
    }

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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Browse Repositories
                        </h1>
                        <p className="text-white/60">
                            View all container images in your registry
                        </p>
                    </div>

                    {/* Delete Button */}
                    {selected.size > 0 && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deleting}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete {selected.size} {selected.size === 1 ? 'repository' : 'repositories'}
                        </button>
                    )}
                </div>

                {/* Table Header */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-2">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/70">
                        <div className="col-span-1 flex items-center">
                            <input
                                type="checkbox"
                                checked={repositories.length > 0 && selected.size === repositories.length}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-blue-600"
                            />
                        </div>
                        <div className="col-span-3">Repository</div>
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
                            <RepositoryListItem
                                key={repo.name}
                                repository={repo}
                                selected={selected.has(repo.name)}
                                onToggleSelect={toggleSelect}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                repositories={Array.from(selected)}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    )
}
