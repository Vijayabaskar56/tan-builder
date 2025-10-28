import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CheckCircle,
	Circle,
	Clock,
	Code,
	Eye,
	Layers,
	Move,
	Palette,
	Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CTASection from "@/components/cta";
import { ErrorBoundary } from "@/components/error-boundary";
import FAQSection from "@/components/faq";
import FooterSection from "@/components/footer";
import { NotFound } from "@/components/not-found";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { logger } from "@/utils/utils";
import { settingsCollection } from "@/db-collections/settings.collections";
export const Route = createFileRoute("/")({
	component: HomePage,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	pendingComponent: Loader,
});

// features array removed as it is unused
const features = [
	{
		title: "Drag & Drop Builder",
		icon: Move,
		description: (
			<>
				Intuitive{" "}
				<span className="font-bold text-primary">drag-and-drop interface</span>{" "}
				for building forms quickly. Add, rearrange, and configure{" "}
				<span className="font-bold text-primary">form fields</span> with ease.
			</>
		),
	},
	{
		title: "Type-Safe Code Generation",
		icon: Code,
		description: (
			<>
				Generate{" "}
				<span className="font-bold text-primary">
					fully typed React components
				</span>{" "}
				with TypeScript support. Automatic{" "}
				<span className="font-bold text-primary">schema generation</span> for
				form validation.
			</>
		),
	},
	{
		title: "ShadCN UI Integration",
		icon: Palette,
		description: (
			<>
				Seamlessly integrated with{" "}
				<span className="font-bold text-primary">ShadCN UI components</span>.
				Generate{" "}
				<span className="font-bold text-primary">customizable, accessible</span>{" "}
				form components out of the box.
			</>
		),
	},
	{
		title: "Multi-Step & Field Arrays",
		icon: Layers,
		description: (
			<>
				Create{" "}
				<span className="font-bold text-primary">complex multi-step forms</span>{" "}
				and dynamic field arrays. Perfect for{" "}
				<span className="font-bold text-primary">
					advanced form requirements
				</span>{" "}
				and data structures.
			</>
		),
	},
	{
		title: "Save, Share & Export",
		icon: Share2,
		description: (
			<>
				Save your{" "}
				<span className="font-bold text-primary">form configurations</span>,
				share them with team members, and export{" "}
				<span className="font-bold text-primary">generated code</span> for
				immediate use in your projects.
			</>
		),
	},
	{
		title: "Real-time Preview",
		icon: Eye,
		description: (
			<>
				See your{" "}
				<span className="font-bold text-primary">form changes instantly</span>{" "}
				with live preview. Test{" "}
				<span className="font-bold text-primary">
					form behavior and styling
				</span>{" "}
				as you build.
			</>
		),
	},
];

const assets = {
	one: {
		dark: "/assets/slide-1-dark.avif",
		light: "/assets/slide-1-light.avif",
	},
	two: {
		dark: "/assets/slide-2-dark.avif",
		light: "/assets/slide-2-light.avif",
	},
	three: {
		dark: "/assets/slide-3-dark.avif",
		light: "/assets/slide-3-light.avif",
	},
};

const roadmapItems = [
	// Completed Features
	{
		title: "Core Form Builder",
		description: "Drag-and-drop form builder with real-time preview",
		status: "completed",
	},
	{
		title: "Type-Safe Code Generation",
		description: "Generate fully typed React components with TypeScript",
		status: "completed",
	},
	{
		title: "ShadCN UI Integration",
		description: "Seamless integration with ShadCN UI components",
		status: "completed",
	},
	{
		title: "Multi-Step Forms",
		description: "Support for complex multi-step form workflows",
		status: "completed",
	},
	{
		title: "Field Array Support",
		description: "Dynamic field arrays for complex data structures",
		status: "completed",
	},
	{
		title: "Schema Generation",
		description: "Automatic schema generation for form validation",
		status: "completed",
	},

	// In Progress Features
	{
		title: "Save & Share",
		description: "Save and share form configurations",
		status: "completed",
	},
	{
		title: "Templates",
		description: "Pre-built form templates for common use cases",
		status: "completed",
	},
	{
		title: "Advanced Validation",
		description: "Custom validation rules and error handling",
		status: "in-progress",
	},
	{
		title: "SolidJS Support",
		description: "Support for SolidJS",
		status: "in-progress",
	},

	// Planned Features
	{
		title: "Auto-Save",
		description: "Auto-save form configurations",
		status: "planned",
	},
	{
		title: "Server Funtion for Form Submission",
		description: "Server function for form submission",
		status: "planned",
	},
	{
		title: "Single Command Code Generation",
		description: "Single command code generation With ShadCN Registry",
		status: "planned",
	},
	{
		title: "React Native Support",
		description: "Generate React Native forms",
		status: "planned",
	},
];

