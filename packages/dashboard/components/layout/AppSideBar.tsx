import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { ShieldCheck, FlaskConical, Gauge } from "lucide-react";
import { cookies } from 'next/headers'

export async function AppSidebar() {
	return (
		<Sidebar collapsible="offcanvas" variant="inset">
			<SidebarHeader className="flex flex-col gap-2 p-2">
				<SidebarMenu>
					<SidebarMenuItem key="header">
						<SidebarMenuButton asChild>
							<a href="#">
								<ShieldCheck className="!size-5" />
								<span className="text-base font-semibold">μCaptcha</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Home</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem key="dashboard">
								<SidebarMenuButton asChild>
									<a href="/">
										<Gauge />
										<span>Dashboard</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key="playground">
								<SidebarMenuButton asChild>
									<a href="/playground">
										<FlaskConical />
										<span>Playground</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
