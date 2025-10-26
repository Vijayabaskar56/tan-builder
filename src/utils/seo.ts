interface SEOParams {
	title: string;
	description: string;
	keywords: string;
	image: string;
	url: string;
	siteName: string;
	twitterSite: string;
	twitterCreator: string;
}

export const seo = (overrides: Partial<SEOParams> = {}) => {
	const defaults: SEOParams = {
		title: "tancn - Form and Table Builder",
		description:
			"Help you Quickly Scaffold Forms and Tables using TanStack Libraries",
		keywords: "form builder, table builder, tanstack, react",
		image: "https://tancn.dev/assets/og-image.avif",
		url: "https://tancn.dev/",
		siteName: "tancn",
		twitterSite: "@vijayabaskar56",
		twitterCreator: "@vijayabaskar56",
	};

	const params = { ...defaults, ...overrides };

	const meta = [
		{ charSet: "utf-8" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ name: "description", content: params.description },
		{ name: "keywords", content: params.keywords },
		// Open Graph meta tags
		{ property: "og:title", content: params.title },
		{ property: "og:description", content: params.description },
		{ property: "og:type", content: "website" },
		{ property: "og:image", content: params.image },
		{ property: "og:image:secure_url", content: params.image },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{
			property: "og:image:alt",
			content: `${params.title} - Visual Builder for React`,
		},
		{ property: "og:url", content: params.url },
		{ property: "og:site_name", content: params.siteName },
		// Twitter Card meta tags
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: params.title },
		{ name: "twitter:description", content: params.description },
		{ name: "twitter:image", content: params.image },
		{
			name: "twitter:image:alt",
			content: `${params.title} - Visual Builder for React`,
		},
		{ name: "twitter:url", content: params.url },
		{ name: "twitter:site", content: params.twitterSite },
		{ name: "twitter:creator", content: params.twitterCreator },
	];

	return { title: params.title, meta };
};
