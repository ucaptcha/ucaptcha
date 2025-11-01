import * as Comlink from "comlink";
import { compute_vdf } from "@ucaptcha/solver-wasm";
import rust_wasm_init from "@ucaptcha/solver-wasm";
import type { VdfWorkerApi, VdfProgressCallback } from "./types";

const wasmReady = rust_wasm_init();

const api: VdfWorkerApi = {
	async compute(
		gStr: string,
		NStr: string,
		T: number,
		onProgress: VdfProgressCallback
	): Promise<string> {
		await wasmReady;

		const chunkSize = 10000;
		let currentG = gStr;
		let iterationsDone = 0;

		while (iterationsDone < T) {
			const remainingIterations = T - iterationsDone;
			const currentChunkSize =
				remainingIterations > chunkSize ? chunkSize : remainingIterations;

			currentG = compute_vdf(currentG, NStr, BigInt(currentChunkSize));

			iterationsDone += currentChunkSize;

			const progress = iterationsDone / T;
			onProgress(progress);
		}

		if (iterationsDone === T) {
			onProgress(100);
		}

		return currentG;
	}
};

Comlink.expose(api);
