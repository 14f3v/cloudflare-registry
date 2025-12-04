export class MockR2Bucket {
    private storage = new Map<string, any>();

    async head(key: string) {
        if (this.storage.has(key)) {
            const val = this.storage.get(key);
            return {
                size: val.body.length,
                httpMetadata: val.httpMetadata,
                customMetadata: val.customMetadata
            };
        }
        return null;
    }

    async get(key: string) {
        if (this.storage.has(key)) {
            const val = this.storage.get(key);
            return {
                body: val.body, // Should be stream but string/buffer works for simple mocks sometimes
                size: val.body.length,
                httpMetadata: val.httpMetadata,
                customMetadata: val.customMetadata,
                arrayBuffer: async () => new TextEncoder().encode(val.body).buffer
            };
        }
        return null;
    }

    async put(key: string, value: any, options: any) {
        // value can be stream, string, buffer.
        // For test simplicity, we convert to string/buffer.
        let body = value;
        if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
            // Naive stream reader for mock
            body = "mock-content";
            if (value && typeof value.text === 'function') {
                body = await value.text();
            }
        }

        this.storage.set(key, {
            body,
            httpMetadata: options?.httpMetadata,
            customMetadata: options?.customMetadata
        });
        return { key };
    }

    async delete(key: string) {
        this.storage.delete(key);
    }
}
