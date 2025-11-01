import * as Comlink from "comlink";
import type { VdfWorkerApi, VdfProgressCallback } from "./types";

type WorkerMode = "bigint" | "wasm";

export class VdfSolver {
	private worker: Worker;
	private workerApi: Comlink.Remote<VdfWorkerApi>;
	private mode: WorkerMode;

	/**
	 * Creates a VdfSolver instance.
	 * The constructor automatically detects the current browser environment and loads the optimal Web Worker.
	 */
	constructor() {
		this.mode = this.getWorkerMode();

		if (this.mode === "bigint") {
			console.log("VDF Solver: Using BigInt native worker.");
			this.worker = new Worker(new URL("./vdf.worker.bigint.ts", import.meta.url), {
				type: "module"
			});
		} else {
			console.log("VDF Solver: Using WASM worker.");
			this.worker = new Worker(new URL("./vdf.worker.wasm.ts", import.meta.url), {
				type: "module"
			});
		}

		this.workerApi = Comlink.wrap<VdfWorkerApi>(this.worker);
	}

	/**
	 * Decides which Worker to use based on the browser's User Agent and feature support.
	 * - Firefox: Always use WASM (for performance considerations).
	 * - Chrome/Safari with BigInt support: Use the native BigInt implementation.
	 * - No BigInt support or other browsers: Use WASM as a fallback.
	 * @returns 'bigint' or 'wasm'
	 */
	private getWorkerMode(): WorkerMode {
		if (typeof BigInt === "undefined") {
			return "wasm"; // If BigInt is not supported, WASM must be used
		}

		const ua = navigator.userAgent.toLowerCase();

		// Firefox might be slower than V8/JSC on some BigInt operations, prioritize WASM
		if (ua.includes("firefox")) {
			return "wasm";
		}

		// BigInt performance in V8 (Chrome/Edge) and JavaScriptCore (Safari) is very good
		if (ua.includes("chrome") || ua.includes("safari") || ua.includes("edge")) {
			return "bigint";
		}

		// Default to WASM in other cases as it has more predictable performance
		return "wasm";
	}

	/**
	 * Asynchronously computes the VDF in a Web Worker.
	 * @param g - VDF parameter g, a large number represented as a string.
	 * @param N - VDF parameter N (modulus), a large number represented as a string.
	 * @param T - VDF parameter T (number of iterations).
	 * @param onProgress - An optional callback function to receive calculation progress (0-100).
	 * @returns A Promise that resolves to the result of the calculation as a string.
	 */
	public async compute(
		g: string,
		N: string,
		T: number,
		onProgress?: VdfProgressCallback
	): Promise<string> {
		// Create a default empty callback to avoid null checks in the worker
		const progressCallback = onProgress || (() => {});

		// Use Comlink.proxy to pass the callback function to the worker
		return this.workerApi.compute(g, N, T, Comlink.proxy(progressCallback));
	}

	/**
	 * Terminates the Web Worker to free up resources.
	 * Call this method when the solver instance is no longer needed.
	 */
	public destroy(): void {
		this.workerApi[Comlink.releaseProxy]();
		this.worker.terminate();
		console.log("VDF Worker terminated.");
	}
}
