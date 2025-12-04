import { describe, expect, it } from 'bun:test';
import { registry } from '../src/registry';
import { MockR2Bucket } from './mocks';

describe('Registry API', () => {
    const mockBucket = new MockR2Bucket() as any;
    const app = registry({ REGISTRY_BUCKET: mockBucket });

    it('should return 200 for base endpoint', async () => {
        const response = await app.handle(new Request('http://localhost/v2/'));
        expect(response.status).toBe(200);
        expect(response.headers.get('Docker-Distribution-Api-Version')).toBe('registry/2.0');
    });

    it('should handle blob upload flow', async () => {
        // 1. Init Upload
        const initRes = await app.handle(new Request('http://localhost/v2/test/blobs/uploads/', {
            method: 'POST'
        }));
        expect(initRes.status).toBe(202);
        const uuid = initRes.headers.get('Docker-Upload-UUID');
        expect(uuid).toBeTruthy();

        // 2. Upload Chunk (PATCH)
        const patchRes = await app.handle(new Request(`http://localhost/v2/test/blobs/uploads/${uuid}`, {
            method: 'PATCH',
            body: 'test-content'
        }));
        expect(patchRes.status).toBe(202);

        // 3. Complete Upload (PUT)
        const digest = 'sha256:testdigest';
        const putRes = await app.handle(new Request(`http://localhost/v2/test/blobs/uploads/${uuid}?digest=${digest}`, {
            method: 'PUT'
        }));
        expect(putRes.status).toBe(201);
        expect(putRes.headers.get('Docker-Content-Digest')).toBe(digest);

        // 4. Check Blob
        const headRes = await app.handle(new Request(`http://localhost/v2/test/blobs/${digest}`, {
            method: 'HEAD'
        }));
        expect(headRes.status).toBe(200);
    });

    it('should handle manifest push and pull', async () => {
        const manifest = {
            schemaVersion: 2,
            mediaType: "application/vnd.docker.distribution.manifest.v2+json",
            config: {
                mediaType: "application/vnd.docker.container.image.v1+json",
                size: 7023,
                digest: "sha256:configdigest"
            },
            layers: []
        };

        const ref = 'latest';

        // Push
        const pushRes = await app.handle(new Request(`http://localhost/v2/test/manifests/${ref}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/vnd.docker.distribution.manifest.v2+json' },
            body: JSON.stringify(manifest)
        }));
        expect(pushRes.status).toBe(201);
        const digest = pushRes.headers.get('Docker-Content-Digest');
        expect(digest).toBeTruthy();

        // Pull
        const pullRes = await app.handle(new Request(`http://localhost/v2/test/manifests/${ref}`));
        expect(pullRes.status).toBe(200);
        const body = await pullRes.json();
        expect(body).toEqual(manifest);
    });
});
