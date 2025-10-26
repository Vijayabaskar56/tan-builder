import { generateTable } from '@/lib/table-code-generators/react/index';
import { describe, expect, it } from 'vitest';

describe('generateTable', () => {
	it('should generate complete table code', () => {
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
				enableColumnMovable: false,
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
					{ id: 'age', accessor: 'age', label: 'Age', type: 'number' as const, order: 2, filterable: true },
				],
				data: [
					{ name: 'John', age: 30 },
					{ name: 'Jane', age: 25 },
				],
			},
		};

		const result = generateTable(tableBuilder, 'UserTable');

		expect(result.files[0].file).toBe('usertable.tsx');
		expect(result.files[0].code).toContain('useMemo');
		expect(result.files[0].code).toContain('useState');
		expect(result.files[0].code).toContain('export interface UserTableData');
		expect(result.files[1].code).toContain('export const userTableData: UserTableData[]');
		expect(result.files[0].code).toContain('export default function UserTable()');
		expect(result.files[1].code).toContain('name: "John"');
		expect(result.files[1].code).toContain('age: 30');
		expect(result.dependencies.registryDependencies).toContain('data-grid');
		expect(result.dependencies.dependencies).toContain('react');
	});

	it('should handle minimal settings', () => {
		const tableBuilder = {
			id: 2,
			tableName: 'TableComponent2',
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
				enableColumnMovable: false,
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
					{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: false },
				],
				data: [{ name: 'Test' }],
			},
		};

		const result = generateTable(tableBuilder);

		expect(result.files[0].code).not.toContain('Filters');
		expect(result.files[0].code).not.toContain('DataGridPagination');
		expect(result.files[0].code).toContain('TableComponent2');
		expect(result.files[1].code).toContain('name: "Test"');
	});
});