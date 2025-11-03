import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	type Cell,
	flexRender,
	type HeaderGroup,
	type Row,
} from "@tanstack/react-table";
import { GripHorizontal } from "lucide-react";
import { type CSSProperties, useId } from "react";
import { Button } from "@/components/ui/button";
import { useDataGrid } from "@/components/ui/data-grid";
import {
	DataGridTableBase,
	DataGridTableBody,
	DataGridTableBodyRow,
	DataGridTableBodyRowCell,
	DataGridTableBodyRowSkeleton,
	DataGridTableBodyRowSkeletonCell,
	DataGridTableEmpty,
	DataGridTableHead,
	DataGridTableHeadRow,
	DataGridTableHeadRowCell,
	DataGridTableHeadRowCellResize,
	DataGridTableRowSpacer,
} from "@/components/ui/data-grid-table";

function DataGridTableDndRowHandle({ rowId }: { rowId: string }) {
	const { attributes, listeners } = useSortable({
		id: rowId,
	});

	return (
		<Button
			variant="dim"
			size="sm"
			className="size-7"
			{...attributes}
			{...listeners}
		>
			<GripHorizontal />
		</Button>
	);
}

function DataGridTableDndRow<TData>({ row }: { row: Row<TData> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.id,
	});

	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
		transition: transition,
		opacity: isDragging ? 0.8 : 1,
		zIndex: isDragging ? 1 : 0,
		position: "relative",
	};
	return (
		<DataGridTableBodyRow
			row={row}
			dndRef={setNodeRef}
			dndStyle={style}
			key={row.id}
		>
			{row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
				return (
					<DataGridTableBodyRowCell cell={cell} key={cell.id}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</DataGridTableBodyRowCell>
				);
			})}
		</DataGridTableBodyRow>
	);
}

function DataGridTableDndRows<TData>({
	handleDragEnd,
	dataIds,
}: {
	handleDragEnd: (event: DragEndEvent) => void;
	dataIds: UniqueIdentifier[];
}) {
	const { table, isLoading, props } = useDataGrid();
	const pagination = table.getState().pagination;

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	return (
		<DndContext
			id={useId()}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis]}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<div className="relative">
				<DataGridTableBase>
					<DataGridTableHead>
						{table
							.getHeaderGroups()
							.map((headerGroup: HeaderGroup<TData>) => {
								return (
									<DataGridTableHeadRow headerGroup={headerGroup} key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											const { column } = header;

											return (
												<DataGridTableHeadRowCell header={header} key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
													{props.tableLayout?.columnsResizable &&
														column.getCanResize() && (
															<DataGridTableHeadRowCellResize header={header} />
														)}
												</DataGridTableHeadRowCell>
											);
										})}
									</DataGridTableHeadRow>
								);
							})}
					</DataGridTableHead>

					{(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
						<DataGridTableRowSpacer />
					)}

					<DataGridTableBody>
						{props.loadingMode === "skeleton" &&
						isLoading &&
						pagination?.pageSize ? (
							Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
								<DataGridTableBodyRowSkeleton key={rowIndex}>
									{table.getVisibleFlatColumns().map((column) => {
										return (
											<DataGridTableBodyRowSkeletonCell
												column={column}
												key={column.id}
											>
												{column.columnDef.meta?.skeleton}
											</DataGridTableBodyRowSkeletonCell>
										);
									})}
								</DataGridTableBodyRowSkeleton>
							))
						) : table.getRowModel().rows.length ? (
							<SortableContext
								items={dataIds}
								strategy={verticalListSortingStrategy}
							>
								{table.getRowModel().rows.map((row: Row<TData>) => {
									return <DataGridTableDndRow row={row} key={row.id} />;
								})}
							</SortableContext>
						) : (
							<DataGridTableEmpty />
						)}
					</DataGridTableBody>
				</DataGridTableBase>
			</div>
		</DndContext>
	);
}

export { DataGridTableDndRowHandle, DataGridTableDndRows };
