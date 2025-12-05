import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthState } from '../types'

interface AuthContextType extends AuthState {
    login: () => void; // Triggers modal
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    })
    const [showLoginModal, setShowLoginModal] = useState(false)

    const checkAuth = async () => {
        try {
            const res = await fetch('/auth/me')
            if (res.ok) {
                const data = await res.json()
                if (data.authenticated) {
                    setState({
                        user: data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                    return
                }
            }
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        } catch (error) {
            console.error('Auth check failed:', error)
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    }

    const logout = async () => {
        try {
            await fetch('/auth/logout', { method: 'POST' })
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
            // Redirect to home page after logout
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login: () => setShowLoginModal(true),
                logout,
                checkAuth,
                showLoginModal,
                setShowLoginModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
