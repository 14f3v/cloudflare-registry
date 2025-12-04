import { Elysia, t } from 'elysia';
import { RegistryStorage } from './storage';
import { RegistryError, handleErrors } from './utils';
import { calculateDigest } from './digest';

// Define the environment type
type Env = {
    REGISTRY_BUCKET: any; // R2Bucket type isn't strictly checked at runtime here but injected
};

export const registry = (env: Env) => {
    const storage = new RegistryStorage(env.REGISTRY_BUCKET);

    return new Elysia({ prefix: '/v2' })
        .onError(({ code, error, set }) => {
            return handleErrors(error, set);
        })
        // 1. Base Check
        .get('/', ({ set }) => {
            set.headers['Docker-Distribution-Api-Version'] = 'registry/2.0';
            return {};
        })

        // 2. Blob Existence Check
        .head('/:name/blobs/:digest', async ({ params: { name, digest }, set }) => {
            const exists = await storage.hasBlob(name, digest);
            if (!exists) {
                set.status = 404;
                return;
            }
            const blob = await storage.getBlob(name, digest);
            if (blob) {
                set.headers['Content-Length'] = blob.size.toString();
                set.headers['Docker-Content-Digest'] = digest;
            }
            set.status = 200;
        })

        // 3. Pull Blob
        .get('/:name/blobs/:digest', async ({ params: { name, digest }, set }) => {
            const blob = await storage.getBlob(name, digest);
            if (!blob) {
                throw new RegistryError('BLOB_UNKNOWN', 'blob unknown to registry', 404);
            }
            set.headers['Content-Type'] = 'application/octet-stream';
            set.headers['Docker-Content-Digest'] = digest;
            set.headers['Content-Length'] = blob.size.toString();
            return blob.body;
        })

        // 4. Initiate Upload
        .post('/:name/blobs/uploads/', async ({ params: { name }, set, request }) => {
            const uuid = await storage.initUpload(name);
            set.status = 202;
            set.headers['Location'] = `/v2/${name}/blobs/uploads/${uuid}`;
            set.headers['Range'] = '0-0';
            set.headers['Docker-Upload-UUID'] = uuid;
            return;
        })

        // 5. Chunk Upload (PATCH)
        .patch('/:name/blobs/uploads/:uuid', async ({ params: { name, uuid }, body, request, set }) => {
            // In a real implementation, we'd handle Content-Range and appending.
            // For MVP, we assume the client might send chunks.
            // We'll just append to the file.

            // Note: Elysia body parsing might try to parse JSON/Text. 
            // We need raw body.
            // Using `request.arrayBuffer()` or similar if body isn't auto-parsed.

            // For now, let's assume body is the chunk.
            // We need to be careful about types here.

            await storage.appendUpload(name, uuid, body as any);

            set.status = 202;
            set.headers['Location'] = `/v2/${name}/blobs/uploads/${uuid}`;
            set.headers['Docker-Upload-UUID'] = uuid;
            // We should return the current range, e.g. 0-<end>
            return;
        })

        // 6. Complete Upload (PUT)
        .put('/:name/blobs/uploads/:uuid', async ({ params: { name, uuid }, query: { digest }, body, set }) => {
            if (!digest) {
                throw new RegistryError('DIGEST_INVALID', 'digest missing', 400);
            }

            // If body is present, it's the final chunk or the whole file
            if (body) {
                await storage.appendUpload(name, uuid, body as any);
            }

            await storage.completeUpload(name, uuid, digest as string);

            set.status = 201;
            set.headers['Location'] = `/v2/${name}/blobs/${digest}`;
            set.headers['Docker-Content-Digest'] = digest as string;
            return;
        })

        // 7. Push Manifest
        .put('/:name/manifests/:reference', async ({ params: { name, reference }, request, headers, set }) => {
            const contentType = headers['content-type'] || 'application/json';

            // Read raw body for digest calculation and storage
            const manifestStr = await request.text();

            if (!manifestStr) {
                throw new RegistryError('MANIFEST_INVALID', 'manifest missing', 400);
            }

            const digest = await calculateDigest(manifestStr);

            await storage.putManifest(name, reference, manifestStr, contentType);

            // Also store by digest if reference is a tag
            // But for now, we just rely on the reference path.
            // Ideally we should also store at .../manifests/<digest>
            // And update the tag to point to <digest>.

            set.status = 201;
            set.headers['Location'] = `/v2/${name}/manifests/${reference}`;
            set.headers['Docker-Content-Digest'] = digest;
            return;
        })

        // 8. Pull Manifest
        .get('/:name/manifests/:reference', async ({ params: { name, reference }, set }) => {
            const manifest = await storage.getManifest(name, reference);
            if (!manifest) {
                throw new RegistryError('MANIFEST_UNKNOWN', 'manifest unknown', 404);
            }

            // We need to calculate digest on the fly or store it.
            // For now, let's read the body to calculate digest (expensive but correct for MVP)
            // OR trust the metadata if we stored it.
            // Let's try to read it.

            // Wait, manifest.body is a ReadableStream. If we read it, we consume it.
            // We should tee it or just return it.
            // Ideally we stored the digest in metadata.

            set.headers['Content-Type'] = manifest.httpMetadata?.contentType || 'application/json';
            set.headers['Docker-Content-Digest'] = 'sha256:TODO'; // Should retrieve from metadata
            set.headers['Content-Length'] = manifest.size.toString();

            return manifest.body;
        })

        // 9. Check Manifest
        .head('/:name/manifests/:reference', async ({ params: { name, reference }, set }) => {
            const exists = await storage.hasManifest(name, reference);
            if (!exists) {
                set.status = 404;
                return;
            }
            const manifest = await storage.getManifest(name, reference);
            if (manifest) {
                set.headers['Content-Type'] = manifest.httpMetadata?.contentType || 'application/json';
                set.headers['Content-Length'] = manifest.size.toString();
                set.headers['Docker-Content-Digest'] = 'sha256:TODO';
            }
            set.status = 200;
        });
};