function HomePage() {
	const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);

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
					setIsSettingsInitialized(true);
				} else {
					logger("settingsCollection is undefined");
					setIsSettingsInitialized(true);
				}
			};

			initializeSettings();
		}, []);

	const [activeCard, setActiveCard] = useState(0);
	const [progress, setProgress] = useState(0);
	const { theme, systemTheme } = useTheme();
	const resolvedTheme = useMemo(
		() =>
			(theme === "system"
				? systemTheme === "dark"
					? "dark"
					: "light"
				: theme || "light") as "dark" | "light",
		[theme, systemTheme],
	);
	useEffect(() => {
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					setActiveCard((current) => (current + 1) % 3);
					return 0;
				}
				return prev + 2; // 2% every 100ms = 5 seconds total
			});
		}, 100);

		return () => {
			clearInterval(progressInterval);
		};
	}, []);

	const handleCardClick = (index: number) => {
		setActiveCard(index);
		setProgress(0);
	};

	return (
		<div className="w-full min-h-screen relative bg-background overflow-x-hidden flex flex-col justify-start items-center">
			<div className="relative flex flex-col justify-start items-center w-full">
				<div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
					<div className="self-stretch pt-[9px] overflow-hidden border-b border-border flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
						<div className="pt-16  md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
							<div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
								<div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
									<div className="w-full flex justify-center items-center max-w-[748.71px] lg:w-[748.71px] text-center  text-foreground text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[70px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-instrument-serif  px-2 sm:px-4 md:px-0">
										<div className="relative">
											<div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/10 dark:via-primary/5 rounded-full blur-3xl scale-150"></div>
											<h1 className="font-bold">TANCN</h1>
											{/* <svg
												width="500"
												height="200"
												viewBox="0 0 1669 400"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="relative z-10"
											>
												<title>TanCN Logo</title>
												<path
													className="fill-primary"
													d="M1124.22 101.584C1127.07 100.951 1129.93 100.44 1132.79 100L1105.87 126.756C1094.92 131.081 1084.49 136.535 1074.28 142.739C1064.14 148.904 1054.44 155.22 1045.64 163.155C1032.57 174.956 1022.58 189.299 1013.86 204.281C1004.89 219.717 999.129 237.706 996.346 255.162C993.617 272.286 993.167 290.291 996.294 307.43C1000.2 328.857 1007.64 348.964 1019.39 367.561C1023.34 365.777 1026.14 361.71 1029.41 358.97C1036.02 353.437 1042.96 348.309 1050.42 343.884C1053.18 342.246 1056.01 340.974 1059.01 339.808C1060.14 339.368 1061.99 338.967 1062.52 337.765C1063.37 335.856 1061.8 332.535 1061.53 330.557C1060.77 324.902 1060.3 319.15 1060.45 313.443C1060.87 296.822 1064.08 279.97 1070.19 264.413C1074.8 252.691 1081.83 242.048 1090.17 232.497C1093 229.255 1096 226.239 1099.11 223.246C1100.94 221.477 1103.22 219.964 1104.36 217.695C1098.37 217.699 1092.39 219.368 1086.7 221.064C1074.44 224.716 1062.49 230.135 1052.33 237.781C1047.69 241.269 1044.29 245.841 1039.91 249.512C1038.56 250.638 1036.15 252.148 1034.3 251.298C1031.49 250.015 1031.92 244.668 1031.6 242.21C1030.36 232.757 1034.06 220.801 1038.77 212.607C1046.32 199.453 1060.28 188.222 1076.67 188.614C1083.75 188.783 1089.95 191.164 1096.72 192.717C1095 190.358 1092.7 188.638 1090.51 186.704C1085.15 181.965 1079.29 177.637 1072.85 174.363C1070.26 173.046 1067.47 172.246 1064.74 171.278C1063.36 170.792 1061.63 170.123 1061.11 168.644C1060.16 165.905 1065.25 163.369 1067.12 162.214C1074.36 157.749 1083.24 154.077 1091.95 153.87C1105.56 153.547 1118.86 160.854 1124.46 173.29C1126.44 177.661 1127.02 182.284 1127.41 186.95L1127.48 187.825L1127.58 189.139C1127.59 189.285 1127.6 189.431 1127.61 189.577L1127.68 190.453L1127.75 191.33C1132.02 187.958 1135.03 182.995 1139.2 179.384C1148.97 170.937 1162.33 167.187 1175 170.989C1186.46 174.425 1196.42 182.075 1202.28 192.255C1203.81 194.918 1208.09 201.428 1205 204.08C1202.58 206.157 1199.51 204.539 1196.96 203.677C1195.03 203.025 1193.03 202.612 1191.03 202.229L1189.94 202.022C1189.57 201.953 1189.21 201.884 1188.85 201.813C1181.91 200.468 1173.84 200.607 1166.89 201.79C1162.39 202.555 1158 204.102 1153.52 204.744V205.669C1165.77 205.767 1177.61 212.526 1183.66 222.783C1186.16 227.032 1187.41 231.896 1188.37 236.66C1189.55 242.547 1188.72 248.961 1187.06 254.699C1186.5 256.623 1185.49 259.884 1183.11 260.327C1181.43 260.64 1180 259.022 1179.04 257.93C1176.53 255.069 1174.14 252.348 1171.19 249.877C1163.72 243.627 1155.82 237.861 1147.8 232.302C1143.53 229.35 1138.86 225.512 1133.95 223.708C1135.33 226.927 1136.69 229.919 1137.16 233.422C1138.54 243.725 1134.08 253.424 1127.39 261.175C1125.34 263.54 1123.16 265.923 1120.59 267.761C1119.52 268.523 1118.18 269.518 1116.77 269.303C1112.34 268.626 1111.81 262.17 1111.14 258.862C1108.84 247.659 1109.76 236.531 1112.95 225.558C1110.11 226.951 1108.06 229.997 1106.28 232.497C1102.36 237.996 1098.96 243.812 1096.52 250.074C1086.8 275.014 1086.9 304.226 1099.48 328.236C1100.89 330.917 1103.02 330.557 1105.79 330.557C1106.21 330.557 1106.62 330.555 1107.04 330.551L1108.3 330.539C1110.81 330.513 1113.33 330.503 1115.81 330.824C1117.1 330.99 1118.89 330.842 1119.92 331.761C1121.14 332.863 1120.49 334.752 1120.2 336.108C1119.42 339.898 1119.15 343.343 1119.15 347.209C1124.38 346.426 1125.83 338.321 1127.68 334.258C1129.78 329.655 1131.91 325.047 1133.86 320.381C1134.81 318.088 1136.09 315.524 1135.75 312.98C1135.38 310.122 1133.24 307.092 1131.76 304.654C1128.94 300.041 1125.74 295.294 1123.67 290.315C1122.01 286.335 1123.55 281.361 1128.22 279.939C1130.8 279.155 1133.55 280.693 1135.23 282.496C1138.74 286.273 1141.01 291.895 1143.57 296.329L1163.48 331.02C1165.17 333.958 1166.87 336.892 1168.6 339.808C1169.27 340.946 1169.96 342.703 1171.34 343.188C1172.57 343.62 1174.26 343.006 1175.48 342.769C1178.66 342.153 1181.84 341.487 1185.03 340.93C1188.85 340.261 1194.68 340.387 1197.44 337.496C1193.41 336.26 1188.75 336.333 1184.55 336.612C1182.03 336.779 1179.24 337.651 1176.92 336.227C1173.47 334.108 1171.18 329.212 1169.07 325.932C1163.87 317.843 1158.97 309.632 1154 301.417L1153.2 300.109L1151.6 297.495C1150.8 296.187 1150 294.876 1149.23 293.553C1148.64 292.53 1147.76 291.182 1148.61 290.054C1149.51 288.869 1151.46 288.799 1153.22 288.797L1153.57 288.797C1154.26 288.798 1154.91 288.799 1155.43 288.732C1162.54 287.827 1169.74 287.078 1176.91 287.078C1176.36 285.2 1174.76 283.077 1175.27 281.066C1176.41 276.567 1183.1 275.16 1186.21 278.388C1188.3 280.555 1189.52 283.538 1190.87 286.152C1192.67 289.604 1194.71 292.941 1196.63 296.329C1199.99 302.259 1203.66 308.026 1207.12 313.905C1207.41 314.39 1207.7 314.873 1208 315.355L1208.44 316.078C1209.93 318.488 1211.43 320.915 1212.24 323.619C1200.23 323.088 1191.22 309.603 1185.98 300.492C1185.57 301.95 1186.24 303.253 1186.79 304.654C1187.91 307.566 1189.26 310.339 1190.96 312.98C1193.38 316.752 1196.16 320.636 1199.83 323.374C1206.33 328.233 1214.91 328.26 1222.74 327.741C1227.76 327.407 1234.03 325.196 1238.97 326.696C1243.9 328.194 1245.88 333.454 1242.95 337.495C1240.76 340.522 1237.83 341.665 1234.19 342.121C1236.77 347.463 1240.14 352.421 1242.58 357.848C1243.6 360.109 1244.66 363.574 1247.1 364.767C1248.73 365.56 1251.05 364.821 1252.81 364.786C1251.05 360.274 1247.75 356.446 1246.13 351.835C1251.07 352.053 1255.85 354.548 1260.45 356.14C1269.5 359.272 1278.43 362.696 1287.36 366.151L1291.48 367.746C1295.15 369.169 1298.84 370.577 1302.45 372.123C1303.78 372.689 1304.76 373.445 1306.49 374.005L1326.23 383.796C1311.56 404.946 1292.4 423.009 1270.41 437.174C1246.2 452.764 1217.89 462.306 1189.08 465.685C1152.42 469.986 1112.78 463.701 1079.82 447.35C1017.94 416.653 975.872 354.872 975.04 287.168C974.88 274.114 975.09 260.983 977.761 248.057C982.111 227.005 989.696 206.655 1001.09 188.183C1013.41 168.2 1029.32 150.566 1048.38 136.349C1070.74 119.677 1096.71 107.685 1124.22 101.584ZM1087.65 405.414C1079.13 406.298 1070.14 407.798 1062.83 412.429C1064.47 412.812 1066.36 412.432 1068.08 412.429C1072.2 412.422 1076.37 412.272 1080.49 412.447C1090.81 412.885 1101.56 414.482 1111.52 417.125C1124.27 420.509 1135.51 427.168 1147.8 431.659C1160.76 436.397 1173.66 437.869 1187.41 437.869C1194.34 437.869 1201.22 437.849 1207.94 436.019C1204.43 434.212 1199.41 434.551 1195.53 433.799C1187.1 432.165 1178.81 430.171 1170.71 427.373C1164.74 425.313 1158.99 422.771 1153.27 420.175L1149.6 418.503C1144.29 416.089 1138.97 413.707 1133.48 411.7C1119.04 406.424 1103.04 403.817 1087.65 405.414ZM1100.54 370.337C1083.65 370.337 1066.57 373.215 1051.37 380.628C1047.69 382.424 1044.19 384.563 1040.87 386.935C1039.86 387.658 1038.07 388.587 1037.69 389.843C1037.31 391.118 1038.67 392.186 1039.44 393.002C1043.24 391.042 1046.85 388.968 1050.89 387.481C1077.06 377.862 1108.79 379.878 1134.91 388.698C1147.93 393.096 1159.93 399.673 1172.62 404.832C1186.8 410.601 1201.3 414.341 1216.53 416.26C1234.51 418.521 1255 416.688 1271.43 408.841C1277.2 406.084 1285.22 401.882 1287.66 395.777C1284.64 396.032 1281.93 397.282 1279.06 398.143C1274.51 399.513 1269.9 400.675 1265.22 401.582C1249.36 404.656 1232.5 405.291 1216.53 402.501C1201.48 399.872 1187.5 394.591 1173.58 389.036L1171.81 388.326C1170.62 387.852 1169.44 387.376 1168.25 386.901L1166.48 386.188C1159.37 383.339 1152.23 380.524 1144.93 378.059C1130.75 373.271 1115.56 370.337 1100.54 370.337ZM1208.42 349.35C1198.27 351.911 1187.8 354.232 1177.39 355.535C1178.76 360.046 1182.11 364.435 1184.56 368.486C1185.5 370.053 1186.52 372.151 1188.39 372.831C1190.5 373.599 1193.06 372.353 1195.05 371.724C1194.13 369.279 1192.57 367.079 1191.3 364.786C1190.78 363.841 1189.97 362.721 1190.4 361.599C1191.22 359.477 1194.61 359.602 1196.48 359.234C1201.43 358.262 1206.33 357.05 1211.28 356.09C1213.11 355.736 1215.65 354.778 1217.48 355.37C1218.85 355.813 1219.68 356.908 1220.46 358.049L1220.81 358.564C1221.28 359.249 1221.76 359.918 1222.36 360.441C1224.36 362.19 1227.36 362.458 1229.9 362.936C1228.35 359.559 1225.77 356.605 1224.12 353.222C1223.16 351.255 1222.37 348.361 1220.26 347.224C1217.37 345.658 1211.38 348.603 1208.42 349.35ZM1144.45 326.857C1143.98 332.721 1142.12 337.492 1139.2 342.584C1142.54 342.993 1145.95 343.138 1149.23 343.925C1151.69 344.514 1153.95 345.638 1156.39 346.284C1155.08 342.834 1152.67 339.757 1150.79 336.57C1148.9 333.354 1147.21 329.446 1144.45 326.857Z"
													fill="#CC9C42"
												/>
												<path
													className="fill-secondary-foreground"
													d="M16.3352 169.771V111.455H291.094V169.771H188.672V446H118.757V169.771H16.3352ZM353.127 446H277.331L392.821 111.455H483.972L599.299 446H523.503L439.703 187.903H437.09L353.127 446ZM348.39 314.501H527.424V369.714H348.39V314.501ZM919.387 111.455V446H858.294L712.747 235.439H710.297V446H639.565V111.455H701.639L846.042 321.852H848.983V111.455H919.387Z"
													fill="white"
												/>
												<path
													className="fill-secondary-foreground"
													d="M1641.04 111.455V446H1579.95L1434.4 235.439H1431.95V446H1361.22V111.455H1423.29L1567.7 321.852H1570.64V111.455H1641.04Z"
													fill="white"
												/>
											</svg> */}
										</div>
									</div>
									<div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45]  lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
										Build powerful forms with ease using TanStack technologies
										<br className="hidden sm:block" />
										Code generation with 100% Type-Safe.
									</div>
								</div>
							</div>

							<div className="w-full max-w-[497px] lg:w-[497px] flex justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
								<Button
									variant="default"
									size="lg"
									className="w-32 rounded"
									asChild
								>
									<Link to="/form-builder">Start Building</Link>
								</Button>
								<Button
									variant="default"
									size="lg"
									className="w-32 rounded"
									asChild
								>
									<Link to="/form-registry">Form Registry</Link>
								</Button>
							</div>

							<div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
								<img
									src="/mask-group-pattern.svg"
									alt=""
									className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
									style={{
										filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
									}}
								/>
							</div>

							<div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
								<div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[550px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start">
									<div className="self-stretch flex-1 flex justify-start items-start">
										<div className="w-full h-full flex items-center justify-center">
											<div className="relative w-full h-full overflow-hidden">
												<div
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
														activeCard === 0 ? "opacity-100" : "opacity-0"
													}`}
												>
													<img
														key={resolvedTheme}
														src={assets.one[resolvedTheme]}
														alt="Form Builder Interface"
														className="w-full h-full object-cover"
													/>
												</div>

												<div
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
														activeCard === 1 ? "opacity-100" : "opacity-0"
													}`}
												>
													<img
														key={resolvedTheme}
														src={assets.two[resolvedTheme]}
														alt="Analytics Dashboard"
														className="w-full h-full object-cover"
													/>
												</div>

												<div
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
														activeCard === 2 ? "opacity-100" : "opacity-0"
													}`}
												>
													<img
														key={resolvedTheme}
														src={assets.three[resolvedTheme]}
														alt="Data Visualization Dashboard"
														className="w-full h-full object-cover"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="self-stretch border-t border-b border-border flex justify-center items-start">
								<div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
									<div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
										{Array.from({ length: 50 }).map((_, i) => (
											<div
												key={i}
												className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-border outline-offset-[-0.25px]"
											/>
										))}
									</div>
								</div>

								<div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
									<FeatureCard
										title="Drag & Drop Builder"
										description="Intuitive drag-and-drop interface for building forms quickly. Add, rearrange, and configure form fields with ease."
										isActive={activeCard === 0}
										progress={activeCard === 0 ? progress : 0}
										onClick={() => handleCardClick(0)}
									/>
									<FeatureCard
										title="Save, Share & Export"
										description="Save your form configurations, share them with team members, and export generated code for immediate use in your projects."
										isActive={activeCard === 2}
										progress={activeCard === 2 ? progress : 0}
										onClick={() => handleCardClick(2)}
									/>
									<FeatureCard
										title="Real-time Preview"
										description="See your form changes instantly with live preview. Test form behavior and styling as you build."
										isActive={activeCard === 1}
										progress={activeCard === 1 ? progress : 0}
										onClick={() => handleCardClick(1)}
									/>
								</div>

								<div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
									<div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
										{Array.from({ length: 50 }).map((_, i) => (
											<div
												key={i}
												className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-border outline-offset-[-0.25px]"
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-16 text-center">
						<h2 className="text-2xl font-semibold mb-8">Features</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-10">
							{features.map((feature) => {
								const IconComponent = feature.icon;
								return (
									<div key={feature.title} className="relative group h-full">
										<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
											<div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
												<IconComponent className="w-6 h-6 text-primary" />
											</div>
										</div>

										<div className="h-full flex flex-col p-6 pt-8 rounded-xl border bg-card hover:shadow-md transition-all duration-300">
											<div className="flex-1 flex flex-col">
												<h3 className="font-semibold mb-4 text-lg text-center">
													{feature.title}
												</h3>
												<div className="flex-1 flex items-center">
													<p className="text-sm text-muted-foreground leading-relaxed text-center w-full">
														{feature.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mt-16 text-center">
						<h2 className="text-2xl font-semibold mb-8">Development Roadmap</h2>
						<div className="grid gap-6 max-w-6xl mx-4 sm:mx-6 md:mx-8 lg:mx-10">
							<div className="text-left">
								<div className="flex items-center gap-3 mb-4">
									<CheckCircle className="w-6 h-6 text-green-500" />
									<h3 className="text-xl font-semibold text-foreground">
										Completed Features
									</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{roadmapItems
										.filter((item) => item.status === "completed")
										.map((item) => (
											<div
												key={item.title}
												className="p-4 rounded-lg border bg-card border-border"
											>
												<div className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
													<div className="flex-1">
														<h4 className="font-medium text-foreground mb-1">
															{item.title}
														</h4>
														<p className="text-sm text-muted-foreground">
															{item.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>

							<div className="text-left">
								<div className="flex items-center gap-3 mb-4">
									<Clock className="w-6 h-6 text-yellow-500" />
									<h3 className="text-xl font-semibold text-foreground">
										In Progress
									</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{roadmapItems
										.filter((item) => item.status === "in-progress")
										.map((item) => (
											<div
												key={item.title}
												className="p-4 rounded-lg border bg-card border-border"
											>
												<div className="flex items-start gap-3">
													<Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
													<div className="flex-1">
														<h4 className="font-medium text-foreground mb-1">
															{item.title}
														</h4>
														<p className="text-sm text-muted-foreground">
															{item.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>

							<div className="text-left">
								<div className="flex items-center gap-3 mb-4">
									<Circle className="w-6 h-6 text-blue-500" />
									<h3 className="text-xl font-semibold text-foreground">
										Planned Features
									</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{roadmapItems
										.filter((item) => item.status === "planned")
										.map((item) => (
											<div
												key={item.title}
												className="p-4 rounded-lg border bg-card border-border"
											>
												<div className="flex items-start gap-3">
													<Circle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
													<div className="flex-1">
														<h4 className="font-medium text-foreground mb-1">
															{item.title}
														</h4>
														<p className="text-sm text-muted-foreground">
															{item.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					</div>

					<FAQSection />

					<CTASection />

					<FooterSection />
				</div>
			</div>
		</div>
	);
}

function FeatureCard({
	title,
	description,
	isActive,
	progress,
	onClick,
}: {
	title: string;
	description: string;
	isActive: boolean;
	progress: number;
	onClick: () => void;
}) {
	return (
		<div
			className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
				isActive
					? "bg-card shadow-[0px_0px_0px_0.75px_var(--color-border)_inset]"
					: "border-l-0 border-r-0 md:border border-border"
			}`}
			onClick={onClick}
			onKeyUp={onClick}
		>
			{isActive && (
				<div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--color-border)]">
					<div
						className="h-full bg-foreground transition-all duration-100 ease-linear"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}

			<div className="self-stretch flex justify-center flex-col text-foreground text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
				{title}
			</div>
			<div className="self-stretch text-muted-foreground text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
				{description}
			</div>
		</div>
	);
}
