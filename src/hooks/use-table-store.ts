import { useLiveQuery } from "@tanstack/react-db";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { createIsomorphicFn } from "@tanstack/react-start";

// const useTableStore = () => {

// 	const { data } = useLiveQuery((q) =>
// 		q
// 			.from({ tableBuilder: tableBuilderCollection })
// 			.select(({ tableBuilder }) => ({
// 				tableName: tableBuilder.tableName,
// 				settings: tableBuilder.settings,
// 				table: tableBuilder.table,
// 			})),
// 	);

// 	return (
// 		data?.[0] || {
// 			tableName: "table",
// 			settings: {
// 				isGlobalSearch: false,
// 				enableHiding: false,
// 				enableSorting: false,
// 				enableResizing: false,
// 				enablePinning: false,
// 				enableRowSelection: false,
// 				enableCRUD: false,
// 				enableColumnDragging: false,
// 				enableRowDragging: false,
// 				enablePagination: false,
// 				enableColumnMovable : false,
// 				tableLayout: {
// 					dense: false,
// 					cellBorder: false,
// 					rowBorder: true,
// 					rowRounded: false,
// 					stripped: false,
// 					headerBorder: true,
// 					headerSticky: false,
// 					width: "auto",
// 				},
// 			},
// 			table: {
// 				columns: [],
// 				data: [],
// 			},
// 		}
// 	);
// };
const defaultTableState = {
	tableName: "table",
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
		enableColumnMovable : false,
		tableLayout: {
			dense: false,
			cellBorder: false,
			rowBorder: true,
			rowRounded: false,
			stripped: false,
			headerBorder: true,
			headerSticky: false,
			width: "auto",
		},
	},
	table: {
		columns: [],
		data: [],
	},
};

const useTableStore = createIsomorphicFn().client(() => {

	const { data } = useLiveQuery((q) =>
		q
			.from({ tableBuilder: tableBuilderCollection })
			.select(({ tableBuilder }) => ({
				tableName: tableBuilder.tableName,
				settings: tableBuilder.settings,
				table: tableBuilder.table,
			})),
	);

	return (
		data?.[0] || defaultTableState
	);
}).server(() => {
	return defaultTableState;
});
export default useTableStore;
