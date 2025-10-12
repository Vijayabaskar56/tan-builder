import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Database, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

import { NotFound } from "@/components/not-found";
import { TableColumnEdit } from "@/components/table-components/table-column-edit";
import { TableTemplates } from "@/components/table-components/table-templates";
import { TableSettingsSidebar } from "@/components/builder/TableSettingsSidebar";
import TableHeader from "@/components/table-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { useScreenSize } from "@/hooks/use-screen-size";
import useTableStore from "@/hooks/use-table-store";
import { cn } from "@/lib/utils";
import { SettingsGearIcon } from "@/components/ui/settings-gear";
import { AnimatedIconButton } from "@/components/ui/animated-icon-button";
import { BlocksIcon } from "@/components/ui/blocks";
import { LayoutPanelTopIcon } from "@/components/ui/layout-panel-top";

const initializeTableStore = createClientOnlyFn(async () => {
	if (typeof window !== "undefined") {
		// Clear old data to force re-initialization with new schema
		localStorage.removeItem("table-builder");
		const existing = tableBuilderCollection.get(1);
		if (!existing) {
			tableBuilderCollection.insert([
				{
					id: 1,
					settings: {
						isGlobalSearch: true,
						enableHiding: true,
						enableSorting: true,
						enableResizing: true,
						enablePinning: true,
					},
					table: {
						columns: [],
						data: [],
					},
				},
			]);
		}
	} else {
		console.log("tableBuilderCollection is undefined");
	}
});

export const Route = createFileRoute("/table-builder")({
	component: RouteComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: false,
});

