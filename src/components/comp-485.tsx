import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { CircleX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTableDnd } from "@/components/ui/data-grid-table-dnd";
import {
	DataGridTableDndRowHandle,
	DataGridTableDndRows,
} from "@/components/ui/data-grid-table-dnd-rows";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { type Filter, Filters } from "@/components/ui/filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useTableStore from "@/hooks/use-table-store";
import {
	generateColumns,
	generateFilterFields,
} from "@/lib/table-generator/generate-columns";
import type { JsonData } from "@/types/table-types";

export default function Component485() {
	const tableData = useTableStore();
	const [data, setData] = useState<JsonData[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 8,
	});

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnOrder, setColumnOrder] = useState<string[]>([]);
	const [filters, setFilters] = useState<Filter[]>([]);

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

		let finalColumns = generateColumns(modifiedColumns, tableData.settings);

		// Add drag handle column if row dragging is enabled
		if (tableData.settings.enableRowDragging) {
			finalColumns = [
				{
					id: "drag",
					cell: ({ row }) => (
						<DataGridTableDndRowHandle rowId={row.index.toString()} />
					),
					size: 40,
					enableSorting: false,
					enableHiding: false,
				},
				...finalColumns,
			];
		}

		return finalColumns;
	}, [tableData.table.columns, tableData.settings]);

	const filterFields = useMemo(() => {
		return generateFilterFields(tableData.table.columns);
	}, [tableData.table.columns]);

	useEffect(() => {
		setData(tableData.table.data as JsonData[]);
	}, [tableData.table.data]);

	// Apply filters to data - only apply filters with non-empty values
	const filteredData = useMemo(() => {
		let filtered = [...data];

		// Filter out empty filters before applying
		const activeFilters = filters.filter((filter) => {
			const { values } = filter;

			// Check if filter has meaningful values
			if (!values || values.length === 0) return false;

			// For text/string values, check if they're not empty strings
			if (
				values.every(
					(value) => typeof value === "string" && value.trim() === "",
				)
			)
				return false;

			// For number values, check if they're not null/undefined
			if (values.every((value) => value === null || value === undefined))
				return false;

			// For arrays, check if they're not empty
			if (values.every((value) => Array.isArray(value) && value.length === 0))
				return false;

			return true;
		});

		activeFilters.forEach((filter) => {
			const { field, operator, values } = filter;

			filtered = filtered.filter((item) => {
				const fieldValue = item[field];

				switch (operator) {
					case "is":
						return values.includes(fieldValue);
					case "is_not":
						return !values.includes(fieldValue);
					case "contains":
						return values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "not_contains":
						return !values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "equals":
						return fieldValue === values[0];
					case "not_equals":
						return fieldValue !== values[0];
					case "greater_than":
						return Number(fieldValue) > Number(values[0]);
					case "less_than":
						return Number(fieldValue) < Number(values[0]);
					case "greater_than_or_equal":
						return Number(fieldValue) >= Number(values[0]);
					case "less_than_or_equal":
						return Number(fieldValue) <= Number(values[0]);
					case "between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) >= min && Number(fieldValue) <= max;
						}
						return true;
					case "not_between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) < min || Number(fieldValue) > max;
						}
						return true;
					case "before":
						return new Date(String(fieldValue)) < new Date(String(values[0]));
					case "after":
						return new Date(String(fieldValue)) > new Date(String(values[0]));
					default:
						return true;
				}
			});
		});

		return filtered;
	}, [data, filters]);

	// Row dragging state
	const dataIds = useMemo<UniqueIdentifier[]>(
		() => filteredData?.map((_, index) => index.toString()),
		[filteredData],
	);

	// Update page size when pagination setting changes
	useEffect(() => {
		if (!tableData.settings.enablePagination) {
			setPagination({ pageIndex: 0, pageSize: filteredData.length });
		} else {
			setPagination({ pageIndex: 0, pageSize: 10 });
		}
	}, [tableData.settings.enablePagination, filteredData.length]);

	useEffect(() => {
		setColumnOrder(columns.map((column) => column.id || ""));
	}, [columns]);

	const handleFiltersChange = useCallback((newFilters: Filter[]) => {
		console.log("Table filters updated:", newFilters);
		setFilters(newFilters);
		// Reset pagination when filters change
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);

	const table = useReactTable({
		data: filteredData,
		columns,
		columnResizeMode: "onChange",
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		enableSorting: true,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true;
			return filterableStringColumns.some((col) => {
				const value = row.getValue(col.id);
				return String(value).toLowerCase().includes(filterValue.toLowerCase());
			});
		},
		onGlobalFilterChange: setGlobalFilter,
		enableColumnPinning: true,
		enableColumnResizing: true,
		enableRowSelection: tableData.settings.enableRowSelection,
		state: {
			sorting,
			pagination,
			columnVisibility,
			columnOrder,
		},
		onColumnOrderChange: setColumnOrder,
	});

	const handleDragEnd = useCallback((event: DragEndEvent) => {
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
	}, []);

	const handleRowDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (active && over && active.id !== over.id) {
				setData((data) => {
					const oldIndex = dataIds.indexOf(active.id);
					const newIndex = dataIds.indexOf(over.id);
					return arrayMove(data, oldIndex, newIndex);
				});
			}
		},
		[dataIds],
	);

	return (
		<div className="w-full space-y-4 h-full overflow-auto">
			{/* Filters */}
			<div className="flex flex-wrap items-start gap-2.5 mb-3.5">
				<div className="flex items-center gap-3">
					{tableData.settings.enableHiding && (
						<DataGridColumnVisibility
							table={table}
							trigger={
								<Button variant="outline" size="sm">
									Columns
								</Button>
							}
						/>
					)}
				</div>
				<div className="flex-1">
					<Filters
						filters={filters}
						fields={filterFields}
						onChange={handleFiltersChange}
						variant="outline"
						size="sm"
					/>
				</div>
				{filters.length > 0 && (
					<Button variant="outline" size="sm" onClick={() => setFilters([])}>
						<CircleX /> Clear
					</Button>
				)}
			</div>

			{/* Data Grid */}
			<DataGrid
				table={table}
				recordCount={filteredData.length}
				tableLayout={{
					dense: tableData.settings.tableLayout?.dense ?? false,
					cellBorder: tableData.settings.tableLayout?.cellBorder ?? false,
					rowBorder: tableData.settings.tableLayout?.rowBorder ?? true,
					rowRounded: tableData.settings.tableLayout?.rowRounded ?? false,
					stripped: tableData.settings.tableLayout?.stripped ?? false,
					headerBorder: tableData.settings.tableLayout?.headerBorder ?? true,
					headerSticky: tableData.settings.tableLayout?.headerSticky ?? false,
					width: tableData.settings.tableLayout?.width ?? "fixed",
					columnsMovable: true,
					columnsResizable: tableData.settings.enableResizing ?? false,
					columnsVisibility: tableData.settings.enableHiding ?? false,
					columnsPinnable: tableData.settings.enablePinning ?? false,
					columnsDraggable: tableData.settings.enableColumnDragging ?? false,
					rowsDraggable: tableData.settings.enableRowDragging ?? false,
				}}
			>
				<div className="w-full space-y-2.5">
					<DataGridContainer>
						<ScrollArea>
							{tableData.settings.enableRowDragging ? (
								<DataGridTableDndRows
									handleDragEnd={handleRowDragEnd}
									dataIds={dataIds}
								/>
							) : tableData.settings.enableColumnDragging ? (
								<DataGridTableDnd handleDragEnd={handleDragEnd} />
							) : (
								<DataGridTable />
							)}
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
					</DataGridContainer>
					{tableData.settings.enablePagination && <DataGridPagination />}
				</div>
			</DataGrid>
		</div>
	);
}
