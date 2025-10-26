// @ts-nocheck
import type { TableBuilder } from "@/db-collections/table-builder.collections";
import {
	generateFilterFields,
	getFilteredDataString,
	getColumnsString,
} from "@/lib/table-generator/generate-columns";
import { capitalize, toCamelCase, toJSLiteral } from "@/utils/utils";
import type { JsonData } from "@/types/table-types";
import { generateTableImports } from "./generate-imports";

const getComponentName = (
	tableBuilder: TableBuilder,
	customName?: string,
): string => {
	return customName || `TableComponent${tableBuilder.id}`;
};

const getDataName = (customName?: string): string => {
	return customName ? `${customName}Data` : "tableData";
};

const getTypeName = (customName?: string): string => {
	return customName ? `${capitalize(customName)}Data` : "TableData";
};

const generateTableLayoutProps = (
	tableLayout: TableBuilder["settings"]["tableLayout"],
): string => {
	const props: Record<string, any> = {};

	if (tableLayout?.dense) {
		props.dense = true;
	}
	if (tableLayout?.cellBorder) {
		props.cellBorder = true;
	}
	if (tableLayout?.rowBorder) {
		props.rowBorder = true;
	}
	if (tableLayout?.rowRounded) {
		props.rowRounded = true;
	}
	if (tableLayout?.stripped) {
		props.stripped = true;
	}
	if (tableLayout?.headerBorder) {
		props.headerBorder = true;
	}
	if (tableLayout?.headerSticky) {
		props.headerSticky = true;
	}
	if (tableLayout?.width) {
		props.width = tableLayout.width;
	}

	return Object.keys(props).length > 0
		? ` tableLayout={${toJSLiteral(props)}}`
		: "";
};

const generateFilterFieldsCode = (
	table: TableBuilder["table"],
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
	tableBuilder: TableBuilder,
	customName?: string,
): { file: string; code: string } => {
	const componentName = getComponentName(tableBuilder, customName);
	const dataName = getDataName(customName);
	const typeName = getTypeName(customName);
	const settings = tableBuilder.settings;
	const table = tableBuilder.table;

	// Check if there are any array columns
	const hasArrayColumns = table.columns.some((col) => col.type === "array");

	const dataVar = settings.isGlobalSearch
		? "filteredData"
		: toCamelCase(dataName);

	const componentBody =
		`export default function ${capitalize(componentName)}() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	${settings.isGlobalSearch ? "const [filters, setFilters] = useState<Filter[]>([]);" : ""}
	${
		hasArrayColumns
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
	const columns = useMemo<ColumnDef<${typeName}>[]>(
		() => ${getColumnsString(
			table.columns,
			{
				enableSorting: settings.enableSorting,
				enableHiding: settings.enableHiding,
				enableResizing: settings.enableResizing,
				enablePinning: settings.enablePinning,
				enableRowSelection: settings.enableRowSelection,
				enableCRUD: settings.enableCRUD,
			},
			hasArrayColumns
				? {
						expandedRows: expandedArrayRows,
						onToggleExpand: handleToggleArrayExpand,
					}
				: undefined,
		)},
		${hasArrayColumns ? "[expandedArrayRows]" : "[]"},
	);
	${
		settings.isGlobalSearch
			? `${generateFilterFieldsCode(table, settings, dataName)}
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
		generateTableLayoutProps(settings.tableLayout) +
		`>
			<div className="w-full space-y-2.5">
				` +
		(settings.isGlobalSearch
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
						<DataGridTable />
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</DataGridContainer>
				` +
		(settings.enablePagination ? "<DataGridPagination />" : "") +
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
