"use client";

import NumberFlow from "@number-flow/react";
import { Typography } from "./ui/typography";
import { useEffect, useState } from "react";
import { getQuota } from "@/lib/ssf";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";


export const Quota = ({ quota, uid }: { quota: number; uid: number }) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(quota);
		const interval = setInterval(async () => {
			const quota = await getQuota(uid);
			setCount(quota);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Card className="gap-2">
			<CardHeader>
				<CardTitle className="text-2xl">Quota</CardTitle>
				<CardDescription>
					To prevent abuse and ensure fair usage, each account has a monthly quota of{" "}
					<b>1,000,000 new challenges</b>.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<div className="flex justify-between pb-1">
						<Label className="text-2xl">Usage</Label>
						<Typography.H2 className="text-2xl">
							<NumberFlow value={count} />
							<span className="text-lg text-muted-foreground"> / 1,000,000</span>
						</Typography.H2>
					</div>
					<Progress value={(count / 1000000) * 100} />
				</div>
			</CardContent>
		</Card>
	);
};
