"use client";

import { compute_vdf } from "ucaptcha-vdf-wasm";
import rust_wasm_init from "ucaptcha-vdf-wasm";
import { computeVDF, generateRSAKey, generateValidG, verifyVDF } from "@core/index";
import { Button } from "@/components/ui/button";

async function test() {
	await rust_wasm_init();
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

	// WASM version
	console.time("WASM_Prover_Computation");
	const challengeResultWasm = compute_vdf(g.toString(), N.toString(), T);
	console.log("WASM computation result (y):", challengeResultWasm.toString());
	console.timeEnd("WASM_Prover_Computation");

	// Verifier's verification process
	console.time("Verifier_Verification");
	const isValid = verifyVDF(g, N, T, challengeResult, p, q);
	console.log("Verification result:", isValid);
	console.timeEnd("Verifier_Verification");
}

export default function Test() {
	return <Button onClick={() => test()}>Test</Button>;
}
