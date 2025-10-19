import * as Comlink from "comlink";
import { compute_vdf } from "@alikia/ucaptcha-vdf-solver-wasm";
import rust_wasm_init from "@alikia/ucaptcha-vdf-solver-wasm";

async function computeVDF(g: string, N: string, T: bigint): Promise<string> {
	await rust_wasm_init();
	return compute_vdf(g, N, T);
}

Comlink.expose({
	computeVDF
});
