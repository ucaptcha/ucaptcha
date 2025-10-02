import { Typography } from "@/components/ui/typography";
import { ApiUrlInput, Generating, Solving, Validating } from "@/components/Playground";

export default function Home() {
	return (
		<div className="font-sans w-full">
			<Typography.H1 className="my-4 ml-1">Playground</Typography.H1>
			<ApiUrlInput />
			<div className="grid grid-cols-1 max-lg:gap-6 lg:[grid-template-columns:1fr_24px_calc(50%+1rem)]">
				<div>
					<Generating />
					<Validating className="flex flex-col mt-6 max-lg:hidden" />
				</div>
				<div />
				<Solving />
                <Validating className="flex flex-col lg:hidden" />
			</div>
		</div>
	);
}
