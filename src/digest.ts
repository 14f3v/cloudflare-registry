export async function calculateDigest(data: ArrayBuffer | string | Uint8Array): Promise<string> {
    const buffer = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data;

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256:${hashHex}`;
}
