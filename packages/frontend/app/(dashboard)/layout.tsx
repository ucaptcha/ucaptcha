import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/global.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
					<SidebarInset className="flex items-center">
						<SidebarTrigger className="absolute top-2 left-2" />
							<main className="px-4 lg:px-8 w-full pt-8 lg:pt-12 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
								{children}
							</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
