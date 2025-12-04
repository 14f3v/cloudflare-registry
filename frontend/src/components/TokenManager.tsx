import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CopyButton } from './CopyButton';

interface Token {
    id: string;
    user_id: string;
    name: string;
    scopes: string[];
    last_used_at: number | null;
    expires_at: number | null;
    created_at: number;
}

export function TokenManager() {
    const { isAuthenticated } = useAuth();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);

    // Form state
    const [tokenName, setTokenName] = useState('');
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['registry:read']);
    const [expiresIn, setExpiresIn] = useState<number | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadTokens();
        }
    }, [isAuthenticated]);

    const loadTokens = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/tokens');
            if (!res.ok) throw new Error('Failed to fetch tokens');
            const data = await res.json();
            setTokens(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tokens');
        } finally {
            setLoading(false);
        }
    };

    const createToken = async () => {
        if (!tokenName) {
            setError('Token name is required');
            return;
        }

        try {
            const res = await fetch('/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: tokenName,
                    scopes: selectedScopes,
                    expiresIn: expiresIn
                })
            });

            if (!res.ok) throw new Error('Failed to create token');
            const data = await res.json();

            setGeneratedToken(data.token);
            setTokenName('');
            setSelectedScopes(['registry:read']);
            setExpiresIn(null);
            loadTokens();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create token');
        }
    };

    const revokeToken = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this token?')) return;

        try {
            const res = await fetch(`/api/tokens/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to revoke token');
            loadTokens();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to revoke token');
        }
    };

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleDateString();
    };

    const toggleScope = (scope: string) => {
        setSelectedScopes(prev =>
            prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
        );
    };

    if (loading) return <div className="loading-state">Loading tokens...</div>;

    return (
        <div className="token-manager">
            {error && (
                <div className="error-toast" onClick={() => setError(null)}>
                    {error}
                    <span className="close-toast">×</span>
                </div>
            )}

            <div className="token-header">
                <div>
                    <h1>Personal Access Tokens</h1>
                    <p className="subtitle">Manage tokens for Docker CLI and API access</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    Generate New Token
                </button>
            </div>

            {tokens.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔑</div>
                    <h3>No tokens yet</h3>
                    <p>Create a personal access token to authenticate with Docker CLI</p>
                </div>
            ) : (
                <div className="tokens-list">
                    {tokens.map(token => (
                        <div key={token.id} className="token-card">
                            <div className="token-info">
                                <h3>{token.name}</h3>
                                <div className="token-meta">
                                    <div className="scopes">
                                        {token.scopes.map(scope => (
                                            <span key={scope} className="scope-badge">{scope}</span>
                                        ))}
                                    </div>
                                    <div className="token-dates">
                                        <span>Last used: {formatDate(token.last_used_at)}</span>
                                        {token.expires_at && (
                                            <span>Expires: {formatDate(token.expires_at)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn-danger-small"
                                onClick={() => revokeToken(token.id)}
                            >
                                Revoke
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Token Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>

                        {generatedToken ? (
                            <div className="token-generated">
                                <h2>Token Created!</h2>
                                <p className="warning-text">⚠️ Copy this token now. It will never be shown again.</p>
                                <div className="token-display">
                                    <code>{generatedToken}</code>
                                    <CopyButton text={generatedToken} />
                                </div>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setGeneratedToken(null);
                                        setShowCreateModal(false);
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div className="token-form">
                                <h2>Generate New Token</h2>

                                <div className="form-group">
                                    <label>Token Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., CI Server, Laptop"
                                        value={tokenName}
                                        onChange={e => setTokenName(e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Scopes</label>
                                    <div className="scope-checkboxes">
                                        {['registry:read', 'registry:write', 'registry:admin'].map(scope => (
                                            <label key={scope} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedScopes.includes(scope)}
                                                    onChange={() => toggleScope(scope)}
                                                />
                                                <span>{scope}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Expiration</label>
                                    <select
                                        value={expiresIn || ''}
                                        onChange={e => setExpiresIn(e.target.value ? Number(e.target.value) : null)}
                                        className="form-select"
                                    >
                                        <option value="">No expiration</option>
                                        <option value={7 * 24 * 60 * 60 * 1000}>7 days</option>
                                        <option value={30 * 24 * 60 * 60 * 1000}>30 days</option>
                                        <option value={90 * 24 * 60 * 60 * 1000}>90 days</option>
                                        <option value={365 * 24 * 60 * 60 * 1000}>1 year</option>
                                    </select>
                                </div>

                                <button className="btn-primary" onClick={createToken}>
                                    Generate Token
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
