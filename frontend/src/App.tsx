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

                    <div className="navbar-actions">
                        <a
                            href="https://github.com/phimasonelabs/cloudflare-registry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                            title="Star on GitHub"
                        >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            <span>Star on GitHub</span>
                        </a>
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

                        {!loading && filteredRepos.length === 0 && !error && (
                            <div className="empty-state">
                                <div className="empty-icon">📦</div>
                                <h3>No repositories yet</h3>
                                <p>Push your first container image to get started</p>

                                {/* Demo repositories section */}
                                <div className="demo-section">
                                    <h4>📚 Example Repositories</h4>
                                    <p className="demo-hint">Here are some popular images you can try:</p>
                                    <div className="demo-repos">
                                        <div className="demo-repo-card">
                                            <div className="demo-repo-icon">🐧</div>
                                            <h5>alpine</h5>
                                            <p>Lightweight Linux distribution</p>
                                            <div className="demo-tag">latest • 7.8MB</div>
                                        </div>
                                        <div className="demo-repo-card">
                                            <div className="demo-repo-icon">🌊</div>
                                            <h5>nginx</h5>
                                            <p>High-performance web server</p>
                                            <div className="demo-tag">latest • 142MB</div>
                                        </div>
                                        <div className="demo-repo-card">
                                            <div className="demo-repo-icon">🐹</div>
                                            <h5>golang</h5>
                                            <p>Go programming language</p>
                                            <div className="demo-tag">latest • 814MB</div>
                                        </div>
                                        <div className="demo-repo-card">
                                            <div className="demo-repo-icon">🐳</div>
                                            <h5>node</h5>
                                            <p>JavaScript runtime environment</p>
                                            <div className="demo-tag">lts-alpine • 123MB</div>
                                        </div>
                                    </div>
                                    <div className="demo-actions">
                                        <code className="demo-command">docker pull {window.location.host}/alpine:latest</code>
                                    </div>
                                </div>
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
