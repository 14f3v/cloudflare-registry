import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginModal } from './components/LoginModal'
import { UserMenu } from './components/UserMenu'
import { SettingsLayout } from './components/SettingsLayout'
import { CopyButton } from './components/CopyButton'
import './App.css'

interface Repository {
    name: string;
    tags: string[];
    is_public: boolean;
}

function AppContent() {
    const { isAuthenticated, isLoading, login } = useAuth()
    const [activeTab, setActiveTab] = useState<'overview' | 'browse' | 'settings'>('overview')
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (activeTab === 'browse') {
            loadRepositories()
        }
    }, [activeTab, isAuthenticated])

    useEffect(() => {
        if (searchQuery) {
            setFilteredRepos(
                repositories.filter(repo =>
                    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    repo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            )
        } else {
            setFilteredRepos(repositories)
        }
    }, [searchQuery, repositories])

    const loadRepositories = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/repositories')
            if (!res.ok) throw new Error('Failed to fetch repositories')
            const data = await res.json()
            setRepositories(data)
            setFilteredRepos(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load repositories')
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return <div className="loading-screen"><div className="spinner"></div></div>
    }

    return (
        <div className="app">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <span className="brand-icon">🐳</span>
                        <span className="brand-text">Container Registry</span>
                    </div>
                    <div className="navbar-tabs">
                        <button
                            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="tab-icon">🏠</span>
                            Overview
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'browse' ? 'active' : ''}`}
                            onClick={() => setActiveTab('browse')}
                        >
                            <span className="tab-icon">📦</span>
                            Browse Images
                        </button>
                        {isAuthenticated && (
                            <button
                                className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <span className="tab-icon">⚙️</span>
                                Settings
                            </button>
                        )}
                    </div>

                    <div className="navbar-auth">
                        {isAuthenticated ? (
                            <UserMenu onNavigate={(tab) => setActiveTab(tab as any)} />
                        ) : (
                            <button className="login-btn" onClick={login}>Sign In</button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="hero-card">
                            <h1 className="hero-title">OCI-Compatible Container Registry</h1>
                            <p className="hero-subtitle">
                                Powered by Cloudflare Workers • R2 Storage • Edge Computing
                            </p>
                            {!isAuthenticated && (
                                <div style={{ marginTop: '2rem' }}>
                                    <button className="login-btn" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }} onClick={login}>
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid-2">
                            <div className="info-card">
                                <div className="card-icon">⚡</div>
                                <h3>Lightning Fast</h3>
                                <p>Deployed on Cloudflare's global edge network for ultra-low latency</p>
                            </div>
                            <div className="info-card">
                                <div className="card-icon">🔒</div>
                                <h3>Secure & Private</h3>
                                <p>Role-based access control with OAuth integration for your team</p>
                            </div>
                            <div className="info-card">
                                <div className="card-icon">💰</div>
                                <h3>Cost Effective</h3>
                                <p>R2 storage with zero egress fees and generous free tier</p>
                            </div>
                            <div className="info-card">
                                <div className="card-icon">🌍</div>
                                <h3>Global CDN</h3>
                                <p>Distributed across 300+ cities worldwide for optimal performance</p>
                            </div>
                        </div>

                        <div className="quick-start-card">
                            <h2>Quick Start Guide</h2>
                            <div className="command-group">
                                <div className="command-item">
                                    <div className="command-label">1. Login to Registry</div>
                                    <div className="cmd-block">
                                        <code>docker login {window.location.host}</code>
                                        <CopyButton text={`docker login ${window.location.host}`} className="copy-btn-small" />
                                    </div>
                                    <p className="hint-text">Use your OAuth token as the password</p>
                                </div>
                                <div className="command-item">
                                    <div className="command-label">2. Tag your image</div>
                                    <div className="cmd-block">
                                        <code>docker tag myimage:latest {window.location.host}/myimage:latest</code>
                                        <CopyButton text={`docker tag myimage:latest ${window.location.host}/myimage:latest`} className="copy-btn-small" />
                                    </div>
                                </div>
                                <div className="command-item">
                                    <div className="command-label">3. Push to registry</div>
                                    <div className="cmd-block">
                                        <code>docker push {window.location.host}/myimage:latest</code>
                                        <CopyButton text={`docker push ${window.location.host}/myimage:latest`} className="copy-btn-small" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'browse' && (
                    <div className="browse-section">
                        <div className="browse-header">
                            <h1>Container Images</h1>
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search repositories or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {searchQuery && (
                                    <button className="clear-btn" onClick={() => setSearchQuery('')}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading repositories...</p>
                            </div>
                        )}

                        {error && (
                            <div className="error-state">
                                <div className="error-icon">⚠️</div>
                                <p>{error}</p>
                                {!isAuthenticated && (
                                    <button onClick={login} className="retry-button">
                                        Sign In to View
                                    </button>
                                )}
                                {isAuthenticated && (
                                    <button onClick={loadRepositories} className="retry-button">
                                        Retry
                                    </button>
                                )}
                            </div>
                        )}

                        {!loading && !error && filteredRepos.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>{searchQuery ? 'No matching repositories' : 'No repositories found'}</h3>
                                <p>{searchQuery ? 'Try a different search term' : 'Push your first image to get started!'}</p>
                            </div>
                        )}

                        {!loading && !error && filteredRepos.length > 0 && (
                            <div className="repos-grid">
                                {filteredRepos.map(repo => (
                                    <div key={repo.name} className="repo-card">
                                        <div className="repo-card-header">
                                            <div className="repo-name">
                                                <span className="repo-icon">📦</span>
                                                <span>{repo.name}</span>
                                                {repo.is_public && <span className="public-badge">Public</span>}
                                            </div>
                                            <span className="tag-count-badge">{repo.tags.length}</span>
                                        </div>
                                        <div className="repo-tags">
                                            {repo.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="repo-actions">
                                            <div className="pull-cmd">
                                                <code>docker pull {window.location.host}/{repo.name}:{repo.tags[0]}</code>
                                                <CopyButton
                                                    text={`docker pull ${window.location.host}/${repo.name}:${repo.tags[0]}`}
                                                    className="copy-btn-small"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && isAuthenticated && (
                    <SettingsLayout />
                )}
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <p>Built with <span className="heart">❤️</span> using Bun • Hono • React • Cloudflare Workers</p>
                </div>
            </footer>

            <LoginModal />
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App
