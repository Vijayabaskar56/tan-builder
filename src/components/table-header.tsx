import {
	ChevronDownIcon,
	HeartIcon,
	ListIcon,
	SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import useTableStore from "@/hooks/use-table-store";
import { TableBuilderService } from "@/services/table-builder.service";
import TableCodeDialog from "./table-code-dialog";
import DataUploadDialog from "./table-components/table-data-upload-dialog";
import { AnimatedIconButton } from "./ui/animated-icon-button";
import { RotateCWIcon } from "./ui/rotate-cw";
import { ShareIcon } from "./ui/share";

export default function TableHeader() {
	const tableData = useTableStore();
	const frameworks = ["react", "vue", "svelte", "angular"];

	// Save dialog state
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [saveTableName, setSaveTableName] = useState("");

	const resetTable = () => {
		TableBuilderService.resetTable();
	};

	const handleSaveTable = () => {
		if (saveTableName.trim()) {
			const success = TableBuilderService.saveTableTemplate(
				saveTableName.trim(),
			);
			if (success) {
				toast("Table saved successfully");
				setSaveDialogOpen(false);
				setSaveTableName("");
			} else {
				toast("Failed to save table");
			}
		}
	};

	const togglePagination = () => {
		TableBuilderService.updateSetting(
			"enablePagination",
			!tableData.settings.enablePagination,
		);
	};

	const updateTableLayoutSetting = (key: string, value: boolean | string) => {
		TableBuilderService.updateTableLayoutSetting(key, value);
	};

	const handleShare = () => {
		const shareData = {
			tableName: tableData.tableName,
			settings: tableData.settings,
			table: { columns: tableData.table.columns },
		};
		const baseUri = import.meta.env.DEV
			? "http://localhost:3000"
			: "https://tan-form-builder.baskar.dev";
		navigator.clipboard.writeText(
			`${baseUri}/table-builder?share=${encodeURIComponent(JSON.stringify(shareData))}`,
		);
		toast("Link Copied to clipboard");
	};

	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-auto lg:h-14 border-b items-center mx-3 flex-col lg:flex-row justify-end">
				{/* Actions section */}
				<ScrollArea className="md:w-fit w-full py-2 order-1 lg:order-2">
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<AnimatedIconButton
									icon={<ChevronDownIcon className="w-4 h-4 ml-1" />}
									text={
										frameworks[0].charAt(0).toUpperCase() +
										frameworks[0].slice(1)
									}
									variant="ghost"
									size="sm"
									iconPosition="end"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{frameworks.map((framework) => (
									<DropdownMenuItem
										key={framework}
										disabled={framework !== "react"}
										// onClick={() =>
										// 	actions.setFramework(framework as Framework)
										// }
									>
										{framework.charAt(0).toUpperCase() + framework.slice(1)}
										{framework !== "react" && (
											<p className="text-primary">soon!</p>
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="h-4 w-px bg-border" />
						<DataUploadDialog />
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<RotateCWIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Reset Table</span>}
							variant="ghost"
							onClick={resetTable}
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<ShareIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Share</span>}
							variant="ghost"
							onClick={handleShare}
						/>
						<div className="h-4 w-px bg-border" />
						{/* <AnimatedIconButton
						//TODO: Infinite scroll Feature
							icon={<ListIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Pagination</span>}
							variant={
								tableData.settings.enablePagination ? "default" : "ghost"
							}
							onClick={togglePagination}
						/>
						<div className="h-4 w-px bg-border" /> */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<AnimatedIconButton
									icon={<SettingsIcon className="w-4 h-4 mr-1" />}
									text={
										<span className="hidden xl:block ml-1">
											Header Settings
										</span>
									}
									variant="ghost"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								<DropdownMenuLabel>Table Layout</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label htmlFor="dense" className="text-sm font-normal">
											Dense
										</Label>
										<Switch
											id="dense"
											checked={tableData.settings.tableLayout?.dense ?? false}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("dense", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label htmlFor="cellBorder" className="text-sm font-normal">
											Cell Border
										</Label>
										<Switch
											id="cellBorder"
											checked={
												tableData.settings.tableLayout?.cellBorder ?? false
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("cellBorder", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label htmlFor="rowBorder" className="text-sm font-normal">
											Row Border
										</Label>
										<Switch
											id="rowBorder"
											checked={
												tableData.settings.tableLayout?.rowBorder ?? true
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("rowBorder", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label htmlFor="rowRounded" className="text-sm font-normal">
											Row Rounded
										</Label>
										<Switch
											id="rowRounded"
											checked={
												tableData.settings.tableLayout?.rowRounded ?? false
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("rowRounded", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label htmlFor="stripped" className="text-sm font-normal">
											Striped
										</Label>
										<Switch
											id="stripped"
											checked={
												tableData.settings.tableLayout?.stripped ?? false
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("stripped", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label
											htmlFor="headerBorder"
											className="text-sm font-normal"
										>
											Header Border
										</Label>
										<Switch
											id="headerBorder"
											checked={
												tableData.settings.tableLayout?.headerBorder ?? true
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("headerBorder", checked)
											}
										/>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center justify-between"
										onClick={(e) => e.stopPropagation()}
									>
										<Label
											htmlFor="headerSticky"
											className="text-sm font-normal"
										>
											Header Sticky
										</Label>
										<Switch
											id="headerSticky"
											checked={
												tableData.settings.tableLayout?.headerSticky ?? false
											}
											onCheckedChange={(checked) =>
												updateTableLayoutSetting("headerSticky", checked)
											}
										/>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="h-4 w-px bg-border" />

						<ResponsiveDialog
							open={saveDialogOpen}
							onOpenChange={setSaveDialogOpen}
						>
							<ResponsiveDialogTrigger asChild>
								<AnimatedIconButton
									icon={<HeartIcon className="w-4 h-4 mr-1" />}
									text={<span className="hidden xl:block ml-1">Save</span>}
									variant="ghost"
									size="sm"
								/>
							</ResponsiveDialogTrigger>

							<ResponsiveDialogContent>
								<div className="m-5">
									<ResponsiveDialogHeader>
										<ResponsiveDialogTitle>Save Table</ResponsiveDialogTitle>
										<ResponsiveDialogDescription>
											Enter a name for your table to save it for later use.
										</ResponsiveDialogDescription>
									</ResponsiveDialogHeader>
									<div className="space-y-4 mt-4">
										<div>
											<Label className="mb-4" htmlFor="table_name">
												Table Name
											</Label>
											<Input
												id="table_name"
												placeholder="Enter table name..."
												value={saveTableName}
												onChange={(e) => setSaveTableName(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSaveTable();
													}
												}}
											/>
										</div>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												onClick={() => {
													setSaveDialogOpen(false);
													setSaveTableName("");
												}}
											>
												Cancel
											</Button>
											<Button
												onClick={handleSaveTable}
												disabled={!saveTableName.trim()}
											>
												Save
											</Button>
										</div>
									</div>
								</div>
							</ResponsiveDialogContent>
						</ResponsiveDialog>

						<div className="h-4 w-px bg-border" />
						<TableCodeDialog />
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</header>
	);
}
