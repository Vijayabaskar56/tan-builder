import { ErrorBoundary } from "@/components/error-boundary";
import FormHeader from "@/components/form-components/form-header";
import Loader from "@/components/loader";
import { NotFound } from "@/components/not-found";
import type { FormElementsSchema } from "@/lib/search-schema";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type * as v from "valibot";

export const Route = createFileRoute("/form-builder")({
	component: FormBuilderLayout,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: true,
	loader: ({
		location,
	}): v.InferOutput<typeof FormElementsSchema> | undefined => {
		if ((location?.search as unknown as { share: string })?.share) {
			localStorage.setItem(
				"share",
				JSON.stringify((location.search as unknown as { share: string }).share),
			);
			throw redirect({
				to: "/form-builder",
			});
		}
		return undefined;
	},
	pendingComponent : Loader,
});

function FormBuilderLayout() {

	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
