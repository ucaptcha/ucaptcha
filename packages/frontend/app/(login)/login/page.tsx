"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				router.refresh();
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to login");
			}
		} catch (err) {
			setError("Network error.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Typography.H1>Login to Dashboard</Typography.H1>
				</div>

				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1"
							placeholder="Enter your password"
						/>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Logging in..." : "Log in"}
					</Button>
				</form>
			</div>
		</div>
	);
}