import { R2Bucket } from '@cloudflare/workers-types';

export class RegistryStorage {
    constructor(private bucket: R2Bucket) { }

    // Blobs are stored as blobs/<digest> to be shared across repositories (deduplication)
    // Or repositories/<name>/blobs/<digest> if we want isolation.
    // OCI spec allows cross-repo mounting, so shared storage is often better for space.
    // However, for simplicity and R2 structure, let's use:
    // v2/<name>/blobs/<digest>
    // v2/<name>/manifests/<reference>
    // v2/<name>/tags/<tag> -> points to digest

    private getBlobPath(name: string, digest: string) {
        return `v2/${name}/blobs/${digest}`;
    }

    private getManifestPath(name: string, reference: string) {
        return `v2/${name}/manifests/${reference}`;
    }

    private getUploadPath(name: string, uuid: string) {
        return `v2/${name}/_uploads/${uuid}`;
    }

    async hasBlob(name: string, digest: string): Promise<boolean> {
        const obj = await this.bucket.head(this.getBlobPath(name, digest));
        return obj !== null;
    }

    async getBlob(name: string, digest: string) {
        return this.bucket.get(this.getBlobPath(name, digest));
    }

    async putBlob(name: string, digest: string, stream: ReadableStream | ArrayBuffer, length?: number) {
        await this.bucket.put(this.getBlobPath(name, digest), stream as any, {
            httpMetadata: { contentType: 'application/octet-stream' },
            customMetadata: { size: length ? length.toString() : '' }
        });
    }

    async hasManifest(name: string, reference: string): Promise<boolean> {
        const obj = await this.bucket.head(this.getManifestPath(name, reference));
        return obj !== null;
    }

    async getManifest(name: string, reference: string) {
        return this.bucket.get(this.getManifestPath(name, reference));
    }

    async putManifest(name: string, reference: string, manifest: string | Uint8Array, contentType: string) {
        await this.bucket.put(this.getManifestPath(name, reference), manifest, {
            httpMetadata: { contentType }
        });
    }

    // Upload Session Management
    async initUpload(name: string): Promise<string> {
        const uuid = crypto.randomUUID();
        // Create a marker file or just return the UUID. 
        // For multipart/chunked uploads, we might need to store state.
        // For now, we'll assume monolithic uploads or simple state.
        await this.bucket.put(this.getUploadPath(name, uuid), '', {
            customMetadata: { startedAt: Date.now().toString() }
        });
        return uuid;
    }

    async appendUpload(name: string, uuid: string, chunk: ReadableStream | ArrayBuffer) {
        // R2 doesn't support append natively easily without multipart.
        // For a simple implementation, we might have to rely on the client sending the full body in PUT (monolithic)
        // or implement a more complex multipart strategy.
        // Docker push often does a PATCH then PUT.
        // PATCH sends a chunk.

        // WARNING: This is a naive implementation that overwrites. 
        // Real chunked upload needs to read existing + append new, which is expensive on R2,
        // OR use R2 Multipart Upload API.

        // For this MVP, let's assume we store chunks as parts?
        // Or just support monolithic PUT for now?
        // Let's try to support storing the chunk as a temp file.

        await this.bucket.put(this.getUploadPath(name, uuid), chunk as any);
    }

    async completeUpload(name: string, uuid: string, digest: string) {
        // In a real implementation, we would concatenate chunks if we had them.
        // Here we assume the content is at getUploadPath(name, uuid)
        // We copy it to the final blob path.

        const uploadPath = this.getUploadPath(name, uuid);
        const blobPath = this.getBlobPath(name, digest);

        const upload = await this.bucket.get(uploadPath);
        if (!upload) throw new Error('Upload session not found');

        await this.bucket.put(blobPath, upload.body, {
            httpMetadata: upload.httpMetadata
        });

        // Cleanup
        await this.bucket.delete(uploadPath);
    }

    async cancelUpload(name: string, uuid: string) {
        await this.bucket.delete(this.getUploadPath(name, uuid));
    }
}
