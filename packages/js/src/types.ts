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

// Higher-level API types
export interface CaptchaSolverOptions {
    apiUrl: string;
    siteKey: string;
    timeout?: number; // Request timeout in milliseconds, default 30000
}

export interface ChallengeResponse {
    id: string;
    g: string;
    T: number;
    N: string;
}

export interface AnswerResponse {
    token: string;
}

export interface CaptchaError {
    message: string;
    code?: number;
    details?: any;
}

export type CaptchaSolver = (resourceName: string) => Promise<string>;