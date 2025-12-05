import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CopyButton } from './CopyButton'

interface Token {
    id: string
    user_id: string
    name: string
    scopes: string[]
    last_used_at: number | null
    expires_at: number | null
    created_at: number
}

export function TokenManager() {
    const { isAuthenticated } = useAuth()
    const [tokens, setTokens] = useState<Token[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [generatedToken, setGeneratedToken] = useState<string | null>(null)

    const [tokenName, setTokenName] = useState('')
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['registry:read'])
    const [expiresIn, setExpiresIn] = useState<number | null>(null)

    useEffect(() => {
        if (isAuthenticated) loadTokens()
    }, [isAuthenticated])

    const loadTokens = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/tokens')
            if (!res.ok) throw new Error('Failed to fetch tokens')
            const data = await res.json()
            setTokens(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tokens')
        } finally {
            setLoading(false)
        }
    }

    const createToken = async () => {
        if (!tokenName) {
            setError('Token name is required')
            return
        }
        try {
            const res = await fetch('/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tokenName, scopes: selectedScopes, expiresIn })
            })
            if (!res.ok) throw new Error('Failed to create token')
            const data = await res.json()
            setGeneratedToken(data.token)
            setTokenName('')
            setSelectedScopes(['registry:read'])
            setExpiresIn(null)
            loadTokens()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create token')
        }
    }

    const revokeToken = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this token?')) return
        try {
            const res = await fetch(`/api/tokens/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to revoke token')
            loadTokens()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to revoke token')
        }
    }

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return 'Never'
        return new Date(timestamp).toLocaleDateString()
    }

    const toggleScope = (scope: string) => {
        setSelectedScopes(prev =>
            prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Error Toast */}
            {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-red-200">{error}</span>
                    <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                        🔑 Personal Access Tokens
                    </h1>
                    <p className="text-white/60 mt-1">
                        Manage tokens for Docker CLI and API access
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                    + Generate New Token
                </button>
            </div>

            {/* Tokens List */}
            {tokens.length === 0 ? (
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">🔑</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No tokens yet</h3>
                        <p className="text-white/60">Create a personal access token to authenticate with Docker CLI</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {tokens.map(token => (
                        <div key={token.id} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-3">{token.name}</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {token.scopes.map(scope => (
                                                <span key={scope} className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm rounded-full">
                                                    {scope}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 text-sm text-white/50">
                                            <span>Last used: {formatDate(token.last_used_at)}</span>
                                            {token.expires_at && <span>Expires: {formatDate(token.expires_at)}</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => revokeToken(token.id)}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg transition-all"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Token Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowCreateModal(false)}>
                    <div className="relative max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all">✕</button>

                            {generatedToken ? (
                                <div className="text-center">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Token Created!</h2>
                                    <p className="text-yellow-300 mb-6">⚠️ Copy this token now. It will never be shown again.</p>
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                                        <code className="flex-1 text-cyan-300 font-mono text-sm break-all">{generatedToken}</code>
                                        <CopyButton text={generatedToken} />
                                    </div>
                                    <button onClick={() => { setGeneratedToken(null); setShowCreateModal(false) }} className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl">
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white">Generate New Token</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Token Name</label>
                                        <input type="text" placeholder="e.g., CI Server, Laptop" value={tokenName} onChange={e => setTokenName(e.target.value)} className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Scopes</label>
                                        <div className="space-y-2">
                                            {['registry:read', 'registry:write', 'registry:admin'].map(scope => (
                                                <label key={scope} className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer">
                                                    <input type="checkbox" checked={selectedScopes.includes(scope)} onChange={() => toggleScope(scope)} className="w-4 h-4" />
                                                    <span className="text-white">{scope}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/60 mb-2">Expiration</label>
                                        <select value={expiresIn || ''} onChange={e => setExpiresIn(e.target.value ? Number(e.target.value) : null)} className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                            <option value="">No expiration</option>
                                            <option value={7 * 24 * 60 * 60 * 1000}>7 days</option>
                                            <option value={30 * 24 * 60 * 60 * 1000}>30 days</option>
                                            <option value={90 * 24 * 60 * 60 * 1000}>90 days</option>
                                            <option value={365 * 24 * 60 * 60 * 1000}>1 year</option>
                                        </select>
                                    </div>

                                    <button onClick={createToken} className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        Generate Token
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
