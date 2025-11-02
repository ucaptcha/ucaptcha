import { VdfSolver } from "./solver";
import type { 
    CaptchaSolverOptions, 
    ChallengeResponse, 
    AnswerResponse, 
    CaptchaError,
    CaptchaSolver 
} from "./types";

/**
 * Creates a captcha solver function with the provided configuration
 * @param options - Configuration options for the captcha solver
 * @returns A captcha solver function that can be called with a resource name
 */
export function createCaptchaSolver(options: CaptchaSolverOptions): CaptchaSolver {
    const { apiUrl, siteKey, timeout = 10000 } = options;
    const solver = new VdfSolver();

    return async function captchaSolver(resourceName: string): Promise<string> {
        try {
            // Step 1: Get a new challenge from the backend
            const challengeUrl = new URL(apiUrl);
            challengeUrl.pathname = '/challenge/new';
            challengeUrl.searchParams.set('siteKey', siteKey);
            challengeUrl.searchParams.set('resource', resourceName);

            const challengeResponse = await fetchWithTimeout(challengeUrl.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, timeout);

            if (!challengeResponse.ok) {
                const errorData = await challengeResponse.json().catch(() => ({})) as any;
                throw new CaptchaSolverError(
                    errorData.message || `Failed to get challenge: ${challengeResponse.statusText}`,
                    challengeResponse.status,
                    errorData
                );
            }

            const challenge: ChallengeResponse = await challengeResponse.json() as ChallengeResponse;

            // Step 2: Solve the VDF challenge using the solver
            const solution = await solver.compute(challenge.g, challenge.N, challenge.T);

            // Step 3: Submit the answer to get the JWT
            const answerUrl = new URL(apiUrl);
            answerUrl.pathname = `/challenge/${challenge.id}/answer`;
            const answerResponse = await fetchWithTimeout(answerUrl.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: solution }),
            }, timeout);

            if (!answerResponse.ok) {
                const errorData = await answerResponse.json().catch(() => ({})) as any;
                throw new CaptchaSolverError(
                    errorData.message || `Failed to submit answer: ${answerResponse.statusText}`,
                    answerResponse.status,
                    errorData
                );
            }

            const answer: AnswerResponse = await answerResponse.json() as AnswerResponse;
            return answer.token;

        } catch (error) {
            if (error instanceof CaptchaSolverError) {
                throw error;
            }
            
            // Handle network errors, timeouts, etc.
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new CaptchaSolverError('Request timeout', 408);
                }
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    throw new CaptchaSolverError('Network error', 0);
                }
            }
            
            throw new CaptchaSolverError(
                error instanceof Error ? error.message : 'Unknown error occurred',
                500
            );
        }
    };
}

/**
 * Custom error class for captcha solver errors
 */
export class CaptchaSolverError extends Error implements CaptchaError {
    public code?: number;
    public details?: any;

    constructor(message: string, code?: number, details?: any) {
        super(message);
        this.name = 'CaptchaSolverError';
        this.code = code;
        this.details = details;
    }
}

/**
 * Helper function to fetch with timeout
 */
async function fetchWithTimeout(
    url: string, 
    options: RequestInit & { timeout?: number }, 
    timeout: number
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}