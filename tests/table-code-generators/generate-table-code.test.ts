import { describe, expect, it } from 'vitest';
import { generateTableCode } from '@/lib/table-code-generators/react/generate-table-code';

describe('generateTableCode', () => {
	it('should generate component code with correct name', () => {
		const tableBuilder = {
			id: 1,
			tableName: 'UserTable',
			settings: {
				isGlobalSearch: true,
				enableHiding: true,
				enableSorting: true,
				enableResizing: false,
				enablePinning: false,
				enableRowSelection: true,
				enableCRUD: true,
				enableColumnDragging: false,
				enableRowDragging: false,
				enablePagination: true,
				tableLayout: {
					dense: true,
					cellBorder: false,
					rowBorder: true,
					rowRounded: false,
					stripped: false,
					headerBorder: true,
					headerSticky: false,
					width: "fixed" as const,
				},
			},
			table: {
				columns: [
					{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
				],
				data: [{ name: 'John' }],
			},
		};

		const result = generateTableCode(tableBuilder, 'UserTable');

		expect(result.file).toBe('usertable.tsx');
		expect(result.code).toContain('export default function UserTable()');
		expect(result.code).toContain('useState<PaginationState>');
		expect(result.code).toContain('useState<SortingState>');
		expect(result.code).toContain('useState([])');
		expect(result.code).toContain('const columns = useMemo<ColumnDef<UserTableData>');
		expect(result.code).toContain('const filterFields = useMemo(() => [');
		expect(result.code).toContain('useReactTable');
		expect(result.code).toContain('DataGrid');
		expect(result.code).toContain('tableLayout=');
	});

	it('should generate code without filters when disabled', () => {
		const tableBuilder = {
			id: 2,
			tableName: 'TestTable',
			settings: {
				isGlobalSearch: false,
				enableHiding: false,
				enableSorting: false,
				enableResizing: false,
				enablePinning: false,
				enableRowSelection: false,
				enableCRUD: false,
				enableColumnDragging: false,
				enableRowDragging: false,
				enablePagination: false,
				tableLayout: {
					dense: false,
					cellBorder: false,
					rowBorder: true,
					rowRounded: false,
					stripped: false,
					headerBorder: true,
					headerSticky: false,
					width: "fixed" as const,
				},
			},
			table: {
				columns: [
					{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
				],
				data: [{ name: 'John' }],
			},
		};

		const result = generateTableCode(tableBuilder);

		expect(result.code).not.toContain('Filters');
		expect(result.code).not.toContain('generateFilterFields');
		expect(result.code).not.toContain('columnFilters');
		expect(result.code).toContain('TableComponent2'); // default name
	});
});