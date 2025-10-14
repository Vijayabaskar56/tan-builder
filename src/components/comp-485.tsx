import React, {
	CSSProperties,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Cell,
	Column,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Header,
	PaginationState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import {
	ArrowLeftToLineIcon,
	ArrowRightToLineIcon,
	ChevronDownIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CircleAlertIcon,
	CircleXIcon,
	Columns3Icon,
	EllipsisIcon,
	GripVerticalIcon,
	ListFilterIcon,
	PinOffIcon,
	TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { generateColumns } from "@/lib/table-generator/generate-columns";
import { JsonData } from "@/types/table-types";
import { DataTableSliderFilter } from "@/components/ui/data-table-slider-filter";
import { DataTableDateFilter } from "@/components/ui/data-table-date-filter";

// Helper function to compute pinning styles for columns
const getPinningStyles = (column: Column<any>): CSSProperties => {
	const isPinned = column.getIsPinned();
	return {
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		position: isPinned ? "sticky" : "relative",
		width: `var(--col-${column.id}-size)`,
		zIndex: isPinned ? 1 : 0,
	};
};
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useTableStore from "@/hooks/use-table-store";

const DraggableTableHeader = ({
	header,
	enableDraggable,
}: {
	header: Header<JsonData, unknown>;
	enableDraggable: boolean;
}) => {
	// Check if this column should be draggable (not select or actions)
	const isDraggable =
		enableDraggable &&
		header.column.id !== "select" &&
		header.column.id !== "actions";

	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: header.column.id,
	});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		whiteSpace: "nowrap",
		zIndex: isDragging ? 1 : 0,
	};

	const { column } = header;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	// For non-draggable columns (select, actions), render simple header
	if (!isDraggable) {
		return (
			<TableHead
				key={header.id}
				className="relative h-10 truncate border-t"
				style={{ width: `calc(var(--header-${header.id}-size) * 1px)` }}
			>
				<div className="flex items-center justify-center">
					{flexRender(header.column.columnDef.header, header.getContext())}
				</div>
				{/* Resize handle - only for resizable columns */}
				{header.column.getCanResize() && (
					<div
						{...{
							onDoubleClick: () => header.column.resetSize(),
							onMouseDown: header.getResizeHandler(),
							onTouchStart: header.getResizeHandler(),
							className:
								"absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
						}}
					/>
				)}
			</TableHead>
		);
	}

	// For draggable columns, render with full functionality
	return (
		<TableHead
			ref={setNodeRef}
			className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
			colSpan={header.colSpan}
			style={{ ...getPinningStyles(column), ...style }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
			aria-sort={
				header.column.getIsSorted() === "asc"
					? "ascending"
					: header.column.getIsSorted() === "desc"
						? "descending"
						: "none"
			}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-0.5">
					{/* Drag handle for draggable columns */}
					{isDraggable && (
						<Button
							size="icon"
							variant="ghost"
							className="-ml-2 size-7 shadow-none"
							{...attributes}
							{...listeners}
							aria-label="Drag to reorder"
						>
							<GripVerticalIcon
								className="opacity-60"
								size={16}
								aria-hidden="true"
							/>
						</Button>
					)}
					{/* Clickable header text with sorting */}
					<div
						className={cn(
							"flex items-center gap-1 select-none",
							header.column.getCanSort() &&
								"cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1",
						)}
						onClick={
							header.column.getCanSort()
								? header.column.getToggleSortingHandler()
								: undefined
						}
						onKeyDown={(e) => {
							// Enhanced keyboard handling for sorting
							if (
								header.column.getCanSort() &&
								(e.key === "Enter" || e.key === " ")
							) {
								e.preventDefault();
								header.column.getToggleSortingHandler()?.(e);
							}
						}}
						tabIndex={header.column.getCanSort() ? 0 : undefined}
					>
						<span className="truncate">
							{header.isPlaceholder
								? null
								: flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
						</span>
						{/* Sort icon next to header text */}
						{header.column.getCanSort() && (
							<div className="shrink-0">
								{{
									asc: (
										<ChevronUpIcon
											className="opacity-60"
											size={16}
											aria-hidden="true"
										/>
									),
									desc: (
										<ChevronDownIcon
											className="opacity-60"
											size={16}
											aria-hidden="true"
										/>
									),
								}[header.column.getIsSorted() as string] ?? (
									<ChevronUpIcon
										className="opacity-0 group-hover:opacity-60"
										size={16}
										aria-hidden="true"
									/>
								)}
							</div>
						)}
					</div>
				</div>
				{/* Pin/Unpin column controls - moved to right edge */}
				{!header.isPlaceholder &&
					header.column.getCanPin() &&
					(header.column.getIsPinned() ? (
						<Button
							size="icon"
							variant="ghost"
							className="size-7 shadow-none"
							onClick={() => header.column.pin(false)}
							aria-label={`Unpin ${header.column.columnDef.header as string} column`}
							title={`Unpin ${header.column.columnDef.header as string} column`}
						>
							<PinOffIcon className="opacity-60" size={16} aria-hidden="true" />
						</Button>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 shadow-none"
									aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
									title={`Pin options for ${header.column.columnDef.header as string} column`}
								>
									<EllipsisIcon
										className="opacity-60"
										size={16}
										aria-hidden="true"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => header.column.pin("left")}>
									<ArrowLeftToLineIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									Stick to left
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => header.column.pin("right")}>
									<ArrowRightToLineIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									Stick to right
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					))}
			</div>
			{/* Resize handle - only for resizable columns */}
			{header.column.getCanResize() && (
				<div
					{...{
						onDoubleClick: () => header.column.resetSize(),
						onMouseDown: header.getResizeHandler(),
						onTouchStart: header.getResizeHandler(),
						className:
							"absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
					}}
				/>
			)}
		</TableHead>
	);
};

