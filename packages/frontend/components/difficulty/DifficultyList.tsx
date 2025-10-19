"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DifficultyConfigWithRelations } from "@shared/db/core/difficulty";

interface DifficultyListProps {
	difficultyConfigs: DifficultyConfigWithRelations[];
	selectedSiteId?: number;
	selectedSiteName?: string;
	onEdit: (config: DifficultyConfigWithRelations) => void;
	onDelete: (config: DifficultyConfigWithRelations) => void;
}

export function DifficultyList({
	difficultyConfigs,
	selectedSiteId,
	selectedSiteName,
	onEdit,
	onDelete
}: DifficultyListProps) {
	// Group difficulty configs by site
	const configsBySite = difficultyConfigs.reduce(
		(acc, config) => {
			if (!acc[config.siteID]) {
				acc[config.siteID] = [];
			}
			acc[config.siteID].push(config);
			return acc;
		},
		{} as Record<number, DifficultyConfigWithRelations[]>
	);

	// If a specific site is selected, only show that site
	const sitesToShow = selectedSiteId ? [selectedSiteId] : Object.keys(configsBySite).map(Number);

	return (
		<div className="mt-6 space-y-6">
			{sitesToShow.length === 0 ? (
				<Card>
					<CardContent>
						<div className="text-center text-muted-foreground">
							No difficulty configurations found. Create your first configuration to
							get started.
						</div>
					</CardContent>
				</Card>
			) : (
				sitesToShow.map((siteId) => {
					const siteConfigs = configsBySite[siteId] || [];
					const siteName = selectedSiteName;

					// Separate default config (no resource) and resource-specific configs
					const defaultConfig = siteConfigs.find((config) => config.resourceID === null);
					const resourceConfigs = siteConfigs.filter(
						(config) => config.resourceID !== null
					);

					if (resourceConfigs.length === 0) {
						return (
							<div className="space-y-4">
								<h2 className="text-2xl font-semibold">{siteName}</h2>
								<Card>
									<CardContent>
										<div className="text-center text-muted-foreground">
											No difficulty configurations found. Create your first
											configuration to get started.
										</div>
									</CardContent>
								</Card>
							</div>
						);
					}

					return (
						<div key={siteId} className="space-y-4">
							<h2 className="text-2xl font-semibold">{siteName}</h2>

							{/* Resource-specific Configurations */}
							<div className="space-y-4">
								<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
									{/* Default Configuration */}
									{defaultConfig && (
										<Card className="gap-0">
											<CardHeader>
												<div className="flex justify-between items-start">
													<div>
														<CardTitle>Default Configuration</CardTitle>
													</div>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => onEdit(defaultConfig)}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => onDelete(defaultConfig)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div>
														<strong>Default Difficulty:</strong>{" "}
														{defaultConfig.difficultyConfig.default}
													</div>
													<div>
														<strong>Custom Rules:</strong>{" "}
														{
															defaultConfig.difficultyConfig.custom
																.length
														}{" "}
														rules
													</div>
												</div>
											</CardContent>
										</Card>
									)}
									{resourceConfigs.map((config) => (
										<Card key={config.id} className="gap-0">
											<CardHeader>
												<div className="flex justify-between items-start">
													<div>
														<CardTitle>
															{config.resourceName ||
																`Resource ${config.resourceID}`}
														</CardTitle>
													</div>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => onEdit(config)}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => onDelete(config)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div>
														<strong>Default Difficulty:</strong>{" "}
														{config.difficultyConfig.default}
													</div>
													<div>
														<strong>Custom Rules:</strong>{" "}
														{config.difficultyConfig.custom.length}{" "}
														rules
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
