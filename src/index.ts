import { Hono } from 'hono';
import { createRegistry } from './registry';
import { RegistryStorage } from './storage';
import { R2Bucket, D1Database } from '@cloudflare/workers-types';
import { frontendHTML } from './frontend-html';
import { auth } from './auth/routes';
import { groups } from './api/groups';
import { permissions } from './api/permissions';
import { tokens } from './api/tokens';
import { dbMiddleware, authMiddleware } from './auth/middleware';

// Env interface for Cloudflare Workers
export interface Env {
    REGISTRY_BUCKET: R2Bucket;
    DB: D1Database;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    JWT_SECRET: string;
}

export default {
    fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const app = new Hono<{ Bindings: Env }>();

        // Apply database middleware globally
        app.use('*', dbMiddleware());

        // Frontend route (no auth required)
        app.get('/', (c) => c.html(frontendHTML));

        // API endpoint to list repositories (optional auth)
        app.get('/api/repositories', authMiddleware(false), async (c) => {
            try {
                // List repositories from R2 storage where images are actually stored
                const storage = new RegistryStorage(env.REGISTRY_BUCKET);
                const repos = await storage.listRepositories();
                return c.json(repos);
            } catch (err) {
                console.error('Error listing repositories:', err);
                return c.json({ error: 'Failed to list repositories' }, 500);
            }
        });

        // Mount auth routes
        app.route('/auth', auth);

        // Mount API routes (require auth)
        app.route('/api/groups', groups);
        app.route('/api/repositories', permissions);
        app.route('/api/tokens', tokens);

        // Middleware: Normalize trailing slashes to prevent routing issues
        // EXCEPT for /v2 API routes which require trailing slashes per Docker registry spec
        app.use('*', async (c, next) => {
            const url = new URL(c.req.url);
            const path = url.pathname;

            // Skip trailing slash normalization for /v2 routes (Docker registry API)
            if (path.startsWith('/v2')) {
                return await next();
            }

            // For frontend routes, strip trailing slashes (except root)
            if (path.length > 1 && path.endsWith('/')) {
                url.pathname = path.slice(0, -1);
                return c.redirect(url.toString(), 301);
            }

            await next();
        });

        // Mount registry routes (Docker API)
        const registry = createRegistry(env);
        app.route('/v2', registry);

        // Define known API/backend route prefixes
        const apiPrefixes = ['/api', '/auth', '/v2'];

        // SPA routing: Register explicit frontend routes
        const frontendRoutes = ['/', '/browse', '/settings'];

        frontendRoutes.forEach(route => {
            app.get(route, (c) => c.html(frontendHTML));
        });

        // Catch-all for SPA routes (must be last)
        app.get('*', (c) => {
            const path = new URL(c.req.url).pathname;

            // Don't serve SPA for API routes
            if (apiPrefixes.some(prefix => path.startsWith(prefix))) {
                return c.notFound();
            }

            // Don't serve SPA for files with extensions
            if (path.match(/\.[a-z0-9]+$/i)) {
                return c.notFound();
            }

            // Everything else is an SPA route
            return c.html(frontendHTML);
        });

        // Custom 404 handler
        app.notFound((c) => c.text('Not Found', 404));

        return app.fetch(request, env, ctx);
    }
};