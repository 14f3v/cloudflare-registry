import { useAuth } from '../context/AuthContext'
import { UserAvatar } from './UserAvatar'

export function UserProfile() {
    const { user, logout } = useAuth()

    if (!user) return null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                    👤 Profile
                </h1>
                <p className="text-white/60 mt-1">
                    Manage your account information
                </p>
            </div>

            {/* Glass Profile Card */}
            <div className="relative">
                {/* Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl opacity-30"></div>

                {/* Glass Card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-xl"></div>
                            <div className="relative">
                                <UserAvatar
                                    src={user.avatar}
                                    email={user.email}
                                    name={user.name}
                                    size="large"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                                {user.name || 'User'}
                            </h2>
                            <p className="text-white/60">{user.email}</p>
                        </div>
                    </div>

                    {/* Info Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">
                                Name
                            </label>
                            <div className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white">
                                {user.name || 'Not set'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">
                                Email
                            </label>
                            <div className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white">
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">
                                User ID
                            </label>
                            <div className="px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl">
                                <code className="text-sm text-cyan-300 font-mono">{user.id}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
                <button
                    onClick={logout}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 font-medium rounded-xl transition-all"
                >
                    🚪 Sign Out
                </button>
            </div>
        </div>
    )
}
