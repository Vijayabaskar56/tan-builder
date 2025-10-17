import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, CircleX, LucideGripVertical, PlusCircle } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FormElementsDropdown } from "@/components/builder/form-elements-dropdown";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { StepContainer } from "@/components/builder/step-container";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/components/ui/tanstack-form";
import type { FormBuilderActions } from "@/hooks/use-form-store";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import { isStatic, logger } from "@/lib/utils";
import type {
	FormArray,
	FormElement,
	FormElementOrList,
	FormStep,
	Option,
} from "@/types/form-types";
import { DeleteIcon } from "../ui/delete";
import { SquarePenIcon } from "../ui/square-pen";
import NoFieldPlaceholder from "./no-field-placeholder";

const getTransitionProps = (isLayoutTransitioning: boolean) => ({
	transition: isLayoutTransitioning
		? { duration: 0 } // Disable animations during layout transitions
		: { duration: 0.3 },
});

type EditFormItemProps = {
	element: FormElement;
	/**
	 * Index of the main array
	 */
	fieldIndex: number;
	/**
	 * Index of the nested array element
	 */
	j?: number;
	stepIndex?: number;
};

const inputTypes = [
	{
		value: "text",
		label: "Text",
	},
	{
		value: "number",
		label: "Number",
	},
	{ value: "url", label: "URL" },
	{
		value: "password",
		label: "Password",
	},
	{
		value: "email",
		label: "Email",
	},
	{
		value: "tel",
		label: "Phone number",
	},
];

