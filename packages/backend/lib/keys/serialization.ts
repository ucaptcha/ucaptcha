import { RSAComponents } from "@core/index";

export function serializeKey(key: RSAComponents) {
    return JSON.stringify({
        p: key.p.toString(),
        q: key.q.toString(),
        N: key.N.toString(),
    })
}

export function deserializeKey(key: string): RSAComponents {
    const parsed = JSON.parse(key);
    return {
        p: BigInt(parsed.p || 0),
        q: BigInt(parsed.q || 0),
        N: BigInt(parsed.N || 0),
    }
}