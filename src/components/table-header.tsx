import { CodeIcon, ListIcon, SettingsIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import useTableStore from "@/hooks/use-table-store";
import { TableBuilderService } from "@/services/table-builder.service";
import DataUploadDialog from "./table-components/table-data-upload-dialog";
import { AnimatedIconButton } from "./ui/animated-icon-button";
import { RotateCWIcon } from "./ui/rotate-cw";
import { ShareIcon } from "./ui/share";
import useTableStore from "@/hooks/use-table-store";
import DataUploadDialog from "./table-components/table-data-upload-dialog";

export default function TableHeader() {
	const tableData = useTableStore();

	const resetTable = () => {
		TableBuilderService.resetTable();
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

	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-auto lg:h-14 border-b items-center mx-3 flex-col lg:flex-row justify-end">
				{/* Actions section */}
				<ScrollArea className="md:w-fit w-full py-2 order-1 lg:order-2">
					<div className="flex items-center gap-2">
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
							disabled
						/>
						<div className="h-4 w-px bg-border" />
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<ListIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Pagination</span>}
							variant={
								tableData.settings.enablePagination ? "default" : "ghost"
							}
							onClick={togglePagination}
						/>
						<div className="h-4 w-px bg-border" />
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
						<AnimatedIconButton
							icon={<CodeIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Code</span>}
							variant="ghost"
							disabled
						/>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</header>
	);
}
