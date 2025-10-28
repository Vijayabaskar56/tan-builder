import { ErrorBoundary } from "@/components/error-boundary";
import FormHeader from "@/components/form-components/form-header";
import Loader from "@/components/loader";
import { NotFound } from "@/components/not-found";
import { settingsCollection } from "@/db-collections/settings.collections";
import type { FormElementsSchema } from "@/lib/search-schema";
import { logger } from "@/utils/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
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

		useEffect(() => {
			const initializeSettings = () => {
				if (typeof window !== "undefined") {
					logger("settingsCollection", settingsCollection);
					if (!settingsCollection.has("user-settings")) {
						logger("inserting settings");
						settingsCollection?.insert([
							{
								id: "user-settings",
								activeTab: "builder",
								defaultRequiredValidation: true,
								numericInput: false,
								focusOnError: true,
								validationMethod: "onDynamic",
								asyncValidation: 300,
								preferredSchema: "zod",
								preferredFramework: "react",
								preferredPackageManager: "pnpm",
								isCodeSidebarOpen: false,
							},
						]);
					}
				} else {
					logger("settingsCollection is undefined");
				}
			};

			initializeSettings();
		}, []);

	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
