import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Resource } from "@shared/db/core/schema";

interface ResourceWithSite extends Resource {
	siteName: string;
}

interface ResourcesListProps {
	resources: ResourceWithSite[];
	selectedSiteId?: number;
	onEdit: (resource: ResourceWithSite) => void;
	onDelete: (resource: ResourceWithSite) => void;
}

export function ResourcesList({ resources, selectedSiteId, onEdit, onDelete }: ResourcesListProps) {
	return (
		<div className="mt-6 grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
			{resources.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							No resources found.{" "}
							{selectedSiteId ? "Try changing the filter or " : ""}Create your first
							resource to get started.
						</div>
					</CardContent>
				</Card>
			) : (
				resources.map((resource) => (
					<Card key={resource.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle>{resource.name}</CardTitle>
									<CardDescription className="mt-2">
										Site: {resource.siteName}
										<br />
										Created: {new Date(resource.createdAt).toLocaleDateString()}
									</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => onEdit(resource)}
									>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onDelete(resource)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
					</Card>
				))
			)}
		</div>
	);
}
