import { Hono } from 'hono';
import { RegistryStorage } from './storage';
import { RegistryError, formatError } from './utils';
import { calculateDigest } from './digest';
import { authMiddleware, dbMiddleware, requirePermission } from './auth/middleware';
import { JWT } from './auth/jwt';
import { Env } from './types';

export const createRegistry = (env: Env) => {
    const storage = new RegistryStorage(env.REGISTRY_BUCKET);

    const app = new Hono<{ Bindings: Env }>();

    // Apply database middleware
    app.use('*', dbMiddleware());

    // Error handler
    app.onError((err, c) => {
        if (err instanceof RegistryError) {
            return c.json(formatError(err.code, err.message, err.detail), err.status as any);
        }
        console.error(err);
        return c.json(formatError('INTERNAL_ERROR', 'Internal Server Error'), 500);
    });

    // 1. Base Check - validates credentials if provided
    app.get('/v2/', async (c) => {
        c.header('Docker-Distribution-Api-Version', 'registry/2.0');

        // If Authorization header is present, validate it
        const authHeader = c.req.header('authorization');
        if (authHeader) {
            const db = c.get('db');
            const jwt = new JWT(c.env.JWT_SECRET);

            let token: string | null = null;

            // Extract token from Bearer or Basic auth
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            } else if (authHeader.startsWith('Basic ')) {
                const base64 = authHeader.substring(6);
                const decoded = atob(base64);
                const [_, password] = decoded.split(':', 2);
                token = password;
            }

            if (token) {
                // Check if it's a PAT
                if (token.startsWith('cfr_')) {
                    const patValidation = await db.validatePAT(token);
                    if (!patValidation) {
                        c.header('WWW-Authenticate', 'Basic realm="Docker Registry"');
                        return c.json({ error: 'Invalid or expired token' }, 401);
                    }
                } else {
                    // Validate as JWT session token
                    const payload = await jwt.verify(token);
                    if (!payload) {
                        c.header('WWW-Authenticate', 'Basic realm="Docker Registry"');
                        return c.json({ error: 'Invalid or expired token' }, 401);
                    }
                }
            }
        }

        return c.json({});
    });

    // 2. Blob Existence Check (requires read permission)
    app.on('HEAD', '/v2/:name/blobs/:digest', authMiddleware(true), requirePermission('read'), async (c) => {
        const { name, digest } = c.req.param();
        const exists = await storage.hasBlob(name, digest);
        if (!exists) {
            c.status(404);
            return c.body(null);
        }
        const blob = await storage.getBlob(name, digest);
        if (blob) {
            c.header('Content-Length', blob.size.toString());
            c.header('Docker-Content-Digest', digest);
        }
        c.status(200);
        return c.body(null);
    });

    // 3. Pull Blob (requires read permission)
    app.get('/v2/:name/blobs/:digest', authMiddleware(true), requirePermission('read'), async (c) => {
        const { name, digest } = c.req.param();
        const blob = await storage.getBlob(name, digest);
        if (!blob) {
            const error = new RegistryError('BLOB_UNKNOWN', `Blob ${digest} not found`, 404);
            return c.json(formatError(error.code, error.message), 404);
        }
        c.header('Content-Type', 'application/octet-stream');
        c.header('Docker-Content-Digest', digest);
        c.header('Content-Length', blob.size.toString());
        return c.body(blob.body as any);
    });

    // 4. Initiate Upload (requires write permission)
    app.post('/v2/:name/blobs/uploads/', /* authMiddleware(true), requirePermission('write'), */ async (c) => {
        const { name } = c.req.param();
        const uuid = await storage.initUpload(name);
        c.status(202);
        c.header('Location', `/v2/${name}/blobs/uploads/${uuid}`);
        c.header('Range', '0-0');
        c.header('Docker-Upload-UUID', uuid);
        return c.body(null);
    });

    // 5. Chunk Upload (PATCH)
    app.patch('/v2/:name/blobs/uploads/:uuid', async (c) => {
        const { name, uuid } = c.req.param();
        const body = await c.req.arrayBuffer();

        await storage.appendUpload(name, uuid, body);

        c.status(202);
        c.header('Location', `/v2/${name}/blobs/uploads/${uuid}`);
        c.header('Docker-Upload-UUID', uuid);
        return c.body(null);
    });

    // 6. Complete Upload (PUT)
    app.put('/v2/:name/blobs/uploads/:uuid', async (c) => {
        const { name, uuid } = c.req.param();
        const digest = c.req.query('digest');

        if (!digest) {
            throw new RegistryError('DIGEST_INVALID', 'digest missing', 400);
        }

        // If body is present, it's the final chunk or the whole file
        const contentLength = c.req.header('content-length');
        if (contentLength && parseInt(contentLength) > 0) {
            const body = await c.req.arrayBuffer();
            await storage.appendUpload(name, uuid, body);
        }

        await storage.completeUpload(name, uuid, digest);

        c.status(201);
        c.header('Location', `/v2/${name}/blobs/${digest}`);
        c.header('Docker-Content-Digest', digest);
        return c.body(null);
    });

    // 7. Push Manifest
    app.put('/v2/:name/manifests/:reference', async (c) => {
        const { name, reference } = c.req.param();
        const contentType = c.req.header('content-type') || 'application/json';

        const manifestStr = await c.req.text();

        if (!manifestStr) {
            throw new RegistryError('MANIFEST_INVALID', 'manifest missing', 400);
        }

        const digest = await calculateDigest(manifestStr);

        await storage.putManifest(name, reference, manifestStr, contentType);

        c.status(201);
        c.header('Location', `/v2/${name}/manifests/${reference}`);
        c.header('Docker-Content-Digest', digest);
        return c.body(null);
    });

    // 8. Pull Manifest (handles both GET and HEAD)
    app.get('/v2/:name/manifests/:reference', async (c) => {
        try {
            const { name, reference } = c.req.param();
            const isHead = c.req.method === 'HEAD';
            console.log(`[${c.req.method} /v2/:name/manifests/:reference] Checking manifest:`, name, reference);

            const manifest = await storage.getManifest(name, reference);

            if (!manifest) {
                throw new RegistryError('MANIFEST_UNKNOWN', 'manifest unknown', 404);
            }

            console.log(`[${c.req.method} /v2/:name/manifests/:reference] Got manifest, size:`, manifest.size);

            c.header('Content-Type', manifest.httpMetadata?.contentType || 'application/json');
            c.header('Docker-Content-Digest', 'sha256:TODO');
            c.header('Content-Length', manifest.size.toString());

            if (isHead) {
                // For HEAD, return empty body
                return c.body(null);
            } else {
                // For GET, return the manifest body
                return c.body(manifest.body as any);
            }
        } catch (err) {
            console.error(`[${c.req.method} /v2/:name/manifests/:reference] Error:`, err);
            throw err;
        }
    });

    return app;
};
