export const seo = ({
	title = "TanCN - Form and Table Builder",
	description = "Help you Quickly Scaffold Forms and Tables using TanStack Libraries",
	keywords = "form builder, table builder, tanstack, react",
	image = "https://tancn.dev/assets/twitter-image.jpg",
	url = "https://tancn.dev/",
	siteName = "tancn",
	twitterSite = "@vijayabaskar56",
	twitterCreator = "@vijayabaskar56",
}: {
	title?: string;
	description?: string;
	image?: string;
	keywords?: string;
	url?: string;
	siteName?: string;
	twitterSite?: string;
	twitterCreator?: string;
}) => {
	const tags = [
		{ title },
		{ name: "description", content: description },
		{ name: "keywords", content: keywords },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:creator", content: twitterCreator },
		{ name: "twitter:site", content: twitterSite },
		{ name: "twitter:url", content: url },
		{ name: "og:type", content: "website" },
		{ name: "og:title", content: title },
		{ name: "og:description", content: description },
		{ name: "og:url", content: url },
		{ name: "og:site_name", content: siteName },
		...(image
			? [
					{ name: "twitter:image", content: image },
					{ name: "twitter:card", content: "summary_large_image" },
					{ name: "og:image", content: image },
				]
			: []),
	];

	return tags;
};
