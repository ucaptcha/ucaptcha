"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Typography } from "@/components/ui/typography";
import { Textarea } from "@/components/ui/textarea";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "./ui/button";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";
import { VdfSolver } from "@ucaptcha/js";

export function buildUrl(
	baseURL: string,
	path?: string,
	urlParams?: Record<string, string>
): string {
	const url = new URL(baseURL);
	if (path) {
		const trimmedPath = path.replace(/^\/+|\/+$/g, "");
		const baseHasPath = url.pathname && url.pathname !== "/";
		url.pathname = (baseHasPath ? url.pathname.replace(/\/+$/, "") + "/" : "/") + trimmedPath;
	}
	if (urlParams) {
		Object.keys(urlParams).forEach((key) => {
			const value = urlParams[key];
			if (value === undefined || value === null) return;
			url.searchParams.set(key, String(value));
		});
	}
	return url.toString();
}

const apiUrlAtom = atomWithStorage("api-url", "http://localhost:8732/");
const siteKeyAtom = atomWithStorage("siteKey", "");
const resourceAtom = atomWithStorage("resource", "");
const serverResponseAtom = atom("");
const resultAtom = atom("");

export function ApiUrlInput() {
	const [apiUrl, setApiUrl] = useAtom(apiUrlAtom);
	return (
		<div className="flex flex-col my-3">
			<Label className="mb-1 font-medium" htmlFor="playground-api-url">
				API Base URL
			</Label>
			<Input
				id="playground-api-url"
				className="max-w-lg"
				placeholder="Enter the URL"
				value={apiUrl}
				onChange={(e) => setApiUrl(e.target.value)}
			/>
		</div>
	);
}

export function Generating() {
	const apiURL = useAtomValue(apiUrlAtom);
	const [siteKey, setSiteKey] = useAtom(siteKeyAtom);
	const [resource, setResource] = useAtom(resourceAtom);
	const setServerResponse = useSetAtom(serverResponseAtom);

	async function generateChallenge() {
		const url = buildUrl(apiURL, "/challenge/new", {
			siteKey,
			resource
		});
		const response = await fetch(url);
		const data = await response.json();
		setServerResponse(JSON.stringify(data, null, 4));
	}

	return (
		<div>
			<Typography.H2>Generating</Typography.H2>
			<div className="flex flex-col gap-3">
				<div>
					<Label className="font-medium" htmlFor="playground-sitekey">
						SiteKey
					</Label>
					<Input
						id="playground-sitekey"
						placeholder="Enter the SiteKey"
						value={siteKey}
						onChange={(e) => setSiteKey(e.target.value)}
					/>
				</div>
				<div>
					<Label className="font-medium" htmlFor="playground-resource">
						Resource
					</Label>
					<Input
						id="playground-resource"
						placeholder="Enter the Resource"
						value={resource}
						onChange={(e) => setResource(e.target.value)}
					/>
				</div>

				<Button className="mt-2" onClick={generateChallenge}>
					Generate
				</Button>
			</div>
		</div>
	);
}

export function Validating({ className }: { className?: string }) {
	const [result, setResult] = useAtom(resultAtom);
	const [status, setStatus] = useState("pending");
	const apiURL = useAtomValue(apiUrlAtom);
	const serverResponse = useAtomValue(serverResponseAtom);

	async function submit() {
		const { id } = JSON.parse(serverResponse);
		const url = buildUrl(apiURL, `/challenge/${id}/answer`);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				answer: result
			})
		});
		if (response.ok) {
			setStatus("success");
		} else {
			setStatus("failed");
		}
	}

	function Status() {
		if (status === "success")
			return (
				<span className="mt-4 font-bold text-green-600">Validation Result: Success</span>
			);
		else if (status === "failed")
			return <span className="mt-4 font-bold text-red-600">Validation Result: Failed</span>;
	}

	useEffect(() => {
		setStatus("pending");
	}, [serverResponse, result]);

	return (
		<div className={className}>
			<Typography.H2 className="mt-4">Validating</Typography.H2>
			<Label className="font-medium">Result</Label>
			<Textarea
				className="h-40 break-all resize-none"
				rows={1}
				value={result}
				onChange={(e) => {
					setResult(e.target.value);
					setStatus("pending");
				}}
			/>
			<Button className="mt-4" onClick={submit}>
				Submit
			</Button>
			<Status />
		</div>
	);
}

const solverAtom = atom<VdfSolver>(); 

export function Solving() {
	const [serverResponse, setServerResponse] = useAtom(serverResponseAtom);
	const [solving, setSolving] = useState(false);
	const [challengeID, setChallengeID] = useState("");
	const [timeStart, setTimeStart] = useState(0);
	const [timeCost, setTimeCost] = useState(0);
	const setResult = useSetAtom(resultAtom);
	const apiURL = useAtomValue(apiUrlAtom);
	const [solver, setSolver] = useAtom(solverAtom);

	useEffect(() => {
		const s = new VdfSolver();
		setSolver(s);
	}, []);

	async function solve() {
		if (!solver) return;
		try {
			setSolving(true);
			const { g, T, N } = JSON.parse(serverResponse);
			const start = performance.now();
			setTimeStart(start);
			const result = await solver.compute(g, N, T);
			setResult(result.toString());
			setSolving(false);
		} finally {
			setSolving(false);
		}
	}

	useEffect(() => {
		const timer = setInterval(() => {
			if (solving) {
				const timeEnd = performance.now();
				const timeDiff = timeEnd - timeStart;
				setTimeCost(timeDiff);
			}
		}, 16);
		return () => clearInterval(timer);
	}, [solving]);

	async function getChallenge() {
		const url = buildUrl(apiURL, `/challenge/${challengeID}`);
		const response = await fetch(url);
		const data = await response.json();
		const { id, g, T, N } = data;
		setServerResponse(JSON.stringify({ id, g, T, N }, null, 4));
	}

	return (
		<div className="flex flex-col">
			<Typography.H2>Solving</Typography.H2>
			<Label className="font-medium">Retrieve the challenge by its ID:</Label>
			<div className="flex gap-4 mb-4">
				<Input
					placeholder="Challenge ID"
					value={challengeID}
					onChange={(e) => setChallengeID(e.target.value)}
				/>
				<Button onClick={getChallenge}>Get</Button>
			</div>
			<Label className="font-medium mb-1.5" htmlFor="playground-input">
				Or paste the JSON sent from the API here.
			</Label>
			<Textarea
				id="playground-input"
				className="break-all h-80"
				rows={50}
				value={serverResponse}
				onChange={(e) => setServerResponse(e.target.value)}
			/>
			<Button className="mt-4" onClick={solve} disabled={solving}>
				{solving ? "Solving..." : "Solve"}
			</Button>
			<div className="mt-4">
				<span className="font-medium">Time Cost: </span>
				<span>{timeCost.toFixed(0)} ms</span>
			</div>
		</div>
	);
}
