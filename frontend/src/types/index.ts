export interface Repository {
    name: string
    tags: string[]
    is_public: boolean
}

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

export interface AuthContextType extends AuthState {
    login: () => void
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    showLoginModal: boolean
    setShowLoginModal: (show: boolean) => void
}

export interface GroupMember {
    id: string
    user_id: string
    email: string
    name: string
    full_name?: string
    avatar?: string
    avatar_url?: string
    role?: string
}

export interface Group {
    id: string
    name: string
    description?: string
    created_by: string
    members: GroupMember[]
}

export interface Token {
    id: string
    name: string
    scope: 'read' | 'write' | 'admin'
    created_at: string
    last_used?: string
}
