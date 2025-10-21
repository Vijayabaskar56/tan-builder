import type { TableBuilder } from "@/db-collections/table-builder.collections";
import {
	generateTableImports,
	extractTableImportDependencies,
} from "./generate-imports";
import { generateTableData, generateTableType } from "./generate-table-data";
import { generateTableCode } from "./generate-table-code";

export const generateTable = (
	tableBuilder: TableBuilder,
	customName?: string,
): {
	file: string;
	code: string;
	dependencies: { registryDependencies: string[]; dependencies: string[] };
} => {
	const imports = generateTableImports(tableBuilder.settings);
	const typeCode = generateTableType(tableBuilder.table.columns, customName);
	const dataCode = generateTableData(
		tableBuilder.table.data,
		tableBuilder.table.columns,
		customName,
	);
	const { file, code: componentCode } = generateTableCode(
		tableBuilder,
		customName,
	);

	const fullCode = `"use client";

${Array.from(imports).join("\n")}

${typeCode}

${dataCode}

${componentCode}`;

	const dependencies = extractTableImportDependencies(imports);

	return {
		file,
		code: fullCode,
		dependencies,
	};
};
