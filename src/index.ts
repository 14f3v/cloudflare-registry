import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { registry } from './registry';
import { R2Bucket } from '@cloudflare/workers-types';

// Env interface for Cloudflare Workers
interface Env {
    REGISTRY_BUCKET: R2Bucket;
}

export default {
    fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const app = new Elysia()
            .use(swagger())
            .get('/', () => 'Hello from Cloudflare Container Registry!')
            .use(registry(env));

        return app.fetch(request);
    }
};