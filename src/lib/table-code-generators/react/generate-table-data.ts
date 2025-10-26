import { capitalize, toCamelCase } from "@/utils/utils";
import type { ColumnConfig } from "@/types/table-types";

const getTypeScriptType = (type: ColumnConfig["type"]): string => {
	switch (type) {
		case "string":
			return "string";
		case "number":
			return "number";
		case "boolean":
			return "boolean";
		case "date":
			return "string"; // Dates stored as strings
		case "object":
			return "any";
		case "array":
			return "any[]";
		case "enum":
			return "string";
		default:
			return "string";
	}
};

export const generateTableType = (
	columns: ColumnConfig[],
	customName?: string,
): string => {
	console.log(customName, "columns");
	const interfaceName = customName
		? `${capitalize(customName)}Data`
		: "TableData";
	const properties = columns
		.map((col) => `\t${col.accessor}: ${getTypeScriptType(col.type)};`)
		.join("\n");

	return `export interface ${interfaceName} {\n${properties}\n}`;
};

const formatValue = (value: any, type: ColumnConfig["type"]): string => {
	if (value === null || value === undefined) {
		return "null";
	}

	switch (type) {
		case "string":
			return `"${String(value).replace(/"/g, '\\"')}"`;
		case "number":
			return String(value);
		case "boolean":
			return String(value);
		case "date":
			return `"${String(value)}"`;
		case "object":
			return JSON.stringify(value);
		case "array":
			return JSON.stringify(value);
		case "enum":
			return `"${String(value)}"`;
		default:
			return `"${String(value).replace(/"/g, '\\"')}"`;
	}
};

export const generateTableData = (
	data: Record<string, any>[],
	columns: ColumnConfig[],
	customName?: string,
): string => {
	const constName = customName ? `${customName}Data` : "tableData";

	if (data.length === 0) {
		return `export const ${toCamelCase(constName)}: ${customName ? `${capitalize(customName)}Data` : "TableData"}[] = [];`;
	}

	const dataLines = data.map((row) => {
		const properties = columns
			.map((col) => {
				const value = row[col.accessor];
				return `\t\t${col.accessor}: ${formatValue(value, col.type)}`;
			})
			.join(",\n");
		return `\t{\n${properties}\n\t}`;
	});

	return `export const ${toCamelCase(constName)}: ${customName ? `${capitalize(customName)}Data` : "TableData"}[] = [\n${dataLines.join(",\n")}\n];`;
};
