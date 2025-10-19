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
import { verifyAuthToken } from "@shared/auth/jwt";
import { ShieldCheck, FileText, FlaskConical, Gauge, Globe, User, Settings, BarChart3 } from "lucide-react";
import { cookies } from "next/headers";

export async function AppSidebar() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token");
	const { payload } = await verifyAuthToken(token!.value);
	const isAdmin = payload?.role === "admin";

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
									<a href="/dashboard">
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
				<SidebarGroup>
					<SidebarGroupLabel>Sites</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem key="sites">
								<SidebarMenuButton asChild>
									<a href="/sites">
										<Globe />
										<span>Sites</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key="resources">
								<SidebarMenuButton asChild>
									<a href="/resources">
										<FileText />
										<span>Resources</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key="difficulty">
								<SidebarMenuButton asChild>
									<a href="/difficulty">
										<BarChart3 />
										<span>Difficulty</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{isAdmin && (
					<SidebarGroup>
						<SidebarGroupLabel>Admin</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem key="sites">
									<SidebarMenuButton asChild>
										<a href="/admin/users">
											<User />
											<span>Users</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem key="resources">
									<SidebarMenuButton asChild>
										<a href="/admin/settings">
											<Settings />
											<span>Settings</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
