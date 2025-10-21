import { useLiveQuery } from "@tanstack/react-db";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";

const useTableStore = () => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ tableBuilder: tableBuilderCollection })
			.select(({ tableBuilder }) => ({
				settings: tableBuilder.settings,
				table: tableBuilder.table,
			})),
	);

	return (
		data?.[0] || {
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
					width: "auto",
				},
			},
			table: {
				columns: [],
				data: [],
			},
		}
	);
};

export default useTableStore;
