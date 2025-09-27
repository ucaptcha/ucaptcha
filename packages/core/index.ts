type JsonWebKey = import("crypto").webcrypto.JsonWebKey;

// Helper function to decode a Base64URL string to a BigInt
const base64UrlToBigInt = (base64Url: string): bigint => {
	// Base64URL to Base64
	const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

	// Base64 to ArrayBuffer (Uint8Array)
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	// Uint8Array to BigInt
	let result = 0n;
	for (const byte of bytes) {
		result = (result << 8n) | BigInt(byte);
	}
	return result;
};

interface RSAComponents {
	p: bigint;
	q: bigint;
	N: bigint;
}

/**
 * Extracts p, q, and N (modulus) from a private JWK (RSA).
 * These are required for the VDF verification step.
 * (Simplified implementation)
 * @param jwk The private JWK object, must contain n, p, and q.
 * @returns An object containing p, q, and N as BigInts, or null if essential components are missing.
 */
function getRSAComponentsAsBigInt(jwk: JsonWebKey): RSAComponents | null {
	// Assert properties exist (though the types may not enforce it perfectly)
	if (!jwk.n || !jwk.p || !jwk.q) {
		console.error("The provided JWK does not contain n, p, or q.");
		return null;
	}

	// The `base64UrlToBigInt` function handles the conversion from Base64URL string parts
	const N = base64UrlToBigInt(jwk.n);
	const p = base64UrlToBigInt(jwk.p);
	const q = base64UrlToBigInt(jwk.q);

	return { p, q, N };
}

/**
 * Generates an RSA key pair and extracts the required components (p, q, N) from the private key.
 * @returns A promise that resolves to the RSA components (p, q, N) as BigInts, or null on failure.
 */
export async function generateRSAKey(length: number = 1536): Promise<RSAComponents | null> {
	// Generate an RSA key pair
	const keyPair = await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: length,
			publicExponent: new Uint8Array([1, 0, 1]), // 65537
			hash: "SHA-256",
		},
		true, // extractable
		["encrypt", "decrypt"],
	);

	// Export the private key as a JWK
	const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

	// Extract the components
	const components = getRSAComponentsAsBigInt(privateJwk);

	return components ? components : null;
}

// --- VDF Core Functions ---

/**
 * Modular Exponentiation (Fast Powering Modulo) function.
 * Calculates (base^exponent) % mod efficiently.
 * @param base The base (BigInt).
 * @param exponent The exponent (BigInt).
 * @param mod The modulus (BigInt).
 * @returns The result (BigInt).
 */
function pow(base: bigint, exponent: bigint, mod: bigint): bigint {
	let result = 1n;
	base = base % mod;
	while (exponent > 0n) {
		if (exponent % 2n === 1n) {
			result = (result * base) % mod;
		}
		base = (base * base) % mod;
		exponent = exponent / 2n;
	}
	return result;
}

/**
 * Prover's (Challenger's) computation function.
 * This is the function that requires time proportional to T.
 * Calculates y = g^(2^T) mod N.
 * @param g The input element (quadratic residue mod N).
 * @param N The RSA modulus.
 * @param T The number of iterations (delay parameter).
 * @returns The VDF output, y.
 */
export function computeVDF(g: bigint, N: bigint, T: bigint): bigint {
	let result = g;
	// The core VDF step: repeated squaring
	for (let i = 0n; i < T; i++) {
		result = (result * result) % N;
	}
	return result;
}

/**
 * Verifier's verification function.
 * This function is fast because it uses the trapdoor (p, q) to calculate the result
 * in O(log T) time complexity, independent of the prover's O(T) time.
 * @param g The VDF input.
 * @param N The RSA modulus.
 * @param T The delay parameter.
 * @param y The VDF output to be verified.
 * @param p The first prime factor of N.
 * @param q The second prime factor of N.
 * @returns True if the output y is correct, false otherwise.
 */
export function verifyVDF(
	g: bigint,
	N: bigint,
	T: bigint,
	y: bigint,
	p: bigint,
	q: bigint,
): boolean {
	// Calculate the order of the quadratic residue subgroup: ord = p' * q'
	// where p' = (p-1)/2 and q' = (q-1)/2
	const pPrime = (p - 1n) / 2n;
	const qPrime = (q - 1n) / 2n;
	const ord = pPrime * qPrime;

	// Calculate the optimized exponent 'e' in the subgroup modulo 'ord'
	// e = 2^T mod ord
	const e = pow(2n, T, ord);

	// Calculate the expected result: expected = g^e mod N
	const expected = pow(g, e, N);

	return expected === y;
}

// --- Utility Functions ---

/**
 * Generates a cryptographically secure random BigInt in the range [min, max].
 * @param min The inclusive minimum value.
 * @param max The inclusive maximum value.
 * @returns A random BigInt.
 */
function generateRandomBigInt(min: bigint, max: bigint): bigint {
	const range = max - min;
	const bitLength = range.toString(2).length;
	const byteLength = Math.ceil(bitLength / 8);
	const mask = (1n << BigInt(bitLength)) - 1n; // Mask for truncation
	let result: bigint;

	do {
		const randomBytes = new Uint8Array(byteLength);
		crypto.getRandomValues(randomBytes);
		result = 0n;
		for (let i = 0; i < byteLength; i++) {
			result = (result << 8n) | BigInt(randomBytes[i]!);
		}
		result = result & mask; // Ensure it doesn't exceed bitLength
	} while (result > range);

	return min + result;
}

/**
 * Generates a random quadratic residue 'g' modulo N.
 * g is generated as r^2 mod N, ensuring it's in the correct subgroup.
 * It also checks g != 0, 1, N-1.
 * @param N The RSA modulus.
 * @returns A valid input element g.
 */
export function generateValidG(N: bigint): bigint {
	if (N <= 4n) throw new Error("N must be > 4");
	while (true) {
		// Choose a random r in [2, N-1]
		const r = generateRandomBigInt(2n, N - 1n);
		// Calculate g = r^2 mod N
		const g = (r * r) % N;
		// Ensure g is not a trivial value (0, 1, -1 mod N)
		if (g !== 1n && g !== 0n && g !== N - 1n) {
			return g;
		}
	}
}
