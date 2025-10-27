// @ts-nocheck
import type { TableBuilder } from "@/db-collections/table-builder.collections";
import {
	generateFilterFields,
	getFilteredDataString,
	getColumnsString,
} from "@/lib/table-generator/generate-columns";
import { capitalize, toCamelCase, toJSLiteral } from "@/utils/utils";
import type { JsonData } from "@/types/table-types";
import useTableStore from "@/hooks/use-table-store";

const getDataName = (customName?: string): string => {
	return customName ? `${customName}Data` : "tableData";
};

const getTypeName = (customName?: string): string => {
	return customName ? `${capitalize(customName)}Data` : "TableData";
};

const getComponentName = (
): string => {
	const tableData = useTableStore();
	return `${capitalize(tableData.tableName)}Table`;
};

const generateTableLayoutProps = (
): string => {
	const tableData = useTableStore();
	const props: Record<string, any> = {};

	if (tableData.settings.tableLayout?.dense) {
		props.dense = true;
	}
	if (tableData.settings.tableLayout?.cellBorder) {
		props.cellBorder = true;
	}
	if (tableData.settings.tableLayout?.rowBorder) {
		props.rowBorder = true;
	}
	if (tableData.settings.tableLayout?.rowRounded) {
		props.rowRounded = true;
	}
	if (tableData.settings.tableLayout?.stripped) {
		props.stripped = true;
	}
	if (tableData.settings.tableLayout?.headerBorder) {
		props.headerBorder = true;
	}
	if (tableData.settings.tableLayout?.headerSticky) {
		props.headerSticky = true;
	}
	if (tableData.settings.tableLayout?.width) {
		props.width = tableData.settings.tableLayout.width;
	}

	if(tableData.settings.enableColumnDragging) {
		props.columnsDraggable = true;
	}
	if(tableData.settings.enableRowDragging) {
		props.rowsDraggable = true;
	}
	if(tableData.settings.enablePagination) {
		props.pagination = true;
	}
	if(tableData.settings.enableColumnMovable) {
		props.columnsMovable = true;
	}
	if(tableData.settings.enableResizing) {
		props.columnsResizable = true;
	}
	if(tableData.settings.enablePinning) {
		props.columnsPinnable = true;
	}
	if(tableData.settings.enableHiding) {
		props.columnsVisibility = true;
	}
	if(tableData.settings.enableSorting) {
		props.columnsSortable = true;
	}
	return Object.keys(props).length > 0
		? ` tableLayout={${toJSLiteral(props)}}`
		: "";
};

const generateFilterFieldsCode = (
	table: TableBuilder["table`"],
	settings: TableBuilder["settings"],
	dataName: string,
): string => {
	if (!settings.isGlobalSearch) return "";
	const generatedFields = generateFilterFields(
		table.columns,
		table.data as JsonData[],
	);
	console.log("temp", generatedFields);
	const fieldsCode = generatedFields
		.map(
			(field) =>
				`{ ${Object.entries(field)
					.map(([k, v]) => `${k}: ${toJSLiteral(v)}`)
					.join(", ")} }`,
		)
		.join(",");

	const filteringCode = getFilteredDataString(table.columns);

	return `const filterFields = useMemo<FilterFieldConfig[]>(() => [
		${fieldsCode}
	], []);
	// Apply filters to data
	const filteredData = useMemo(() => {
		const data = ${toCamelCase(dataName)};
		${filteringCode}
	}, [filters, ${toCamelCase(dataName)}]);`;
};

export const generateTableCode = (
	customName?: string,
): { file: string; code: string } => {
	const tableData = useTableStore();
	const componentName = getComponentName(tableData, customName);
	const dataName = getDataName(customName);
	const typeName = getTypeName(customName);

	// Check if there are any array columns
	const hasArrayColumns = tableData.table.columns.some((col) => col.type === "array");

	const dataVar = tableData.settings.isGlobalSearch
		? "filteredData"
		: toCamelCase(dataName);

	const componentBody =
		`export default function ${capitalize(componentName)}() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	${tableData.settings.isGlobalSearch ? "const [filters, setFilters] = useState<Filter[]>([]);" : ""}
	${
		tableData.table.columns.some((col) => col.type === "array")
			? `const [expandedArrayRows, setExpandedArrayRows] = useState<Set<string>>(new Set());
	const handleToggleArrayExpand = useCallback((columnId: string, rowId: string) => {
		setExpandedArrayRows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(rowId)) {
				newSet.delete(rowId);
			} else {
				newSet.add(rowId);
			}
			return newSet;
		});
	}, []);`
			: ""
	}
	${
		tableData.settings.enableRowDragging
			? `const dataIds = useMemo(() => ${dataVar}.map((item) => item.id), [${dataVar}]);
	const handleRowDragEnd = useCallback((event: any) => {
		// Handle row drag end
		console.log('Row drag end', event);
	}, []);`
			: ""
	}
	${
		tableData.settings.enableColumnDragging
			? `const handleDragEnd = useCallback((event: any) => {
		// Handle column drag end
		console.log('Column drag end', event);
	}, []);`
			: ""
	}
	const columns = useMemo<ColumnDef<${typeName}>[]>(
		() => ${getColumnsString(
			tableData.table.columns,
			{
				enableSorting: tableData.settings.enableSorting,
				enableHiding: tableData.settings.enableHiding,
				enableResizing: tableData.settings.enableResizing,
				enablePinning: tableData.settings.enablePinning,
				enableRowSelection: tableData.settings.enableRowSelection,
				enableCRUD: tableData.settings.enableCRUD,
			},
		)},
		[],
	);
	${
		tableData.settings.isGlobalSearch
			? `${generateFilterFieldsCode(tableData.table, tableData.settings, dataName)}
	const handleFiltersChange = useCallback((filters: Filter[]) => {
		console.log("Filters updated:", filters);
		setFilters(filters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);`
			: ""
	}
	const table = useReactTable({
		columns,
		data: ${dataVar},
		pageCount: Math.ceil((${dataVar}?.length || 0) / pagination.pageSize),
		state: {
			pagination,
			sorting,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
	return (
		<DataGrid table={table} recordCount={` +
		dataVar +
		`?.length || 0}` +
		generateTableLayoutProps(tableData.settings.tableLayout) +
		`>
			<div className="w-full space-y-2.5">
				` +
		(tableData.settings.isGlobalSearch
			? `<Filters
					filters={filters}
					fields={filterFields}
					variant="outline"
					onChange={handleFiltersChange}
				/>
				{filters.length > 0 && (
					<Button variant="outline" onClick={() => setFilters([])}>
						<FunnelX /> Clear
					</Button>
				)}`
			: "") +
		`
				<DataGridContainer>
					<ScrollArea>
						${tableData.settings.enableRowDragging ? `<DataGridTableDndRows
							handleDragEnd={handleRowDragEnd}
							dataIds={dataIds}
						/>` : tableData.settings.enableColumnDragging ? `<DataGridTableDnd handleDragEnd={handleDragEnd} />` : `<DataGridTable />`}
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</DataGridContainer>
				` +
		(tableData.settings.enablePagination ? "<DataGridPagination />" : "") +
		`
			</div>
		</DataGrid>
	);
};`;

	const componentCodeWithImport = `import { ${toCamelCase(dataName)} } from './data';
${componentBody}`;

	return {
		file: `${componentName.toLowerCase()}.tsx`,
		code: componentCodeWithImport,
	};
};
