import { mkdir, writeFile, readFile, unlink, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export class FSR2Bucket {
    constructor(private root: string) {
        if (!existsSync(root)) {
            // We can't use async in constructor, so we assume it exists or create it lazily
        }
    }

    private getPath(key: string) {
        // Sanitize key to prevent directory traversal
        const safeKey = key.replace(/\.\./g, '');
        return join(this.root, safeKey);
    }

    private getMetaPath(key: string) {
        return this.getPath(key) + '.meta.json';
    }

    async ensureDir(path: string) {
        await mkdir(dirname(path), { recursive: true });
    }

    async head(key: string) {
        const path = this.getPath(key);
        if (existsSync(path)) {
            const stats = await stat(path);
            let meta = {};
            if (existsSync(this.getMetaPath(key))) {
                try {
                    meta = JSON.parse(await readFile(this.getMetaPath(key), 'utf-8'));
                } catch (e) { }
            }
            return {
                size: stats.size,
                ...meta
            };
        }
        return null;
    }

    async get(key: string) {
        const path = this.getPath(key);
        if (existsSync(path)) {
            const stats = await stat(path);
            const file = Bun.file(path);

            let meta: any = {};
            if (existsSync(this.getMetaPath(key))) {
                try {
                    meta = JSON.parse(await readFile(this.getMetaPath(key), 'utf-8'));
                } catch (e) { }
            }

            return {
                body: file.stream(),
                size: stats.size,
                httpMetadata: meta.httpMetadata,
                customMetadata: meta.customMetadata,
                arrayBuffer: async () => await file.arrayBuffer(),
                text: async () => await file.text()
            };
        }
        return null;
    }

    async put(key: string, value: any, options: any) {
        const path = this.getPath(key);
        await this.ensureDir(path);

        // Write content
        await Bun.write(path, value);

        // Write metadata
        const meta = {
            httpMetadata: options?.httpMetadata,
            customMetadata: options?.customMetadata
        };
        await Bun.write(this.getMetaPath(key), JSON.stringify(meta));

        return { key };
    }

    async delete(key: string) {
        const path = this.getPath(key);
        if (existsSync(path)) await unlink(path);
        if (existsSync(this.getMetaPath(key))) await unlink(this.getMetaPath(key));
    }
}
