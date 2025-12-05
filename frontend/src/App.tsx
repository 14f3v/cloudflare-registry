import { Routes, Route, NavLink } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { LoginModal } from './components/LoginModal'
import { UserMenu } from './components/UserMenu'
import { SettingsLayout } from './components/SettingsLayout'
import { OverviewPage } from './pages/OverviewPage'
import { BrowsePage } from './pages/BrowsePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
    const { isAuthenticated, isLoading, login } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🐳</span>
                            <span className="text-xl font-bold text-slate-100">Container Registry</span>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                    }`
                                }
                                end
                            >
                                <span>🏠</span>
                                Overview
                            </NavLink>
                            <NavLink
                                to="/browse"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                    }`
                                }
                            >
                                <span>📦</span>
                                Browse Images
                            </NavLink>
                            {isAuthenticated && (
                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    <span>⚙️</span>
                                    Settings
                                </NavLink>
                            )}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/phimasonelabs/cloudflare-registry"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-100 transition-colors"
                                title="Star on GitHub"
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                                <span>Star</span>
                            </a>

                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    onClick={login}
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
                <Routes>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/browse" element={<BrowsePage />} />
                    <Route path="/settings/*" element={<SettingsLayout />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <LoginModal />
        </div>
    )
}

export default App
