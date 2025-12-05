import { useState } from 'react'
import { useRepositories } from '../hooks/useRepositories'
import { useSearch } from '../hooks/useSearch'
import { SearchBox } from '../components/molecules/SearchBox'
import { RepositoryCard } from '../components/molecules/RepositoryCard'
import { useAuth } from '../context/AuthContext'

type TabType = 'owned' | 'examples'

export function BrowsePage() {
    const { isAuthenticated, login } = useAuth()
    const { repositories, loading, error, reload } = useRepositories()
    const { query, setQuery, filteredItems } = useSearch(repositories)
    const [activeTab, setActiveTab] = useState<TabType>('owned')

    const exampleRepos = [
        { icon: '🐧', name: 'alpine', desc: 'Lightweight Linux distribution', size: '7.8MB', command: 'docker pull docker.io/library/alpine:latest' },
        { icon: '🌊', name: 'nginx', desc: 'High-performance web server', size: '142MB', command: 'docker pull docker.io/library/nginx:latest' },
        { icon: '🐹', name: 'golang', desc: 'Go programming language', size: '814MB', command: 'docker pull docker.io/library/golang:latest' },
        { icon: '🐳', name: 'node', desc: 'JavaScript runtime environment', size: '123MB', command: 'docker pull docker.io/library/node:latest' },
        { icon: '🐍', name: 'python', desc: 'Python programming language', size: '917MB', command: 'docker pull docker.io/library/python:latest' },
        { icon: '☕', name: 'openjdk', desc: 'Java development kit', size: '471MB', command: 'docker pull docker.io/library/openjdk:latest' },
        { icon: '💎', name: 'ruby', desc: 'Ruby programming language', size: '892MB', command: 'docker pull docker.io/library/ruby:latest' },
        { icon: '🦀', name: 'rust', desc: 'Rust programming language', size: '1.2GB', command: 'docker pull docker.io/library/rust:latest' },
    ]

    // Loading state
    if (loading && activeTab === 'owned') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p className="text-white/60">Loading repositories...</p>
            </div>
        )
    }

    // Error state
    if (error && activeTab === 'owned') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-6xl drop-shadow-lg">⚠️</div>
                <p className="text-white text-lg">{error}</p>
                {!isAuthenticated ? (
                    <button onClick={login} className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                        Sign In to View
                    </button>
                ) : (
                    <button onClick={reload} className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all">
                        Retry
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-sm">📦 Container Images</h1>

                {/* Tabs */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('owned')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'owned'
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        📦 My Repositories ({repositories.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('examples')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'examples'
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        📚 Examples ({exampleRepos.length})
                    </button>
                </div>

                {/* Search - only show for owned repos with content */}
                {activeTab === 'owned' && repositories.length > 0 && (
                    <SearchBox
                        value={query}
                        onChange={setQuery}
                        placeholder="Search repositories or tags..."
                        className="max-w-2xl"
                    />
                )}
            </div>

            {/* Content */}
            {activeTab === 'owned' ? (
                // Owned Repositories Tab
                <>
                    {repositories.length === 0 ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-30"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                                <div className="text-7xl mb-4 drop-shadow-lg">📦</div>
                                <h3 className="text-2xl font-semibold text-white mb-2">No repositories yet</h3>
                                <p className="text-white/60 max-w-md mx-auto mb-6">
                                    Push your first container image to get started
                                </p>
                                <button
                                    onClick={() => setActiveTab('examples')}
                                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    View Examples →
                                </button>
                            </div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
                            <div className="relative flex flex-col items-center justify-center min-h-[300px] gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                                <div className="text-6xl drop-shadow-lg">📭</div>
                                <h3 className="text-2xl font-semibold text-white">No matching repositories</h3>
                                <p className="text-white/60">Try a different search term</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map(repo => (
                                <RepositoryCard key={repo.name} repository={repo} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                // Examples Tab
                <div className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-20"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">🐳 Popular Docker Images</h3>
                            <p className="text-white/60 mb-6">
                                Official images from Docker Hub that you can pull and use
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {exampleRepos.map(example => (
                                    <div key={example.name} className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 hover:border-white/20 transition-all">
                                            <div className="text-5xl mb-3 drop-shadow-lg">{example.icon}</div>
                                            <h5 className="font-semibold text-white mb-1 text-lg">{example.name}</h5>
                                            <p className="text-sm text-white/60 mb-3 min-h-[40px]">{example.desc}</p>
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <span className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full">
                                                    latest
                                                </span>
                                                <span className="text-xs text-white/50">{example.size}</span>
                                            </div>
                                            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-left">
                                                <code className="text-xs text-cyan-300 font-mono break-all">
                                                    {example.command}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 blur-3xl opacity-20"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">💡 How to use these images</h3>
                            <ol className="space-y-2 text-white/70">
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">1.</span>
                                    <span>Copy the docker pull command from any card above</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">2.</span>
                                    <span>Run it in your terminal to download the image</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary font-bold">3.</span>
                                    <span>Use <code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300 font-mono text-sm">docker run [image-name]</code> to start a container</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
