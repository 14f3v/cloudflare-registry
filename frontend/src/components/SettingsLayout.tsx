import { useState } from 'react'
import { UserProfile } from './UserProfile'
import { TokenManager } from './TokenManager'
import { GroupManager } from './GroupManager'

type SettingsSection = 'profile' | 'tokens' | 'teams'

export function SettingsLayout() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

    return (
        <div className="flex gap-8 max-w-7xl mx-auto">
            {/* Glass Sidebar */}
            <div className="w-64 flex-shrink-0">
                <div className="sticky top-24">
                    {/* Gradient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-30"></div>

                    {/* Glass Panel */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">
                            ⚙️ Settings
                        </h2>

                        <nav className="flex flex-col gap-2">
                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === 'profile'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setActiveSection('profile')}
                            >
                                <span className="text-xl">👤</span>
                                <span className="font-medium">Profile</span>
                            </button>

                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === 'tokens'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setActiveSection('tokens')}
                            >
                                <span className="text-xl">🔑</span>
                                <span className="font-medium">Access Tokens</span>
                            </button>

                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === 'teams'
                                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setActiveSection('teams')}
                            >
                                <span className="text-xl">👥</span>
                                <span className="font-medium">Teams</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                {activeSection === 'profile' && <UserProfile />}
                {activeSection === 'tokens' && <TokenManager />}
                {activeSection === 'teams' && <GroupManager />}
            </div>
        </div>
    )
}