// Sortable option component
const SortableOption = ({
	option,
	index,
	editingIndex,
	setEditingIndex,
	editingOption,
	setEditingOption,
	saveEdit,
	cancelEdit,
	deleteOption,
}: {
	option: Option;
	index: number;
	editingIndex: number | null;
	setEditingIndex: (index: number | null) => void;
	editingOption: Option;
	setEditingOption: (option: Option) => void;
	saveEdit: () => void;
	cancelEdit: () => void;
	deleteOption: (index: number) => void;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: option.value });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 py-2 pr-2 pl-4 border rounded-md cursor-grab active:cursor-grabbing group bg-secondary ${
				isDragging ? "opacity-50" : ""
			}`}
			{...attributes}
			{...listeners}
		>
			<LucideGripVertical
				size={20}
				className="dark:text-muted-foreground text-muted-foreground"
			/>
			{editingIndex === index ? (
				<>
					<div className="flex-1 space-y-2">
						<div className="flex gap-2">
							<div className="flex-1">
								<Label className="text-xs text-muted-foreground">Label</Label>
								<Input
									value={editingOption.label as string}
									onChange={(e) => {
										const newLabel = e.target.value;
										const newValue = newLabel
											.toLowerCase()
											.replace(/[^a-z0-9]/g, "_")
											.replace(/_+/g, "_")
											.replace(/^_|_$/g, "");
										setEditingOption({
											...editingOption,
											label: newLabel,
											value: newValue,
										});
									}}
									placeholder="Option label"
									className="h-8 text-sm"
								/>
							</div>
							<div className="flex-1">
								<Label className="text-xs text-muted-foreground">Value</Label>
								<Input
									value={editingOption.value}
									onChange={(e) =>
										setEditingOption({
											...editingOption,
											value: e.target.value,
										})
									}
									placeholder="Option value"
									className="h-8 text-sm"
								/>
							</div>
						</div>
					</div>
					<div className="flex gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={saveEdit}
							className="size-8"
						>
							<Check className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={cancelEdit}
							className="size-8"
						>
							<CircleX className="size-4" />
						</Button>
					</div>
				</>
			) : (
				<>
					<div className="flex-1 min-w-0">
						<div className="text-sm font-medium truncate">{option.label}</div>
						<div className="text-xs text-muted-foreground truncate">
							Value: {option.value}
						</div>
					</div>
					<div className="flex gap-1 lg:opacity-0 opacity-100 group-hover:opacity-100 duration-200">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => setEditingIndex(index)}
							className="size-8"
						>
							<SquarePenIcon className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => deleteOption(index)}
							className="size-8"
						>
							<DeleteIcon className="size-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

function OptionsList({
	options = [],
	onChange,
}: {
	options: Option[];
	onChange: (options: Option[]) => void;
}) {
	const [localOptions, setLocalOptions] = useState<Option[]>(options);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const [editingOption, setEditingOption] = useState<Option>({
		value: "",
		label: "",
	});

	useEffect(() => {
		setLocalOptions(options);
	}, [options]);

	const addOption = () => {
		const newOption: Option = {
			value: `option_${Date.now()}`,
			label: `Option ${options.length + 1}`,
		};
		const updated = [...localOptions, newOption];
		setLocalOptions(updated);
		onChange(updated);
	};

	const deleteOption = (index: number) => {
		const updated = localOptions.filter((_, i) => i !== index);
		setLocalOptions(updated);
		onChange(updated);
	};

	const saveEdit = () => {
		if (editingIndex !== null) {
			const updated = localOptions.map((option, index) =>
				index === editingIndex ? editingOption : option,
			);
			setLocalOptions(updated);
			onChange(updated);
			setEditingIndex(null);
		}
	};

	const cancelEdit = () => {
		setEditingIndex(null);
		setEditingOption({ value: "", label: "" });
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = localOptions.findIndex((opt) => opt.value === active.id);
		const newIndex = localOptions.findIndex((opt) => opt.value === over.id);

		if (oldIndex !== -1 && newIndex !== -1) {
			const newOrder = [...localOptions];
			const [moved] = newOrder.splice(oldIndex, 1);
			newOrder.splice(newIndex, 0, moved);
			setLocalOptions(newOrder);
			onChange(newOrder);
		}
	};

	return (
		<div className="space-y-3 w-full">
			<div className="flex items-center justify-between">
				<Label className="text-sm font-medium">Options</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={addOption}
					className="h-8 px-2"
				>
					<PlusCircle className="h-4 w-4 mr-1" />
					Add Option
				</Button>
			</div>

			<div className="space-y-2 max-h-48 overflow-y-auto">
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={localOptions.map((opt) => opt.value)}
						strategy={verticalListSortingStrategy}
					>
						{localOptions.map((option, index) => (
							<SortableOption
								key={option.value}
								option={option}
								index={index}
								editingIndex={editingIndex}
								setEditingIndex={setEditingIndex}
								editingOption={editingOption}
								setEditingOption={setEditingOption}
								saveEdit={saveEdit}
								cancelEdit={cancelEdit}
								deleteOption={deleteOption}
							/>
						))}
					</SortableContext>
				</DndContext>

				{options.length === 0 && (
					<div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-md">
						No options added yet. Click "Add Option" to get started.
					</div>
				)}
			</div>
		</div>
	);
}

type FormElementEditorProps = {
	formElement: FormElement;
	fieldIndex: number;
	j?: number;
	stepIndex?: number;
	arrayId?: string;
	isFormArrayField?: boolean;
};

const FormElementEditor = ({
	formElement,
	fieldIndex,
	j,
	stepIndex,
	arrayId,
	isFormArrayField,
}: FormElementEditorProps) => {
	const { actions } = useFormStore();
	const { fieldType } = formElement;

	const form = useAppForm({
		defaultValues: formElement as FormElement,
		onSubmit: ({ value }) => {
			if (isFormArrayField && arrayId) {
				// Use updateTemplate: false for property-only updates
				actions.updateFormArrayField(arrayId, fieldIndex, value, j, false);
			} else {
				actions.editElement({
					fieldIndex: fieldIndex,
					modifiedFormElement: value,
					j,
					stepIndex,
				});
			}
		},
		listeners: {
			onChangeDebounceMs: 500,
			onChange: ({ formApi }) => {
				logger("Form element changed:", formApi.baseStore.state.values);
				if (isFormArrayField && arrayId) {
					logger("Updating FormArray field:", {
						arrayId,
						fieldIndex,
						value: formApi.baseStore.state.values,
						j,
						stepIndex,
					});
					// Use updateTemplate: false for property-only updates
					actions.updateFormArrayField(
						arrayId,
						fieldIndex,
						formApi.baseStore.state.values,
						j,
						false,
					);
				} else {
					logger("Updating form element:", {
						fieldIndex,
						value: formApi.baseStore.state.values,
						j,
						stepIndex,
					});
					if (formApi.baseStore.state.values.name) {
						formApi.baseStore.state.values.name =
							formApi.baseStore.state.values.name
								.toLowerCase()
								.replace(/[^a-z0-9]/g, "_")
								.replace(/_+/g, "_")
								.replace(/^_|_$/g, "");
					}
					actions.editElement({
						fieldIndex: fieldIndex,
						modifiedFormElement: formApi.baseStore.state.values,
						j,
						stepIndex,
					});
				}
			},
		},
	});

	const isFieldWithOptions =
		fieldType === "Select" ||
		fieldType === "MultiSelect" ||
		fieldType === "RadioGroup" ||
		fieldType === "ToggleGroup";

	return (
		<form.AppForm>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="pt-4 border-t border-dashed dark:border-foreground/30 space-y-4"
			>
				{isStatic(fieldType) ? (
					<div className="mb-4">
						<RenderFormElement
							formElement={{
								id: formElement.id,
								name: "content",
								label: `Customize ${fieldType}`,
								fieldType: "Input",
								defaultValue: formElement.content,
								required: true,
								className: "border-secondary",
							}}
							form={form as any}
						/>
					</div>
				) : (
					<div className="flex flex-col items-center justify-start w-full gap-3 mb-2">
						<RenderFormElement
							formElement={{
								id: formElement.id,
								name: "label",
								label: "Label attribute",
								fieldType: "Input",
								type: "text",
								required: true,
							}}
							form={form as any}
						/>
						<div className="flex items-center justify-between gap-4 w-full">
							<RenderFormElement
								formElement={{
									id: formElement.id,
									name: "name",
									label: "Name attribute",
									fieldType: "Input",
									defaultValue: formElement.name,
									required: true,
									className: "outline-secondary",
								}}
								form={form as any}
							/>
							<RenderFormElement
								formElement={{
									id: formElement.id,
									name: "placeholder",
									label: "Placeholder attribute",
									fieldType: "Input",
									type: "text",
									required: true,
								}}
								form={form as any}
							/>
						</div>
						<RenderFormElement
							formElement={{
								id: formElement.id,
								name: "description",
								label: "Description attribute",
								fieldType: "Input",
								placeholder: "Add a description",
							}}
							form={form as any}
						/>
						{fieldType === "Input" && (
							<RenderFormElement
								formElement={{
									id: formElement.id,
									name: "type",
									label: "Type attribute",
									fieldType: "Select",
									options: inputTypes,
									required: true,
									placeholder: "Placeholder",
									value: formElement.type,
								}}
								form={form as any}
							/>
						)}
						{fieldType === "Slider" && (
							<div className="flex items-center justify-between gap-4">
								<RenderFormElement
									formElement={{
										id: formElement.id,
										name: "min",
										label: "Min value",
										fieldType: "Input",
										type: "number",
										defaultValue: formElement.min,
										required: true,
									}}
									form={form as any}
								/>
								<RenderFormElement
									formElement={{
										id: formElement.id,
										name: "max",
										label: "Max value",
										fieldType: "Input",
										type: "number",
										defaultValue: formElement.max,
										required: true,
									}}
									form={form as any}
								/>
								<RenderFormElement
									formElement={{
										id: formElement.id,
										name: "step",
										label: "Step value",
										fieldType: "Input",
										type: "number",
										defaultValue: formElement.step,
										required: true,
									}}
									form={form as any}
								/>
							</div>
						)}
						{fieldType === "ToggleGroup" && (
							<RenderFormElement
								formElement={{
									id: formElement.id,
									name: "type",
									label: "Choose single or multiple choices",
									fieldType: "ToggleGroup",
									options: [
										{ value: "single", label: "Single" },
										{ value: "multiple", label: "Multiple" },
									],
									defaultValue: formElement.type,
									required: true,
									type: "single",
								}}
								form={form as any}
							/>
						)}
						{isFieldWithOptions && (
							<OptionsList
								options={formElement.options || []}
								onChange={(options) => form.setFieldValue("options", options)}
							/>
						)}
						<div className="flex items-center w-full gap-4 justify-start">
							<div>
								<RenderFormElement
									formElement={{
										id: formElement.id,
										name: "required",
										label: "Required",
										fieldType: "Checkbox",
									}}
									form={form as any}
								/>
							</div>
							<RenderFormElement
								formElement={{
									id: formElement.id,
									name: "disabled",
									label: "Disabled",
									fieldType: "Checkbox",
								}}
								form={form as any}
							/>
						</div>
					</div>
				)}
				{/* <div className="flex items-center justify-end gap-3 w-full pt-4">
    //TODO: Check for All Field and Remove the Submit
					<Button size="sm" type="submit" variant="secondary">
						Save Changes
					</Button>
				</div> */}
			</form>
		</form.AppForm>
	);
};

const EditFormItem = (props: EditFormItemProps) => {
	const { element, fieldIndex } = props;
	const { actions } = useFormStore();
	const isNested = typeof props?.j === "number";
	const DisplayName =
		"label" in element
			? element?.label
			: "content" in element
				? element.content
				: element.name;

	return (
		<div className="w-full group">
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center justify-start gap-2 size-full">
					{isNested ? (
						<span className="w-1" />
					) : (
						<LucideGripVertical
							size={20}
							className="dark:text-muted-foreground text-muted-foreground"
						/>
					)}
					<span className="truncate max-w-xs md:max-w-sm">{DisplayName}</span>
				</div>
				<div className="flex items-center justify-end lg:opacity-0 opacity-100 group-hover:opacity-100 duration-100">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => {
							actions.dropElement({
								fieldIndex,
								j: props?.j,
								stepIndex: props?.stepIndex,
							});
						}}
						className="rounded-xl h-9"
					>
						<DeleteIcon />
					</Button>
					{!isNested && (
						<FormElementsDropdown
							fieldIndex={fieldIndex}
							stepIndex={props?.stepIndex}
						/>
					)}
				</div>
			</div>
			{element.fieldType !== "Separator" && (
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value={`item-${element.id}`} className="border-none">
						<AccordionTrigger className="px-2 py-1 text-sm text-muted-foreground hover:no-underline">
							Customize Field
						</AccordionTrigger>
						<AccordionContent className="px-2 pb-4">
							<FormElementEditor
								formElement={element as FormElement}
								fieldIndex={fieldIndex}
								j={props?.j}
								stepIndex={props?.stepIndex}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};

// Component specifically for FormArray fields
const FormArrayFieldItem = ({
	element,
	fieldIndex,
	arrayId,
	mainFieldIndex,
	stepIndex,
	nestedIndex,
	formArrayElement,
	isLayoutTransitioning: _isLayoutTransitioning = false,
}: {
	element: FormElement;
	fieldIndex: number;
	arrayId: string;
	mainFieldIndex?: number;
	stepIndex?: number;
	nestedIndex?: number;
	formArrayElement?: FormArray;
	isLayoutTransitioning?: boolean;
}) => {
	const { actions } = useFormStore();
	const isNested = typeof nestedIndex === "number";
	const DisplayName =
		"label" in element
			? element?.label
			: "content" in element
				? element.content
				: element.name;

	return (
		<div className="w-full group">
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center justify-start gap-2 size-full">
					{isNested ? (
						<span className="w-1" />
					) : (
						<button
							type="button"
							onPointerDown={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
							className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
						>
							<LucideGripVertical
								size={20}
								className="dark:text-muted-foreground text-muted-foreground"
							/>
						</button>
					)}
					<span className="truncate max-w-xs md:max-w-sm">{DisplayName}</span>
				</div>
				<div className="flex items-center justify-end lg:opacity-0 opacity-100 group-hover:opacity-100 duration-100">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => {
							if (isNested && formArrayElement) {
								const updatedArrayField = [
									...(formArrayElement as unknown as FormArray).arrayField,
								];
								const nestedArray = updatedArrayField[
									fieldIndex
								] as FormElement[];
								const updatedNestedArray = nestedArray.filter(
									(_, i) => i !== nestedIndex,
								);
								updatedArrayField[fieldIndex] =
									updatedNestedArray.length === 1
										? updatedNestedArray[0]
										: updatedNestedArray;
								actions.updateFormArray(arrayId, updatedArrayField);
							} else {
								actions.removeFormArrayField(arrayId, fieldIndex);
							}
						}}
						className="rounded-xl h-9"
					>
						<DeleteIcon />
					</Button>
					{!isNested && mainFieldIndex !== undefined && (
						<FormElementsDropdown
							fieldIndex={mainFieldIndex}
							j={fieldIndex}
							isFormArrayField={true}
							stepIndex={stepIndex}
						/>
					)}
				</div>
			</div>
			{element.fieldType !== "Separator" && (
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value={`item-${element.id}`} className="border-none">
						<AccordionTrigger className="px-2 py-1 text-sm text-muted-foreground hover:no-underline">
							Customize Field
						</AccordionTrigger>
						<AccordionContent className="px-2 pb-4">
							<FormElementEditor
								formElement={element as FormElement}
								fieldIndex={fieldIndex}
								j={nestedIndex}
								arrayId={arrayId}
								isFormArrayField={true}
							/>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};

// Component for FormArray item with proper drag handling
const FormArrayItemContainer = ({
	formArrayElement,
	actions,
	mainFieldIndex,
	isLayoutTransitioning = false,
}: {
	formArrayElement: FormArray;
	actions: FormBuilderActions;
	mainFieldIndex?: number;
	isLayoutTransitioning?: boolean;
}) => {
	const dragControls = useDragControls();
	const [localName, setLocalName] = useState(formArrayElement.name);

	useEffect(() => {
		setLocalName(formArrayElement.name);
	}, [formArrayElement.name]);

	return (
		<Reorder.Item
			key={formArrayElement.id}
			value={formArrayElement}
			className="rounded-xl border-2 border-dashed border-muted-foreground/30 py-3 w-full bg-muted/20"
			layout
			dragListener={false}
			dragControls={dragControls}
			{...getTransitionProps(isLayoutTransitioning)}
		>
			<div className="px-3">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onPointerDown={(e) => dragControls.start(e)}
							className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
						>
							<LucideGripVertical
								size={20}
								className="dark:text-muted-foreground text-muted-foreground"
							/>
						</button>
						<SquarePenIcon size={10} />
						<input
							type="text"
							className="text-sm font-medium text-muted-foreground bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-auto min-w-0"
							value={localName}
							onChange={(e) => setLocalName(e.target.value)}
							onBlur={() => {
								if (localName !== formArrayElement.name) {
									actions.updateFormArrayProperties(formArrayElement.id, {
										name: localName,
									});
								}
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.currentTarget.blur();
								}
							}}
							placeholder="Field Array Name"
							autoComplete="off"
						/>
					</div>
					<div className="flex items-center gap-2">
						<FormElementsDropdown type="FA" arrayId={formArrayElement.id} />
						{/* <FormArrayFieldsDropdown arrayId={formArrayElement.id} /> */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => actions.removeFormArray(formArrayElement.id)}
							className="h-8 w-8 p-0 text-destructive hover:text-destructive"
						>
							<DeleteIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<Reorder.Group
					axis="y"
					values={formArrayElement.arrayField}
					onReorder={(newOrder) =>
						actions.reorderFormArrayFields(formArrayElement.id, newOrder)
					}
					className="space-y-2 relative"
					{...getTransitionProps(isLayoutTransitioning)}
				>
					{formArrayElement.arrayField.map((field, fieldIndex: number) => {
						if (Array.isArray(field)) {
							return (
								<Reorder.Item
									key={`nested-${field[0].id}`}
									value={field}
									className="flex items-center justify-start gap-2 pl-2"
									layout
									{...getTransitionProps(isLayoutTransitioning)}
								>
									<LucideGripVertical
										size={20}
										className="dark:text-muted-foreground text-muted-foreground"
									/>
									<Reorder.Group
										axis="x"
										values={field}
										onReorder={(newOrder) => {
											const updatedArrayField = [
												...formArrayElement.arrayField,
											];
											updatedArrayField[fieldIndex] = newOrder;
											actions.updateFormArray(
												formArrayElement.id,
												updatedArrayField,
											);
										}}
										className="flex items-center justify-start gap-2 w-full"
										tabIndex={-1}
										{...getTransitionProps(isLayoutTransitioning)}
									>
										{field.map((el, j) => (
											<Reorder.Item
												key={el.id}
												value={el}
												className="w-full rounded-xl border border-dashed py-1.5 bg-background"
												layout
												{...getTransitionProps(isLayoutTransitioning)}
											>
												<FormArrayFieldItem
													element={el}
													fieldIndex={fieldIndex}
													arrayId={formArrayElement.id}
													mainFieldIndex={mainFieldIndex}
													nestedIndex={j}
													formArrayElement={formArrayElement}
													isLayoutTransitioning={isLayoutTransitioning}
												/>
											</Reorder.Item>
										))}
									</Reorder.Group>
								</Reorder.Item>
							);
						}
						return (
							<Reorder.Item
								key={field.id}
								value={field}
								className="w-full rounded-xl border border-dashed py-1.5 bg-background"
								layout
								{...getTransitionProps(isLayoutTransitioning)}
							>
								<FormArrayFieldItem
									element={field}
									fieldIndex={fieldIndex}
									arrayId={formArrayElement.id}
									mainFieldIndex={mainFieldIndex}
									formArrayElement={formArrayElement}
									isLayoutTransitioning={isLayoutTransitioning}
								/>
							</Reorder.Item>
						);
					})}
				</Reorder.Group>
			</div>
		</Reorder.Item>
	);
};
// Sortable wrapper for form elements
const SortableFormElement = ({
	element,
	index,
	isLayoutTransitioning,
}: {
	element: FormElementOrList;
	index: number;
	isLayoutTransitioning: boolean;
}) => {
	const { actions } = useFormStore();
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: Array.isArray(element) ? element[0].id : element.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// Handle FormArray
	if (
		typeof element === "object" &&
		element !== null &&
		"arrayField" in element
	) {
		const formArrayElement = element as unknown as FormArray;
		return (
			<div
				ref={setNodeRef}
				style={style}
				className={`rounded-xl border-2 border-dashed border-muted-foreground/30 py-3 w-full bg-muted/20 ${
					isDragging ? "opacity-50" : ""
				}`}
				{...attributes}
				{...listeners}
			>
				<FormArrayItemContainer
					formArrayElement={formArrayElement}
					actions={actions}
					mainFieldIndex={index}
					isLayoutTransitioning={isLayoutTransitioning}
				/>
			</div>
		);
	}

	// Handle arrays
	if (Array.isArray(element)) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className={`flex items-center justify-start gap-2 pl-2 ${
					isDragging ? "opacity-50" : ""
				}`}
				{...attributes}
				{...listeners}
			>
				<LucideGripVertical
					size={20}
					className="dark:text-muted-foreground text-muted-foreground"
				/>
				<Reorder.Group
					axis="x"
					onReorder={(newOrder) => {
						actions.reorder({ newOrder, fieldIndex: index });
					}}
					values={element}
					className="flex items-center justify-start gap-2 w-full relative"
					tabIndex={-1}
					{...getTransitionProps(isLayoutTransitioning)}
				>
					{element.map((el: FormElement, j: number) => (
						<Reorder.Item
							key={el.id}
							value={el}
							className="w-full rounded-xl border border-dashed py-1.5 bg-background"
							layout
							{...getTransitionProps(isLayoutTransitioning)}
						>
							<EditFormItem key={el.id} fieldIndex={index} j={j} element={el} />
						</Reorder.Item>
					))}
				</Reorder.Group>
			</div>
		);
	}

	// Handle single elements
	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`rounded-xl border border-dashed py-1.5 w-full bg-background ${
				isDragging ? "opacity-50" : ""
			}`}
			{...attributes}
			{...listeners}
		>
			<EditFormItem
				key={element.id}
				fieldIndex={index}
				element={element as FormElement}
			/>
		</div>
	);
};

//======================================
export function FormEdit() {
	const isMultiStep = useIsMultiStep();
	const { formElements, actions } = useFormStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLayoutTransitioning, setIsLayoutTransitioning] = useState(false);
	const [optimisticElements, setOptimisticElements] = useState(
		formElements as FormElementOrList[],
	);

	useEffect(() => {
		setOptimisticElements(formElements as FormElementOrList[]);
	}, [formElements]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = optimisticElements.findIndex((el) =>
			Array.isArray(el) ? el[0].id === active.id : el.id === active.id,
		);
		const newIndex = optimisticElements.findIndex((el) =>
			Array.isArray(el) ? el[0].id === over.id : el.id === over.id,
		);

		if (oldIndex !== -1 && newIndex !== -1) {
			const newOrder = [...optimisticElements];
			const [moved] = newOrder.splice(oldIndex, 1);
			newOrder.splice(newIndex, 0, moved);
			setOptimisticElements(newOrder);
			actions.reorder({ newOrder, fieldIndex: null });
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let resizeTimeout: NodeJS.Timeout;

		const resizeObserver = new ResizeObserver(() => {
			// Set transitioning state when resize starts
			setIsLayoutTransitioning(true);

			// Clear existing timeout
			if (resizeTimeout) clearTimeout(resizeTimeout);

			// Reset transitioning state after transition completes
			resizeTimeout = setTimeout(() => {
				setIsLayoutTransitioning(false);
			}, 350); // Slightly longer than our CSS transition duration
		});

		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
			if (resizeTimeout) clearTimeout(resizeTimeout);
		};
	}, []);

	switch (isMultiStep) {
		case true:
			return (
				<div ref={containerRef} className="w-full">
					<Reorder.Group
						values={formElements as FormStep[]}
						onReorder={(newOrder) => {
							actions.reorderSteps(newOrder);
						}}
						className="flex flex-col gap-4 relative"
						layoutScroll
						{...getTransitionProps(isLayoutTransitioning)}
					>
						{(formElements as FormStep[]).map((step, stepIndex) => {
							return (
								<Reorder.Item
									value={step}
									key={step.id}
									layout
									{...getTransitionProps(isLayoutTransitioning)}
								>
									<StepContainer stepIndex={stepIndex}>
										<Reorder.Group
											axis="y"
											onReorder={(newOrder) => {
												actions.reorder({ newOrder, stepIndex });
											}}
											values={step.stepFields}
											className="flex flex-col gap-3"
											tabIndex={-1}
											{...getTransitionProps(isLayoutTransitioning)}
										>
											{step.stepFields.length === 0 && (
												<NoFieldPlaceholder
													title="No Form Element For this Step Yet"
													showbutton={false}
												/>
											)}
											{step.stepFields.map((element, fieldIndex) => {
												// Check if element is a FormArray
												if (
													typeof element === "object" &&
													element !== null &&
													"arrayField" in element
												) {
													const formArrayElement =
														element as unknown as FormArray;
													return (
														<Reorder.Item
															key={formArrayElement.id}
															value={formArrayElement}
															className="rounded-xl border-2 border-dashed border-muted-foreground/30 py-3 w-full bg-muted/20"
															layout
															{...getTransitionProps(isLayoutTransitioning)}
														>
															<div className="px-3">
																<div className="flex items-center justify-between mb-3">
																	<div className="flex items-center gap-2">
																		<LucideGripVertical
																			size={20}
																			className="dark:text-muted-foreground text-muted-foreground"
																		/>
																		<span className="text-sm font-medium text-muted-foreground">
																			Form Arrays
																		</span>
																	</div>
																	<div className="flex items-center gap-2">
																		<FormElementsDropdown
																			type="FA"
																			arrayId={formArrayElement.id}
																		/>
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				actions.removeFormArray(
																					formArrayElement.id,
																				)
																			}
																			className="h-8 w-8 p-0 text-destructive hover:text-destructive"
																		>
																			<DeleteIcon className="h-4 w-4" />
																		</Button>
																	</div>
																</div>
																<div className="space-y-2">
																	{formArrayElement.arrayField.map(
																		(field, arrayFieldIndex: number) => {
																			if (Array.isArray(field)) {
																				return (
																					<Reorder.Item
																						key={`nested-${arrayFieldIndex}`}
																						value={field}
																						className="flex items-center justify-start gap-2 pl-2"
																						layout
																						{...getTransitionProps(
																							isLayoutTransitioning,
																						)}
																					>
																						<LucideGripVertical
																							size={20}
																							className="dark:text-muted-foreground text-muted-foreground"
																						/>
																						<Reorder.Group
																							axis="x"
																							values={field}
																							onReorder={(newOrder) => {
																								const updatedArrayField = [
																									...formArrayElement.arrayField,
																								];
																								updatedArrayField[
																									arrayFieldIndex
																								] = newOrder;
																								actions.updateFormArray(
																									formArrayElement.id,
																									updatedArrayField,
																								);
																							}}
																							className="flex items-center justify-start gap-2 w-full relative"
																							tabIndex={-1}
																							{...getTransitionProps(
																								isLayoutTransitioning,
																							)}
																						>
																							{field.map((el, j) => (
																								<Reorder.Item
																									key={el.id}
																									value={el}
																									className="w-full rounded-xl border border-dashed py-1.5 bg-background"
																									layout
																									{...getTransitionProps(
																										isLayoutTransitioning,
																									)}
																								>
																									<FormArrayFieldItem
																										element={el}
																										fieldIndex={arrayFieldIndex}
																										arrayId={
																											formArrayElement.id
																										}
																										mainFieldIndex={fieldIndex}
																										stepIndex={stepIndex}
																										nestedIndex={j}
																										formArrayElement={
																											formArrayElement
																										}
																										isLayoutTransitioning={
																											isLayoutTransitioning
																										}
																									/>
																								</Reorder.Item>
																							))}
																						</Reorder.Group>
																					</Reorder.Item>
																				);
																			}
																			return (
																				<div
																					key={field.id}
																					className="w-full rounded-xl border border-dashed py-1.5 bg-background"
																				>
																					<FormArrayFieldItem
																						element={field}
																						fieldIndex={arrayFieldIndex}
																						arrayId={formArrayElement.id}
																						mainFieldIndex={fieldIndex}
																						stepIndex={stepIndex}
																						formArrayElement={formArrayElement}
																						isLayoutTransitioning={
																							isLayoutTransitioning
																						}
																					/>
																				</div>
																			);
																		},
																	)}
																</div>
															</div>
														</Reorder.Item>
													);
												}

												if (Array.isArray(element)) {
													return (
														<Reorder.Item
															key={element[0].id}
															value={element}
															className="flex items-center justify-start gap-2 pl-2"
															layout
															{...getTransitionProps(isLayoutTransitioning)}
														>
															<LucideGripVertical
																size={20}
																className="dark:text-muted-foreground text-muted-foreground"
															/>
															<Reorder.Group
																onReorder={(newOrder) => {
																	actions.reorder({ newOrder, fieldIndex });
																}}
																values={element}
																className="w-full flex items-center justify-start gap-2 relative"
																{...getTransitionProps(isLayoutTransitioning)}
															>
																{element.map((el, j) => (
																	<Reorder.Item
																		value={el}
																		key={el.id}
																		className="w-full rounded-xl border border-dashed py-1.5 bg-background"
																		layout
																		{...getTransitionProps(
																			isLayoutTransitioning,
																		)}
																	>
																		<EditFormItem
																			fieldIndex={fieldIndex}
																			j={j}
																			element={el}
																			stepIndex={stepIndex}
																		/>
																	</Reorder.Item>
																))}
															</Reorder.Group>
														</Reorder.Item>
													);
												}
												return (
													<Reorder.Item
														key={element.id}
														value={element}
														className="w-full rounded-xl border border-dashed py-1.5 bg-background"
														layout
														{...getTransitionProps(isLayoutTransitioning)}
													>
														<EditFormItem
															fieldIndex={fieldIndex}
															element={element}
															stepIndex={stepIndex}
														/>
													</Reorder.Item>
												);
											})}
										</Reorder.Group>
									</StepContainer>
								</Reorder.Item>
							);
						})}
					</Reorder.Group>
				</div>
			);
		default:
			if (formElements.length === 0) {
				return <NoFieldPlaceholder />;
			}
			return (
				<div ref={containerRef} className="w-full">
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={optimisticElements.map((el) =>
								Array.isArray(el) ? el[0].id : el.id,
							)}
							strategy={verticalListSortingStrategy}
						>
							<div className="flex flex-col gap-3 rounded-lg px-3 md:px-4 md:py-5 py-4 border-dashed border bg-muted relative">
								{optimisticElements.map((element, i) => (
									<SortableFormElement
										key={Array.isArray(element) ? element[0].id : element.id}
										element={element}
										index={i}
										isLayoutTransitioning={isLayoutTransitioning}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				</div>
			);
	}
}
