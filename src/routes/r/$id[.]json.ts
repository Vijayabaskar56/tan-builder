import { headerRateLimiter } from "@/lib/header-rate-limiter";
import { logger } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { v4 as uuid } from "uuid";

const responseHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
};

export const Route = createFileRoute("/r/$id.json")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const id = params["id.json"];
				const registryId = id?.endsWith(".json") ? id?.slice(0, -5) : id;
				try {
					let registryItem = await env.CACHE.get(registryId);
					if (!registryItem) {
						return new Response("Registry item not found", {
							status: 404,
							headers: responseHeaders,
						});
					}
					return new Response(registryItem, {
						status: 200,
						headers: responseHeaders,
					});
				} catch (error) {
					console.error(error);
					return new Response("Something went wrong", {
						status: 500,
						headers: responseHeaders,
					});
				}
			},
			POST: async ({ request }) => {
				const { allowed, info } = headerRateLimiter.check(request);

				if (!allowed) {
					return new Response(
						JSON.stringify({
							data: null,
							error:
								"Rate limit exceeded. You can make 3 requests per hour. Please try again later. or Copy the code manually",
						}),
						{
							status: 429,
							headers: {
								...responseHeaders,
								...headerRateLimiter.getHeaders(info),
								"X-Last-Request-Time": Date.now().toString(),
							},
						},
					);
				}

				try {
					const body = (await request.json()) as {
						registryDependencies: any[];
						dependencies: any[];
						files: any[];
						name: string;
					};
					const { registryDependencies, dependencies, files, name } = body;
					const id = `${name}-${uuid()}`;
					const registry = {
						$schema: "https://ui.shadcn.com/schema/registry.json",
						homepage: "https://tanstack-form-builder.dev",
						author: "tanstack-form-builder (https://tanstack-form-builder.dev)",
						name,
						dependencies,
						registryDependencies,
						type: "registry:block",
						files,
					};
					await env.CACHE.put(id, JSON.stringify(registry), {
						expirationTtl: 60 * 60 * 24, // 1 day
					});
					return new Response(
						JSON.stringify({
							data: {
								id: `https://tan-form-builder.baskar.dev/r/${id}.json`,
							},
							error: null,
						}),
						{
							status: 200,
							headers: {
								...responseHeaders,
								...headerRateLimiter.getHeaders(info),
								"X-Last-Request-Time": Date.now().toString(),
							},
						},
					);
				} catch (error: any) {
					logger(error);
					return new Response(
						JSON.stringify({
							data: null,
							error: error?.message || "Something went wrong",
						}),
						{
							status: 500,
							headers: {
								...responseHeaders,
								...headerRateLimiter.getHeaders(info),
								"X-Last-Request-Time": Date.now().toString(),
							},
						},
					);
				}
			},
		},
	},
});
