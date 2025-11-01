import * as Comlink from "comlink";
import type { VdfWorkerApi, VdfProgressCallback } from "./types";

const api: VdfWorkerApi = {
	async compute(
		gStr: string,
		NStr: string,
		T: number,
		onProgress: VdfProgressCallback
	): Promise<string> {
		const g = BigInt(gStr);
		const N = BigInt(NStr);
		let result = g;

		const reportInterval = 5000;

		for (let i = 0; i < T; i++) {
			result = (result * result) % N;

			if (i % reportInterval !== 0) continue;
			const progress = i / T;
			onProgress(progress);
		}

		onProgress(100);

		return result.toString();
	}
};

Comlink.expose(api);
