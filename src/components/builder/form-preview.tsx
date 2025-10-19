/** biome-ignore-all lint/correctness/useUniqueElementIds: Need this for Focus State */
import { FormArrayPreview } from "@/components/builder/form-array-preview";
import { MultiStepFormPreview } from "@/components/builder/multi-step-preview";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { AppForm } from "@/hooks/use-form-builder";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import type { FormArray, FormElement, FormStep } from "@/types/form-types";
import { FrownIcon } from "../ui/frown";
import { FormElementsDropdown } from "./form-elements-dropdown";

interface FormPreviewProps {
	form: AppForm;
}

export function SingleStepFormPreview({ form }: FormPreviewProps) {
	const { formElements, formName } = useFormStore();
	const isMS = useIsMultiStep();
	if (formElements.length < 1)
		return (
			<div className="h-full py-10 px-3">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FrownIcon size={40} />
						</EmptyMedia>
						<EmptyTitle>No Field To Preview Yet</EmptyTitle>
						<EmptyDescription>
							You haven&apos;t added any form elements yet. Get started by
							creating your first form element.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<div className="flex gap-2">
							<FormElementsDropdown />
						</div>
					</EmptyContent>
				</Empty>
			</div>
		);
	return (
		<div className="w-full animate-in rounded-md">
			<form.AppForm>
				<form.Form id={formName} noValidate>
					{isMS ? (
						<MultiStepFormPreview
							formElements={formElements as unknown as FormStep[]}
							form={form}
						/>
					) : (
						formElements.map((element, i) => {
							// Check if element is a FormArray
							if (
								typeof element === "object" &&
								element !== null &&
								"arrayField" in element
							) {
								return (
									<div key={element.id} className="w-full">
										<FormArrayPreview
											formArray={element as FormArray}
											form={form}
											index={i}
										/>
									</div>
								);
							}

							if (Array.isArray(element)) {
								return (
									<div
										key={element[i]?.id ?? i}
										className="flex items-start flex-wrap sm:flex-nowrap w-full gap-2"
									>
										{element.map((el) => (
											<div
												key={(el as FormElement)?.name}
												className="flex-1 min-w-0"
											>
												<RenderFormElement
													formElement={el as FormElement}
													form={form}
												/>
											</div>
										))}
									</div>
								);
							}
							return (
								<div key={(element as FormElement)?.name} className="w-full">
									<RenderFormElement
										formElement={element as FormElement}
										form={form}
									/>
								</div>
							);
						})
					)}
					{!isMS && (
						<div className="flex items-center justify-end w-full pt-3">
							<Button type="submit" className="rounded-lg" size="sm">
								{form.baseStore.state.isSubmitting
									? "Submitting..."
									: form.baseStore.state.isSubmitted
										? "Submitted"
										: "Submit"}
							</Button>
						</div>
					)}
				</form.Form>
			</form.AppForm>
		</div>
	);
}
