import * as Comlink from "comlink";

/**
 * onProgress A callback function that takes a progress value between 0 and 1
 * @param progress - A progress value between 0 and 1
 */
export type VdfProgressCallback = (progress: number) => void;

export interface VdfWorkerApi {
    compute(
        g: string,
        N: string,
        T: number,
        onProgress: Comlink.ProxyOrClone<VdfProgressCallback> 
    ): Promise<string>;
}