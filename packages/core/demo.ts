// --- Main Execution ---

import { computeVDF, generateRSAKey, generateValidG, verifyVDF } from ".";

// Parameters: p, q, N are invisible to the Prover (Challenger).
console.time("key_generation");
const key = (await generateRSAKey(1024))!;
console.timeEnd("key_generation");
const p = key.p;
const q = key.q;
const N = key.N;
const T = BigInt(300000); // Difficulty/Delay parameter

console.time("g_generation");
// g is a quadratic residue modulo N.
// Generate input g for the Prover's computation.
// Generating a new g supplies a new challenge. The generation of p, q, N (more time-consuming)
// does not need to be done for every challenge.
const g = generateValidG(N);
console.timeEnd("g_generation");

// Prover's (Challenger's) computation process
console.time("Prover_Computation");
const challengeResult = computeVDF(g, N, T);
console.log("Prover's computation result (y):", challengeResult.toString());
console.timeEnd("Prover_Computation");

// Verifier's verification process
console.time("Verifier_Verification");
const isValid = verifyVDF(g, N, T, challengeResult, p, q);
console.log("Verification result:", isValid);
console.timeEnd("Verifier_Verification");

// Benchmark on M2 MacBook Air, Bun 1.2.19 (3-time average):
// g_generation: 0.15ms
// Prover_Computation: 519.71ms
// Verifier_Verification: 2.96s