function RouteComponent() {
	// Sidebar width used only on md+ screens
	const [sidebarWidth, setSidebarWidth] = useState(400); // Increased default width
	const [isResizing, setIsResizing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const screenSize = useScreenSize();
	const isMdUp = screenSize.greaterThanOrEqual("md");
	const tableBuilder = useTableStore();

	const [isTableBuilderInitialized, setIsTableBuilderInitialized] =
		useState(false);
	useEffect(() => {
		initializeTableStore();
		setIsTableBuilderInitialized(true);
	}, []);

	// On breakpoint changes, set sensible defaults:
	// - tablet/mobile (<md): collapse to min (200px)
	// - laptop/desktop (>=md): default to 1/3 of available width
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const containerRect = container.getBoundingClientRect();
		const minWidth = 300;
		if (!isMdUp) {
			setSidebarWidth(minWidth);
		} else {
			const oneThird = Math.floor(containerRect.width * 0.2);
			setSidebarWidth(Math.max(minWidth, oneThird));
		}
	}, [isMdUp]);

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsResizing(true);
		e.preventDefault();
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizing || !containerRef.current || !isMdUp) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const newWidth = e.clientX - containerRect.left;
		const minWidth = 200;
		const maxWidth = containerRect.width * 0.5; // Maximum 1/2 of screen width

		setSidebarWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
	};

	const handleMouseUp = () => {
		setIsResizing(false);
	};

	// Add event listeners for mouse move and up
	useEffect(() => {
		if (isResizing && isMdUp) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};
		}
	}, [isResizing, isMdUp]);

	if (!isTableBuilderInitialized) {
		return <Spinner />;
	}
	console.log(tableBuilder);
	return (
		<main className="w-full h-full flex flex-col">
			{isMdUp ? (
				<div
					ref={containerRef}
					className="flex w-full flex-1 min-h-0 min-w-0 flex-col md:flex-row"
				>
					{/* Left Sidebar */}
					<div
						className="flex-shrink-0 border-b md:border-b-0 md:border-r"
						style={isMdUp ? { width: `${sidebarWidth}px` } : { width: "100%" }}
					>
						{isMdUp ? (
							<ScrollArea className="h-full">
								<div className="p-4">
									<Tabs defaultValue="columns" className="w-full">
										<TabsList className="mb-3 w-full justify-center">
											<TabsTrigger value="columns">
												<AnimatedIconButton
													renderAs="span"
													icon={
														<BlocksIcon
															className="-ms-0.5 me-1.5 opacity-60"
															size={16}
														/>
													}
													className="flex"
													text={
														(isMdUp && sidebarWidth > 350) || !isMdUp ? (
															<span className="ml-1">Builder</span>
														) : (
															""
														)
													}
												/>
											</TabsTrigger>
											<TabsTrigger value="templates">
												<AnimatedIconButton
													renderAs="span"
													icon={
														<LayoutPanelTopIcon
															className="-ms-0.5 me-1.5 opacity-60"
															size={16}
														/>
													}
													className="flex"
													text={
														(isMdUp && sidebarWidth > 350) || !isMdUp ? (
															<span className="ml-1">Templates</span>
														) : (
															""
														)
													}
												/>
											</TabsTrigger>
											<TabsTrigger value="settings">
												<AnimatedIconButton
													renderAs="span"
													icon={
														<SettingsGearIcon
															className="-ms-0.5 me-1.5 opacity-60"
															size={16}
														/>
													}
													className="flex"
													text={
														(isMdUp && sidebarWidth > 350) || !isMdUp ? (
															<span className="ml-1">Settings</span>
														) : (
															""
														)
													}
												/>
											</TabsTrigger>
										</TabsList>
										<TabsContent value="columns" className="mt-4">
											<div className="w-full">
												<TableColumnEdit />
											</div>
										</TabsContent>
										<TabsContent value="templates" className="mt-4">
											<TableTemplates />
										</TabsContent>
										<TabsContent value="settings" className="mt-4">
											<TableSettingsSidebar />
										</TabsContent>
									</Tabs>
								</div>
							</ScrollArea>
						) : (
							<div>
								{/* Global Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Settings className="h-4 w-4" />
											Global Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Table Name
												</label>
												<input
													type="text"
													placeholder="Enter table name"
													className="w-full px-2 py-1 text-xs border rounded"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Description
												</label>
												<textarea
													placeholder="Enter description"
													className="w-full px-2 py-1 text-xs border rounded resize-none"
													rows={2}
												/>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Row Level Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Database className="h-4 w-4" />
											Row Level Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Row Height
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Compact</option>
													<option>Normal</option>
													<option>Comfortable</option>
												</select>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Selection Mode
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Single</option>
													<option>Multiple</option>
													<option>None</option>
												</select>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						)}
					</div>

					{/* Resize Handle (desktop/tablet only) */}
					{isMdUp && (
						<div
							className={cn(
								"w-1 bg-border/70 hover:bg-primary/30 active:bg-primary/40 cursor-col-resize flex-shrink-0 transition-colors relative group touch-pan-y select-none",
								isResizing && "bg-primary/30",
							)}
							aria-label="Resize sidebar"
							role="separator"
							onMouseDown={handleMouseDown}
							onTouchStart={(e) => {
								// Allow touch dragging on larger touch devices
								setIsResizing(true);
								e.preventDefault();
							}}
						></div>
					)}

					<div className="flex-1 flex min-h-0 min-w-0 flex-col">
						<TableHeader />
						{isMdUp ? (
							<ScrollArea className="flex-1 min-h-0 min-w-0">
								<Outlet />
							</ScrollArea>
						) : (
							<div>
								<Outlet />
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col h-full">
					<TableHeader />
					<ScrollArea className="flex-1 min-h-0">
						<div
							ref={containerRef}
							className="flex w-full flex-1 min-h-0 flex-col md:flex-row"
						>
							{/* Left Sidebar */}
							<div
								className="flex-shrink-0 border-b md:border-b-0 md:border-r"
								style={
									isMdUp ? { width: `${sidebarWidth}px` } : { width: "100%" }
								}
							>
								<div className="p-4">
									<Tabs defaultValue="columns" className="w-full">
										<ScrollArea className="w-full">
											<TabsList className="mb-3 w-full justify-center">
												<TabsTrigger value="columns">
													<AnimatedIconButton
														renderAs="span"
														icon={
															<BlocksIcon
																className="-ms-0.5 me-1.5 opacity-60"
																size={16}
															/>
														}
														className="flex"
														text={
															(isMdUp && sidebarWidth > 200) || !isMdUp ? (
																<span className="ml-1">Builder</span>
															) : (
																""
															)
														}
													/>
												</TabsTrigger>
												<TabsTrigger value="templates">
													<AnimatedIconButton
														renderAs="span"
														icon={
															<LayoutPanelTopIcon
																className="-ms-0.5 me-1.5 opacity-60"
																size={16}
															/>
														}
														className="flex"
														text={
															(isMdUp && sidebarWidth > 200) || !isMdUp ? (
																<span className="ml-1">Templates</span>
															) : (
																""
															)
														}
													/>
												</TabsTrigger>
												<TabsTrigger value="settings">
													<AnimatedIconButton
														renderAs="span"
														icon={
															<SettingsGearIcon
																className="-ms-0.5 me-1.5 opacity-60"
																size={16}
															/>
														}
														className="flex"
														text={
															(isMdUp && sidebarWidth > 200) || !isMdUp ? (
																<span className="ml-1">Settings</span>
															) : (
																""
															)
														}
													/>
												</TabsTrigger>
											</TabsList>
											<ScrollBar orientation="horizontal" />
										</ScrollArea>
										<TabsContent value="columns" className="mt-4">
											<div className="w-full">
												<TableColumnEdit />
											</div>
										</TabsContent>
										<TabsContent value="templates" className="mt-4">
											<TableTemplates />
										</TabsContent>
										<TabsContent value="settings" className="mt-4">
											<TableSettingsSidebar />
										</TabsContent>
									</Tabs>
								</div>
							</div>

							{/* Content area */}
							<div className="flex-1 flex min-h-0 flex-col">
								<div>
									<Outlet />
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>
			)}
		</main>
	);
}
