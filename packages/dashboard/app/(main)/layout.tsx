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
					<SidebarInset>
						<SidebarTrigger className="absolute top-2 left-2" />
							<main className="px-4 lg:px-8 w-full pt-4 lg:pt-8 2xl:px-20">
								{children}
							</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
