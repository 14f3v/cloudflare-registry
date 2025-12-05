import { CopyButton } from '../components/CopyButton'

export function OverviewPage() {
    return (
        <div className="overview-section">
            {/* Modern Hero Section */}
            <div className="hero-modern">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">✨</span>
                        <span>Serverless Docker Registry</span>
                    </div>

                    <h1 className="hero-main-title">
                        Production-Ready
                        <br />
                        <span className="gradient-text">Container Registry</span>
                    </h1>

                    <p className="hero-description">
                        Enterprise-grade Docker Registry v2 running on Cloudflare's global network.
                        <br />
                        Built for speed, security, and scale.
                    </p>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-icon">⚡</div>
                            <div className="stat-value">~50ms</div>
                            <div className="stat-label">Global Latency</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">🌍</div>
                            <div className="stat-value">300+</div>
                            <div className="stat-label">Edge Locations</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">🔒</div>
                            <div className="stat-value">100%</div>
                            <div className="stat-label">Secure by Default</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <span className="feature-icon">🔐</span>
                    </div>
                    <h3>OAuth Authentication</h3>
                    <p>Secure login with Google & GitHub. No passwords to manage.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <span className="feature-icon">👥</span>
                    </div>
                    <h3>Team Management</h3>
                    <p>Create teams, assign roles, and manage permissions effortlessly.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <span className="feature-icon">🎫</span>
                    </div>
                    <h3>Access Tokens</h3>
                    <p>Generate scoped tokens for CI/CD pipelines and automation.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <span className="feature-icon">⚡</span>
                    </div>
                    <h3>Edge Performance</h3>
                    <p>Distributed globally across Cloudflare's network for ultra-low latency.</p>
                </div>
            </div>

            {/* Quick Start Section */}
            <div className="quick-start-modern">
                <div className="section-header">
                    <h2>🚀 Get Started in Minutes</h2>
                    <p>Three simple steps to push your first container image</p>
                </div>

                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Login to Registry</h3>
                        <div className="cmd-block">
                            <code>docker login {window.location.host}</code>
                            <CopyButton text={`docker login ${window.location.host}`} className="copy-btn-small" />
                        </div>
                        <p className="step-hint">Use your Personal Access Token as password</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Tag Your Image</h3>
                        <div className="cmd-block">
                            <code>docker tag myapp:latest {window.location.host}/myapp:latest</code>
                            <CopyButton text={`docker tag myapp:latest ${window.location.host}/myapp:latest`} className="copy-btn-small" />
                        </div>
                        <p className="step-hint">Prefix with registry hostname</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Push to Registry</h3>
                        <div className="cmd-block">
                            <code>docker push {window.location.host}/myapp:latest</code>
                            <CopyButton text={`docker push ${window.location.host}/myapp:latest`} className="copy-btn-small" />
                        </div>
                        <p className="step-hint">Deploy from anywhere, instantly</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
