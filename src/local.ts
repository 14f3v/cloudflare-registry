import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { registry } from './registry';
import { FSR2Bucket } from './r2-fs';
import { mkdir } from 'fs/promises';

// Ensure local storage directory exists
const STORAGE_DIR = './.local-storage';
await mkdir(STORAGE_DIR, { recursive: true });

const bucket = new FSR2Bucket(STORAGE_DIR);

const app = new Elysia()
    .use(swagger())
    .get('/', () => 'Hello from Local Bun Registry!')
    .use(registry({ REGISTRY_BUCKET: bucket as any }))
    .listen(3000);

console.log(`🦊 Local Registry is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📂 Storage: ${STORAGE_DIR}`);
