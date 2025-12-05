import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserAvatar } from './UserAvatar'

export function UserMenu() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const handleNavigate = (path: string) => {
        navigate(path)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button - Glass Style */}
            <button
                className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <UserAvatar
                    src={user.avatar}
                    email={user.email}
                    name={user.name}
                    size="small"
                />
                <span className="text-sm font-medium text-white hidden md:inline">
                    {user.name || user.email.split('@')[0]}
                </span>
                <span className="text-xs text-white/50">
                    {isOpen ? '▲' : '▼'}
                </span>
            </button>

            {/* Dropdown Menu - Glass */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72">
                    {/* Gradient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl opacity-50"></div>

                    {/* Glass Dropdown */}
                    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                        {/* User Info Header - Glass Panel */}
                        <div className="px-5 py-4 bg-gradient-to-r from-white/20 to-white/10 border-b border-white/20">
                            <p className="font-semibold text-white truncate drop-shadow-sm">
                                {user.name}
                            </p>
                            <p className="text-sm text-white/60 truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all text-left"
                                onClick={() => handleNavigate('/browse')}
                            >
                                <span className="text-xl">📦</span>
                                <span className="font-medium">My Repositories</span>
                            </button>

                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all text-left"
                                onClick={() => handleNavigate('/settings')}
                            >
                                <span className="text-xl">⚙️</span>
                                <span className="font-medium">Settings</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 mx-2"></div>

                        {/* Logout */}
                        <div className="p-2">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all text-left"
                                onClick={() => logout()}
                            >
                                <span className="text-xl">🚪</span>
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
