import type { Column } from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowLeft,
	ArrowLeftToLine,
	ArrowRight,
	ArrowRightToLine,
	ArrowUp,
	Check,
	ChevronsUpDown,
	PinOff,
	Settings2,
} from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useDataGrid } from "@/components/ui/data-grid";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/utils";

interface DataGridColumnHeaderProps<TData, TValue>
	extends HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title?: string;
	icon?: ReactNode;
	pinnable?: boolean;
	filter?: ReactNode;
	visibility?: boolean;
}

function DataGridColumnHeader<TData, TValue>({
	column,
	title = "",
	icon,
	className,
	filter,
	visibility = false,
}: DataGridColumnHeaderProps<TData, TValue>) {
	const { isLoading, table, props, recordCount } = useDataGrid();

	// Hoist state reads to render time for React Compiler
	const currentColumnOrder = table.getState().columnOrder;
	const currentIndex = currentColumnOrder.indexOf(column.id);
	const isPinned = column.getIsPinned();
	const isSorted = column.getIsSorted();
	const canSort = column.getCanSort();
	const canPin = column.getCanPin();
	const canMove = props.tableLayout?.columnsMovable;
	const canMoveLeft = currentIndex > 0;
	const canMoveRight = currentIndex < currentColumnOrder.length - 1;

	const moveColumn = (direction: "left" | "right") => {
		// Use hoisted values instead of reading state inside callback
		if (direction === "left" && canMoveLeft) {
			const newOrder = [...currentColumnOrder];
			const [movedColumn] = newOrder.splice(currentIndex, 1);
			newOrder.splice(currentIndex - 1, 0, movedColumn);
			table.setColumnOrder(newOrder);
		}

		if (direction === "right" && canMoveRight) {
			const newOrder = [...currentColumnOrder];
			const [movedColumn] = newOrder.splice(currentIndex, 1);
			newOrder.splice(currentIndex + 1, 0, movedColumn);
			table.setColumnOrder(newOrder);
		}
	};

	// Determine which rendering mode to use
	const hasControls =
		canMove ||
		(props.tableLayout?.columnsVisibility && visibility) ||
		(props.tableLayout?.columnsPinnable && canPin) ||
		filter;

	const hasInteractivity =
		canSort || (props.tableLayout?.columnsResizable && column.getCanResize());

	// Simple label (no interactivity)
	if (!hasControls && !hasInteractivity) {
		return (
			<div
				className={cn(
					"text-secondary-foreground/80 font-normal inline-flex h-full items-center gap-1.5 text-[0.8125rem] leading-[calc(1.125/0.8125)] [&_svg]:size-3.5 [&_svg]:opacity-60",
					className,
				)}
			>
				{icon && icon}
				{title}
			</div>
		);
	}

	// Sortable button (no dropdown controls)
	if (!hasControls && hasInteractivity) {
		return (
			<div className="flex items-center h-full">
				<Button
					variant="ghost"
					className={cn(
						"text-secondary-foreground/80 rounded-md font-normal -ms-2 px-2 h-7 hover:bg-secondary data-[state=open]:bg-secondary hover:text-foreground data-[state=open]:text-foreground",
						className,
					)}
					disabled={isLoading || recordCount === 0}
					onClick={() => {
						if (isSorted === "asc") {
							column.toggleSorting(true);
						} else if (isSorted === "desc") {
							column.clearSorting();
						} else {
							column.toggleSorting(false);
						}
					}}
				>
					{icon && icon}
					{title}

					{canSort &&
						(isSorted === "desc" ? (
							<ArrowDown className="size-[0.7rem]! mt-px" />
						) : isSorted === "asc" ? (
							<ArrowUp className="size-[0.7rem]! mt-px" />
						) : (
							<ChevronsUpDown className="size-[0.7rem]! mt-px" />
						))}
				</Button>
			</div>
		);
	}

	// Full controls with dropdown menu
	return (
		<div className="flex items-center h-full gap-1.5 justify-between">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							"text-secondary-foreground/80 rounded-md font-normal -ms-2 px-2 h-7 hover:bg-secondary data-[state=open]:bg-secondary hover:text-foreground data-[state=open]:text-foreground",
							className,
						)}
						disabled={isLoading || recordCount === 0}
						onClick={() => {
							if (isSorted === "asc") {
								column.toggleSorting(true);
							} else if (isSorted === "desc") {
								column.clearSorting();
							} else {
								column.toggleSorting(false);
							}
						}}
					>
						{icon && icon}
						{title}

						{canSort &&
							(isSorted === "desc" ? (
								<ArrowDown className="size-[0.7rem]! mt-px" />
							) : isSorted === "asc" ? (
								<ArrowUp className="size-[0.7rem]! mt-px" />
							) : (
								<ChevronsUpDown className="size-[0.7rem]! mt-px" />
							))}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-40" align="start">
					{filter && <DropdownMenuLabel>{filter}</DropdownMenuLabel>}

					{filter && (canSort || canPin || visibility) && (
						<DropdownMenuSeparator />
					)}

					{canSort && (
						<>
							<DropdownMenuItem
								onClick={() => {
									if (isSorted === "asc") {
										column.clearSorting();
									} else {
										column.toggleSorting(false);
									}
								}}
								disabled={!canSort}
							>
								<ArrowUp className="size-3.5!" />
								<span className="grow">Asc</span>
								{isSorted === "asc" && (
									<Check className="size-4 opacity-100! text-primary" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									if (isSorted === "desc") {
										column.clearSorting();
									} else {
										column.toggleSorting(true);
									}
								}}
								disabled={!canSort}
							>
								<ArrowDown className="size-3.5!" />
								<span className="grow">Desc</span>
								{isSorted === "desc" && (
									<Check className="size-4 opacity-100! text-primary" />
								)}
							</DropdownMenuItem>
						</>
					)}

					{(filter || canSort) && (canSort || canPin || visibility) && (
						<DropdownMenuSeparator />
					)}

					{props.tableLayout?.columnsPinnable && canPin && (
						<>
							<DropdownMenuItem
								onClick={() =>
									column.pin(isPinned === "left" ? false : "left")
								}
							>
								<ArrowLeftToLine className="size-3.5!" aria-hidden="true" />
								<span className="grow">Pin to left</span>
								{isPinned === "left" && (
									<Check className="size-4 opacity-100! text-primary" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									column.pin(isPinned === "right" ? false : "right")
								}
							>
								<ArrowRightToLine className="size-3.5!" aria-hidden="true" />
								<span className="grow">Pin to right</span>
								{isPinned === "right" && (
									<Check className="size-4 opacity-100! text-primary" />
								)}
							</DropdownMenuItem>
						</>
					)}

					{canMove && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => moveColumn("left")}
								disabled={!canMoveLeft || isPinned !== false}
							>
								<ArrowLeft className="size-3.5!" aria-hidden="true" />
								<span>Move to Left</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => moveColumn("right")}
								disabled={!canMoveRight || isPinned !== false}
							>
								<ArrowRight className="size-3.5!" aria-hidden="true" />
								<span>Move to Right</span>
							</DropdownMenuItem>
						</>
					)}

					{props.tableLayout?.columnsVisibility &&
						visibility &&
						(canSort || canPin || filter) && <DropdownMenuSeparator />}

					{props.tableLayout?.columnsVisibility && visibility && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Settings2 className="size-3.5!" />
								<span>Columns</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									{table
										.getAllColumns()
										.filter(
											(col) =>
												typeof col.accessorFn !== "undefined" &&
												col.getCanHide(),
										)
										.map((col) => {
											return (
												<DropdownMenuCheckboxItem
													key={col.id}
													checked={col.getIsVisible()}
													onSelect={(event) => event.preventDefault()}
													onCheckedChange={(value) =>
														col.toggleVisibility(!!value)
													}
													className="capitalize"
												>
													{col.columnDef.meta?.headerTitle || col.id}
												</DropdownMenuCheckboxItem>
											);
										})}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{props.tableLayout?.columnsPinnable && canPin && isPinned && (
				<Button
					mode="icon"
					size="sm"
					variant="ghost"
					className="-me-1 size-7 rounded-md"
					onClick={() => column.pin(false)}
					aria-label={`Unpin ${title} column`}
					title={`Unpin ${title} column`}
				>
					<PinOff className="size-3.5! opacity-50!" aria-hidden="true" />
				</Button>
			)}
		</div>
	);
}

export { DataGridColumnHeader, type DataGridColumnHeaderProps };
