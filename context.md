# Project Context: Cloudflare Container Registry

## Overview
This project is a Docker/OCI compatible container registry designed to run on **Cloudflare Workers** (Edge) using **Bun** as the runtime and **Elysia** as the web framework. It uses **Cloudflare R2** for object storage.

## Tech Stack
- **Runtime**: Bun (TypeScript native)
- **Framework**: ElysiaJS (High-performance, ergonomic)
- **Platform**: Cloudflare Workers
- **Storage**: Cloudflare R2 (Object Storage)
- **Language**: TypeScript

## Project Structure
```
/src
  ├── index.ts      # Cloudflare Worker entry point (exports fetch handler)
  ├── local.ts      # Local Bun server entry point (for local dev without Wrangler)
  ├── registry.ts   # Core Registry Logic (OCI Distribution API v2 endpoints)
  ├── storage.ts    # R2 Storage Adapter (Abstracts R2 operations)
  ├── r2-fs.ts      # FileSystem-backed R2 mock (for local.ts)
  ├── digest.ts     # SHA256 digest calculation helper
  └── utils.ts      # Error handling and utilities
/test
  ├── registry.test.ts # Integration tests
  └── mocks.ts         # In-memory R2 mock for testing
wrangler.toml       # Cloudflare Workers configuration
package.json        # Dependencies and scripts
```

## Key Implementation Details

### 1. OCI Distribution API
The registry implements the core OCI Distribution Specification v2:
- **Base**: `/v2/` (Version check)
- **Blobs**: `/v2/<name>/blobs/<digest>` (Upload/Download)
- **Manifests**: `/v2/<name>/manifests/<reference>` (Push/Pull)

### 2. Storage Abstraction
- `RegistryStorage` class in `src/storage.ts` wraps `R2Bucket`.
- It handles paths for blobs (`v2/<name>/blobs/<digest>`) and manifests.
- `FSR2Bucket` in `src/r2-fs.ts` mimics `R2Bucket` using the local filesystem for `start:local`.

### 3. Dual Execution Mode
- **Production/Wrangler**: Uses `src/index.ts`. Injects `env.REGISTRY_BUCKET` (real R2).
- **Local Bun**: Uses `src/local.ts`. Uses `FSR2Bucket` pointing to `./.local-storage`.

## Commands
- **Run Locally (Pure Bun)**: `bun run start:local` (runs on port 3000)
- **Run Locally (Wrangler)**: `bun run dev`
- **Test**: `bun test`
- **Deploy**: `bun run deploy`

## Future Todo
- **Authentication**: Currently open. Needs Basic/Bearer auth.
- **Garbage Collection**: No mechanism to clean up unreferenced blobs.
