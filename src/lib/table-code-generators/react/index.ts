import type { TableBuilder } from "@/db-collections/table-builder.collections";
import {
	extractTableImportDependencies,
	generateTableImports,
} from "./generate-imports";
import { generateTableCode } from "./generate-table-code";
import { generateTableData, generateTableType } from "./generate-table-data";

export const generateTable = (
	tableBuilder: TableBuilder,
	customName?: string,
): {
	files: { file: string; code: string }[];
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

	const fullComponentCode = `${Array.from(imports).join("\n")}

${typeCode}

${componentCode}`;

	const dependencies = extractTableImportDependencies(imports);

	return {
		files: [
			{ file, code: fullComponentCode },
			{ file: 'data.ts', code: dataCode },
		],
		dependencies,
	};
};
