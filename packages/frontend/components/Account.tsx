"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { User, Key, Shield, Copy, RefreshCw, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface UserInfo {
	id: number;
	name: string;
	email: string;
	role: string;
	jwtSecret: string;
	createdAt: string;
	updatedAt: string;
}

interface AccountProps {
	user: UserInfo;
	userID: number;
}

export default function Account({ user, userID }: AccountProps) {
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [showJwtDialog, setShowJwtDialog] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showJwtSecret, setShowJwtSecret] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [newJwtSecret, setNewJwtSecret] = useState<string | null>(null);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handlePasswordChange = async () => {
		if (newPassword !== confirmPassword) {
			setMessage({ type: "error", text: "New passwords do not match" });
			return;
		}

		if (newPassword.length < 8) {
			setMessage({ type: "error", text: "Password must be at least 8 characters long" });
			return;
		}

		try {
			const formData = new FormData();
			formData.append("currentPassword", currentPassword);
			formData.append("newPassword", newPassword);
			formData.append("confirmPassword", confirmPassword);

			const { changePasswordAction } = await import("../app/(dashboard)/account/actions");
			await changePasswordAction(userID, formData);

			setMessage({ type: "success", text: "Password changed successfully" });
			setShowPasswordDialog(false);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			setMessage({ type: "error", text: error instanceof Error ? error.message : "Error changing password" });
		}
	};

	const handleJwtSecretRegenerate = async () => {
		try {
			const { regenerateJwtSecretAction } = await import("../app/(dashboard)/account/actions");
			const result = await regenerateJwtSecretAction(userID);

			setNewJwtSecret(result.jwtSecret);
			setMessage({ type: "success", text: "JWT secret regenerated successfully" });
		} catch (error) {
			setMessage({ type: "error", text: error instanceof Error ? error.message : "Error regenerating JWT secret" });
		}
	};

	const copyJwtSecretToClipboard = () => {
		const secret = newJwtSecret || user.jwtSecret;
		navigator.clipboard.writeText(secret);
		setMessage({ type: "success", text: "JWT secret copied to clipboard" });
	};

	return (
		<div className="font-sans">
			<Typography.H1 className="mt-4 ml-1">Account Management</Typography.H1>

			{message && (
				<div className={`mt-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
					{message.text}
				</div>
			)}

			<div className="mt-6 space-y-6">
				{/* User Information Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="size-5" />
							User Information
						</CardTitle>
						<CardDescription>
							Your account details and information
						</CardDescription>
					</CardHeader>
					<div className="p-6 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input id="name" value={user.name} readOnly className="mt-1" />
							</div>
							<div>
								<Label htmlFor="email">Email</Label>
								<Input id="email" value={user.email || "Not set"} readOnly className="mt-1" />
							</div>
							<div>
								<Label htmlFor="role">Role</Label>
								<Input id="role" value={user.role} readOnly className="mt-1" />
							</div>
							<div>
								<Label htmlFor="created">Account Created</Label>
								<Input
									id="created"
									value={new Date(user.createdAt).toLocaleDateString()}
									readOnly
									className="mt-1"
								/>
							</div>
						</div>
					</div>
				</Card>

				{/* Security Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="size-5" />
							Security Settings
						</CardTitle>
						<CardDescription>
							Manage your password and uCaptcha JWT secret
						</CardDescription>
					</CardHeader>
					<div className="p-6 space-y-4">
						<div className="flex flex-col sm:flex-row gap-4">
							<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
								<DialogTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2">
										<Key className="size-4" />
										Change Password
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Change Password</DialogTitle>
										<DialogDescription>
											Enter your current password and a new password to update your account.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4">
										<div>
											<Label htmlFor="current-password">Current Password</Label>
											<div className="relative">
												<Input
													id="current-password"
													type={showPassword ? "text" : "password"}
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
													className="mt-1 pr-10"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
												</Button>
											</div>
										</div>
										<div>
											<Label htmlFor="new-password">New Password</Label>
											<div className="relative">
												<Input
													id="new-password"
													type={showNewPassword ? "text" : "password"}
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
													className="mt-1 pr-10"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2"
													onClick={() => setShowNewPassword(!showNewPassword)}
												>
													{showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
												</Button>
											</div>
										</div>
										<div>
											<Label htmlFor="confirm-password">Confirm New Password</Label>
											<Input
												id="confirm-password"
												type="password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className="mt-1"
											/>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
											Cancel
										</Button>
										<Button onClick={handlePasswordChange}>
											Change Password
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Dialog open={showJwtDialog} onOpenChange={setShowJwtDialog}>
								<DialogTrigger asChild>
									<Button variant="outline" className="flex items-center gap-2">
										<Shield className="size-4" />
										Manage uCaptcha JWT Secret
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl">
									<DialogHeader>
										<DialogTitle>uCaptcha JWT Secret Management</DialogTitle>
										<DialogDescription className="flex items-start gap-2">
											<AlertTriangle className="size-4 text-yellow-600 mt-0.5 flex-shrink-0" />
											<span>
												This secret is used to sign challenge JWTs for uCaptcha verification.
												Keep it secure and store it safely. Regenerating will invalidate all existing challenge tokens.
											</span>
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4">
										<div>
											<Label>Current JWT Secret</Label>
											<div className="mt-1 flex gap-2">
												<div className="flex-1 p-3 rounded-md font-mono text-xs break-all max-h-32 overflow-y-auto">
													{showJwtSecret ? user.jwtSecret : "•".repeat(Math.min(user.jwtSecret.length, 64))}
												</div>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => setShowJwtSecret(!showJwtSecret)}
												>
													{showJwtSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
												</Button>
											</div>
										</div>
										{newJwtSecret && (
											<div>
												<Label className="text-green-700">New JWT Secret (after regeneration)</Label>
												<div className="mt-1 p-3 bg-green-100 rounded-md font-mono text-xs break-all max-h-32 overflow-y-auto">
													{newJwtSecret}
												</div>
											</div>
										)}
										<div className="flex gap-2">
											<Button
												variant="outline"
												onClick={copyJwtSecretToClipboard}
												className="flex items-center gap-2"
											>
												<Copy className="size-4" />
												Copy Secret
											</Button>
											<Button
												onClick={handleJwtSecretRegenerate}
												className="flex items-center gap-2"
												variant="destructive"
											>
												<RefreshCw className="size-4" />
												Regenerate Secret
											</Button>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setShowJwtDialog(false)}>
											Close
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}