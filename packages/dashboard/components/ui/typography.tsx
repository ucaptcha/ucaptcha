import { tv } from "tailwind-variants";

const tg = tv({
	slots: {
		h1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
		h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight",
		p: "leading-7"
	},
});

const { h1, h2, p } = tg();

function TypographyH1({
	children,
	className,
	...rest
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<h1 className={h1({ className })} {...rest}>
			{children}
		</h1>
	);
}

function TypographyH2({
	children,
	className,
	...rest
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<h2 className={h2({ className })} {...rest}>
			{children}
		</h2>
	);
}

function TypographyP({
	children,
	className,
	...rest
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<p className={p({ className })} {...rest}>
			{children}
		</p>
	);
}

export const Typography = {
	H1: TypographyH1,
	H2: TypographyH2,
	P: TypographyP
};
