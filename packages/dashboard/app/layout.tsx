import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSideBar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "μCaptcha Dashboard"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<SidebarProvider className="flex max-w-screen">
					<AppSidebar />
					<main className="px-4 lg:px-8 w-full md:w-[calc(100%-16rem)] 2xl:w-7xl pt-4">
						<SidebarTrigger className="md:hidden" />
						<div className="sm:px-12 md:px-4">{children}</div>
					</main>
				</SidebarProvider>
			</body>
		</html>
	);
}
