import { describe, expect, it } from 'vitest';
import { generateTableData, generateTableType } from '@/lib/table-code-generators/react/generate-table-data';

describe('generateTableType', () => {
	it('should generate correct TypeScript interface', () => {
		const columns = [
			{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
			{ id: 'age', accessor: 'age', label: 'Age', type: 'number' as const, order: 2, filterable: true },
			{ id: 'isActive', accessor: 'isActive', label: 'Active', type: 'boolean' as const, order: 3, filterable: false },
		];

		const result = generateTableType(columns, 'User');

		expect(result).toBe(`export interface UserData {
\tname: string;
\tage: number;
\tisActive: boolean;
}`);
	});

	it('should generate union types for boolean with possibleValues', () => {
		const columns = [
			{ id: 'status', accessor: 'status', label: 'Status', type: 'boolean' as const, order: 1, filterable: true, possibleValues: ['active', 'inactive'] },
		];

		const result = generateTableType(columns, 'User');

		expect(result).toBe(`export interface UserData {
\tstatus: "active" | "inactive";
}`);
	});

	it('should generate union types for enum with possibleValues', () => {
		const columns = [
			{ id: 'role', accessor: 'role', label: 'Role', type: 'enum' as const, order: 1, filterable: true, possibleValues: ['admin', 'user', 'moderator'] },
		];

		const result = generateTableType(columns, 'User');

		expect(result).toBe(`export interface UserData {
\trole: "admin" | "user" | "moderator";
}`);
	});

	it('should use default name when no custom name provided', () => {
		const columns = [
			{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
		];

		const result = generateTableType(columns);

		expect(result).toContain('export interface TableData');
	});
});

describe('generateTableData', () => {
	it('should generate correct data array', () => {
		const columns = [
			{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
			{ id: 'age', accessor: 'age', label: 'Age', type: 'number' as const, order: 2, filterable: true },
		];
		const data = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 },
		];

		const result = generateTableData(data, columns, 'User');

		expect(result).toBe(`export const userData: UserData[] = [
\t{
\t\tname: "John",
\t\tage: 30
\t},
\t{
\t\tname: "Jane",
\t\tage: 25
\t}
];`);
	});

	it('should handle empty data', () => {
		const columns = [
			{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
		];
		const data: any[] = [];

		const result = generateTableData(data, columns, 'User');

		expect(result).toBe(`export const userData: UserData[] = [];`);
	});

	it('should handle different data types', () => {
		const columns = [
			{ id: 'name', accessor: 'name', label: 'Name', type: 'string' as const, order: 1, filterable: true },
			{ id: 'age', accessor: 'age', label: 'Age', type: 'number' as const, order: 2, filterable: true },
			{ id: 'isActive', accessor: 'isActive', label: 'Active', type: 'boolean' as const, order: 3, filterable: false },
			{ id: 'date', accessor: 'date', label: 'Date', type: 'date' as const, order: 4, filterable: false },
			{ id: 'obj', accessor: 'obj', label: 'Object', type: 'object' as const, order: 5, filterable: false },
		];
		const data = [
			{ name: 'John', age: 30, isActive: true, date: '2023-01-01', obj: { key: 'value' } },
		];

		const result = generateTableData(data, columns, 'User');

		expect(result).toContain('name: "John"');
		expect(result).toContain('age: 30');
		expect(result).toContain('isActive: true');
		expect(result).toContain('date: "2023-01-01"');
		expect(result).toContain('obj: {"key":"value"}');
	});

	it('should quote boolean values with possibleValues as strings', () => {
		const columns = [
			{ id: 'status', accessor: 'status', label: 'Status', type: 'boolean' as const, order: 1, filterable: true, possibleValues: ['Active', 'Inactive'] },
		];
		const data = [
			{ status: 'Active' },
			{ status: 'Inactive' },
		];

		const result = generateTableData(data, columns, 'User');

		expect(result).toContain('status: "Active"');
		expect(result).toContain('status: "Inactive"');
	});

	it('should quote enum values as strings', () => {
		const columns = [
			{ id: 'role', accessor: 'role', label: 'Role', type: 'enum' as const, order: 1, filterable: true, possibleValues: ['admin', 'user', 'moderator'] },
		];
		const data = [
			{ role: 'admin' },
			{ role: 'user' },
		];

		const result = generateTableData(data, columns, 'User');

		expect(result).toContain('role: "admin"');
		expect(result).toContain('role: "user"');
	});
});