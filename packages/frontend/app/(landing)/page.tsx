"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
	Shield,
	Zap,
	Users,
	Lock,
	ArrowRight,
	CheckCircle,
	Sparkles,
	Code,
	CircleDollarSign
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
	const features = [
		{
			icon: <Shield className="h-8 w-8" />,
			title: "Advanced Security",
			description:
				"Protect your applications with sophisticated CAPTCHA challenges that deter bots while maintaining user accessibility."
		},
		{
			icon: <CircleDollarSign className="h-8 w-8" />,
			title: "Miminum Cost",
			description:
				"Never pay a dime. Choose between our free cloud service or a private, self-hosted deployment."
		},
		{
			icon: <Users className="h-8 w-8" />,
			title: "User-Friendly",
			description:
				"No fire hydrant hunts. No pop-ups. Not even a click. Get your users verified with ease."
		},
		{
			icon: <Lock className="h-8 w-8" />,
			title: "Privacy First",
			description:
				"Built with privacy in mind, ensuring user data protection and compliance with global privacy standards."
		}
	];

	const benefits = [
		"Reduce spam and automated attacks",
		"Improve user experience with seamless verification",
		"Automatic difficulty adjustment",
		"Easy integration with any platform",
		"Free forever"
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 lg:py-32">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
							<Sparkles className="h-4 w-4" />
							<span className="text-sm font-medium">Next-Generation CAPTCHA</span>
						</div>

						<Typography.H1 className="text-5xl lg:text-7xl font-bold tracking-tight">
							μCaptcha
							<span className="block text-3xl sm:text-4xl lg:text-6xl text-muted-foreground mt-2">
								User-Friendly CAPTCHA Made Powerful
							</span>
						</Typography.H1>

						<Typography.P className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
							Protect your applications from automated threats while providing a
							seamless experience for real users. Our advanced verification system
							balances security with usability.
						</Typography.P>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
							<Button size="lg" className="text-lg px-8 py-6" asChild>
								<Link href="/dashboard">
									Get Started
									<ArrowRight className="size-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-6"
								asChild
							>
								<Link href="/playground">Try Demo</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Background decoration */}
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl"></div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-background">
				<div className="container mx-auto px-4">
					<div className="text-center space-y-4 mb-16">
						<Typography.H2 className="text-3xl sm:text-4xl font-bold">
							Why Choose μCaptcha?
						</Typography.H2>
						<Typography.P className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Built with modern technology and user experience at the forefront
						</Typography.P>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="text-center border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
							>
								<CardHeader>
									<div className="flex justify-center mb-4">
										<div className="p-3 rounded-full bg-primary/10 text-primary">
											{feature.icon}
										</div>
									</div>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4 lg:px-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:[grid-template-columns:8fr_1fr_5fr] gap-12 items-center">
						<div className="space-y-6">
							<Typography.H2 className="text-3xl sm:text-4xl font-bold">
								Everything You Need to Secure Your Platform
							</Typography.H2>
							<Typography.P className="text-xl text-muted-foreground">
								Our next-generation CAPTCHA solution provides robust protection
								without compromising on user experience.
							</Typography.P>

							<div className="space-y-4">
								{benefits.map((benefit, index) => (
									<div key={index} className="flex items-center gap-3">
										<CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
										<span className="text-lg">{benefit}</span>
									</div>
								))}
							</div>
						</div>
						<div className="hidden xl:block" />

						<div className="relative">
							<Card className="p-8 border-2">
								<CardHeader className="text-center">
									<CardTitle className="text-2xl">
										Ready to Get Started?
									</CardTitle>
									<CardDescription className="text-lg">
										Join thousands of developers securing their applications
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4 px-2">
									<Button size="lg" className="w-full text-lg py-6 px-5" asChild>
										<Link href="/dashboard">
											Start Protecting Your App
											<ArrowRight className="h-5 w-5" />
										</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-background">
				<div className="container mx-auto sm:px-4 sm:text-center">
					<div className="p-4 md:p-12">
						<Typography.H2 className="text-3xl sm:text-4xl font-bold mb-4">
							Start Securing Your Applications Today
						</Typography.H2>
						<Typography.P className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Get started with μCaptcha and experience the difference in security and
							user experience.
						</Typography.P>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" className="text-lg px-8 py-6" asChild>
								<Link href="/dashboard">
									Get Started for Free
									<ArrowRight className="h-5 w-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-6"
								asChild
							>
								<Link href="/playground">View Documentation</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 border-t">
				<div className="container mx-auto px-4 text-center">
					<Typography.P className="text-muted-foreground">
						Released under the Apache 2.0 License.
					</Typography.P>
					<Typography.P className="text-muted-foreground">
						© 2025 alikia2x. Built with modern technology for a safer web.
					</Typography.P>
				</div>
			</footer>
		</div>
	);
}
