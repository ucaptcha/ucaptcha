import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Site } from "@shared/db/core/schema";

interface CreateResourceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	resourceName: string;
	onResourceNameChange: (name: string) => void;
	selectedSiteId: number | "all";
	onSiteIdChange: (siteID: number | "all") => void;
	sites: Site[];
	onCreate: () => void;
}

export function CreateResourceDialog({
	open,
	onOpenChange,
	resourceName,
	onResourceNameChange,
	selectedSiteId,
	onSiteIdChange,
	sites,
	onCreate
}: CreateResourceDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Resource</DialogTitle>
					<DialogDescription>Add a new resource to a site</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label className="mb-2" htmlFor="createResourceName">
							Resource Name
						</Label>
						<Input
							id="createResourceName"
							value={resourceName}
							onChange={(e) => onResourceNameChange(e.target.value)}
							placeholder="Enter resource name"
						/>
					</div>
					<div>
						<Label className="mb-2" htmlFor="createResourceSite">
							Site
						</Label>
						<Select
							value={selectedSiteId?.toString() || "all"}
							onValueChange={(value) =>
								onSiteIdChange(isNaN(parseInt(value)) ? "all" : parseInt(value))
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Sites</SelectItem>
								{sites.map((site) => (
									<SelectItem key={site.id} value={site.id.toString()}>
										{site.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onCreate} disabled={!resourceName.trim() || !selectedSiteId}>
						Create Resource
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							onResourceNameChange("");
							onSiteIdChange("all");
						}}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
