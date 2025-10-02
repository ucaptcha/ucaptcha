import { Typography } from "@/components/ui/typography";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="font-sans">
			<Typography.H1 className="mt-4 ml-1">Dashboard</Typography.H1>
			<div className="grid grid-cols-1 max-lg:gap-6 lg:grid-cols-2 ">
				<Card>
					<CardHeader>
						<CardTitle>Quota</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