const DragAlongCell = ({
	cell,
	enableDraggable,
}: {
	cell: Cell<JsonData, unknown>;
	enableDraggable: boolean;
}) => {
	// Check if this column should be draggable (not select or actions)
	const isDraggable =
		enableDraggable &&
		cell.column.id !== "select" &&
		cell.column.id !== "actions";

	const { isDragging, setNodeRef, transform, transition } = useSortable({
		id: cell.column.id,
	});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 1 : 0,
	};

	const { column } = cell;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	// For non-draggable columns (select, actions), render simple cell
	if (!isDraggable) {
		return (
			<TableCell
				key={cell.id}
				className="h-10 truncate"
				style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
			>
				<div className="flex items-center justify-center">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</div>
			</TableCell>
		);
	}

	// For draggable columns, render with full functionality
	return (
		<TableCell
			ref={setNodeRef}
			className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 h-10 last:py-0 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
			style={{ ...getPinningStyles(column), ...style }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
};

export default function Component485() {
	const id = useId();
	const dndId = useId();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const tableData = useTableStore();
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const [data, setData] = useState<JsonData[]>([]);
	const columns = useMemo(() => {
		// Ensure the first string column is filterable
		const modifiedColumns = tableData.table.columns.map((col, index) => {
			if (
				col.type === "string" &&
				index === tableData.table.columns.findIndex((c) => c.type === "string")
			) {
				return { ...col, filterable: true };
			}
			return col;
		});
		return generateColumns(modifiedColumns, tableData.settings);
	}, [tableData.table.columns, tableData.settings]);

	const filterableStringColumns = useMemo(() => {
		return columns.filter((col) => {
			const meta = col.meta as any;
			return meta?.type === "string" && meta?.filterable;
		});
	}, [columns]);

	const [columnOrder, setColumnOrder] = useState<string[]>([]);

	// Initialize column order when columns change
	useEffect(() => {
		setColumnOrder(columns.map((column) => column.id!));
	}, [columns]);
	useEffect(() => {
		setData(tableData.table.data as JsonData[]);
	}, [tableData.table.data]);

	const handleDeleteRows = () => {
		const selectedRows = table.getSelectedRowModel().rows;
		const updatedData = data.filter(
			(item) => !selectedRows.some((row) => row.original.id === item.id),
		);
		setData(updatedData);
		table.resetRowSelection();
	};

	const table = useReactTable({
		data,
		columns,
		columnResizeMode: "onChange",
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true;
			return filterableStringColumns.some((col) => {
				const value = row.getValue(col.id);
				return value != null
					? String(value).toLowerCase().includes(filterValue.toLowerCase())
					: false;
			});
		},
		onGlobalFilterChange: setGlobalFilter,
		enableColumnPinning: true,
		enableColumnResizing: true,
		enableRowSelection: tableData.settings.enableRowSelection,
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
			columnOrder,
			globalFilter,
		},
		onColumnOrderChange: setColumnOrder,
	});

	/**
	 * Instead of calling `column.getSize()` on every render for every header
	 * and especially every data cell (very expensive),
	 * we will calculate all column sizes at once at the root table level in a useMemo
	 * and pass the column sizes down as CSS variables to the <table> element.
	 */
	const columnSizeVars = useMemo(() => {
		const headers = table.getFlatHeaders();
		const colSizes: { [key: string]: number } = {};
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i];
			colSizes[`--header-${header.id}-size`] = header.getSize();
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
		}
		return colSizes;
	}, [table.getState().columnSizingInfo, table.getState().columnSizing]);

	// reorder columns after drag & drop
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			// Only allow reordering of draggable columns (not select or actions)
			const isActiveDraggable =
				active.id !== "select" && active.id !== "actions";
			const isOverDraggable = over.id !== "select" && over.id !== "actions";

			if (isActiveDraggable && isOverDraggable) {
				setColumnOrder((columnOrder) => {
					const oldIndex = columnOrder.indexOf(active.id as string);
					const newIndex = columnOrder.indexOf(over.id as string);
					return arrayMove(columnOrder, oldIndex, newIndex);
				});
			}
		}
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const enableDraggable = tableData.settings.enableDraggable;

	// Table body component
	const TableBodyComponent = ({ table }: { table: any }) => (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row) => (
					<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
						{enableDraggable
							? row.getVisibleCells().map((cell) => (
									<SortableContext
										key={cell.id}
										items={columnOrder}
										strategy={horizontalListSortingStrategy}
									>
										<DragAlongCell
											key={cell.id}
											cell={cell}
											enableDraggable={enableDraggable}
										/>
									</SortableContext>
								))
							: row
									.getVisibleCells()
									.map((cell) => (
										<DragAlongCell
											key={cell.id}
											cell={cell}
											enableDraggable={enableDraggable}
										/>
									))}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						No results.
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	);

	// Memoized table body for performance during resizing
	const MemoizedTableBody = React.memo(
		TableBodyComponent,
		(prev, next) => prev.table.options.data === next.table.options.data,
	);

	const tableContent = (
		<div className="space-y-4 h-full overflow-auto">
			{/* Filters */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Global search for filterable string columns */}
					{tableData.settings.isGlobalSearch && (
						<div className="relative">
							<Input
								id={`${id}-input`}
								ref={inputRef}
								className={cn(
									"peer min-w-60 ps-9",
									Boolean(globalFilter) && "pe-9",
								)}
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
								placeholder="Filter by searchable columns..."
								type="text"
								aria-label="Filter by searchable columns"
							/>
							<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<ListFilterIcon size={16} aria-hidden="true" />
							</div>
							{Boolean(globalFilter) && (
								<button
									className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
									aria-label="Clear filter"
									onClick={() => {
										setGlobalFilter("");
										if (inputRef.current) {
											inputRef.current.focus();
										}
									}}
								>
									<CircleXIcon size={16} aria-hidden="true" />
								</button>
							)}
						</div>
					)}

					{/* Toggle columns visibility */}
					{tableData.settings.enableHiding && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Columns3Icon
										className="-ms-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
									View
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
												onSelect={(event) => event.preventDefault()}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Column filters */}
					{table
						.getAllColumns()
						.filter((col) => (col.columnDef.meta as any)?.filterable)
						.map((column) => {
							const meta = column.columnDef.meta as any;
							if (meta?.type === "number") {
								return (
									<DataTableSliderFilter
										key={column.id}
										column={column as any}
										title={column.id}
									/>
								);
							}
							if (meta?.type === "date") {
								return (
									<DataTableDateFilter
										key={column.id}
										column={column as any}
										title={column.id}
									/>
								);
							}
							return null;
						})}
				</div>
				<div className="flex items-center gap-3">
					{/* Clear filters button */}
					{(table.getState().columnFilters.length > 0 ||
						Boolean(globalFilter)) && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								table.resetColumnFilters();
								setGlobalFilter("");
							}}
							className="h-8"
						>
							Clear Filters
						</Button>
					)}
					{/* Delete button */}
					{table.getSelectedRowModel().rows.length > 0 && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className="ml-auto" variant="outline">
									<TrashIcon
										className="-ms-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
									Delete
									<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
										{table.getSelectedRowModel().rows.length}
									</span>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
									<div
										className="flex size-9 shrink-0 items-center justify-center rounded-full border"
										aria-hidden="true"
									>
										<CircleAlertIcon className="opacity-80" size={16} />
									</div>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete{" "}
											{table.getSelectedRowModel().rows.length} selected{" "}
											{table.getSelectedRowModel().rows.length === 1
												? "row"
												: "rows"}
											.
										</AlertDialogDescription>
									</AlertDialogHeader>
								</div>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDeleteRows}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</div>
			</div>

			{/* Table */}
			<div
				className="bg-background overflow-hidden rounded-md border"
				style={{ ...columnSizeVars, width: table.getTotalSize() }}
			>
				<Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-muted/50">
								{enableDraggable ? (
									<SortableContext
										items={columnOrder}
										strategy={horizontalListSortingStrategy}
									>
										{headerGroup.headers.map((header) => (
											<DraggableTableHeader
												key={header.id}
												header={header}
												enableDraggable={enableDraggable}
											/>
										))}
									</SortableContext>
								) : (
									headerGroup.headers.map((header) => (
										<DraggableTableHeader
											key={header.id}
											header={header}
											enableDraggable={enableDraggable}
										/>
									))
								)}
							</TableRow>
						))}
					</TableHeader>
					{table.getState().columnSizingInfo.isResizingColumn ? (
						<MemoizedTableBody table={table} />
					) : (
						<TableBodyComponent table={table} />
					)}
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between gap-8">
				{/* Results per page */}
				<div className="flex items-center gap-3">
					<Label htmlFor={id} className="max-sm:sr-only">
						Rows per page
					</Label>
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger id={id} className="w-fit whitespace-nowrap">
							<SelectValue placeholder="Select number of results" />
						</SelectTrigger>
						<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
							{[8, 10, 25, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{/* Page number information */}
				<div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
					<p
						className="text-muted-foreground text-sm whitespace-nowrap"
						aria-live="polite"
					>
						<span className="text-foreground">
							{table.getState().pagination.pageIndex *
								table.getState().pagination.pageSize +
								1}
							-
							{Math.min(
								Math.max(
									table.getState().pagination.pageIndex *
										table.getState().pagination.pageSize +
										table.getState().pagination.pageSize,
									0,
								),
								table.getRowCount(),
							)}
						</span>{" "}
						of{" "}
						<span className="text-foreground">
							{table.getRowCount().toString()}
						</span>
					</p>
				</div>

				{/* Pagination buttons */}
				<div>
					<Pagination>
						<PaginationContent>
							{/* First page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.firstPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to first page"
								>
									<ChevronFirstIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Previous page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to previous page"
								>
									<ChevronLeftIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Next page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to next page"
								>
									<ChevronRightIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Last page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.lastPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to last page"
								>
									<ChevronLastIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);

	if (enableDraggable) {
		return (
			<DndContext
				id={dndId}
				collisionDetection={closestCenter}
				modifiers={[restrictToHorizontalAxis]}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				{tableContent}
			</DndContext>
		);
	}

	return tableContent;
}
