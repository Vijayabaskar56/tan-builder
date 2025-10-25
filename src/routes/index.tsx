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
export const Route = createFileRoute("/")({
	component: HomePage,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
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

	// getDashboardContent removed as it is unused
	// console.log(systemTheme);
	return (
		<div className="w-full min-h-screen relative bg-background overflow-x-hidden flex flex-col justify-start items-center">
			<div className="relative flex flex-col justify-start items-center w-full">
				<div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
					<div className="self-stretch pt-[9px] overflow-hidden border-b border-border flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
						<div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
							<div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
								<div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
									<div className="w-full flex justify-center items-center max-w-[748.71px] lg:w-[748.71px] text-center  text-foreground text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[70px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-instrument-serif  px-2 sm:px-4 md:px-0">
										{/* <img
												src="/title-logo.svg"
												alt="title-logo"
												className="w-12"
											/> */}
										<svg width="600" height="200" viewBox="0 0 1558 376" fill="none" xmlns="http://www.w3.org/2000/svg">
											<title>TanCN Logo</title>
											<path className="fill-primary" d="M992.8 38.463C995.74 37.879 998.68 37.407 1001.63 37L973.88 61.724C962.6 65.722 951.85 70.762 941.33 76.494C930.874 82.192 920.871 88.028 911.811 95.361C898.336 106.266 888.038 119.521 879.056 133.365C869.802 147.629 863.869 164.253 861.001 180.383C858.188 196.208 857.724 212.846 860.947 228.684C864.975 248.485 872.643 267.065 884.751 284.251C888.821 282.602 891.71 278.843 895.083 276.311C901.895 271.199 909.047 266.46 916.73 262.371C919.575 260.857 922.497 259.682 925.586 258.605C926.752 258.198 928.657 257.827 929.206 256.716C930.078 254.953 928.465 251.883 928.188 250.056C927.398 244.83 926.92 239.514 927.07 234.241C927.502 218.881 930.811 203.308 937.11 188.932C941.858 178.1 949.109 168.265 957.7 159.439C960.615 156.444 963.71 153.656 966.91 150.89C968.8 149.256 971.15 147.857 972.32 145.761C966.16 145.764 959.987 147.307 954.121 148.874C941.485 152.249 929.176 157.257 918.698 164.322C913.919 167.546 910.419 171.77 905.899 175.163C904.513 176.203 902.029 177.598 900.114 176.813C897.219 175.627 897.666 170.686 897.334 168.415C896.059 159.68 899.874 148.631 904.721 141.059C912.503 128.904 926.891 118.525 943.79 118.887C951.087 119.044 957.476 121.243 964.45 122.679C962.68 120.499 960.312 118.909 958.057 117.122C952.533 112.743 946.49 108.744 939.854 105.718C937.184 104.501 934.309 103.762 931.49 102.868C930.073 102.418 928.288 101.8 927.754 100.433C926.767 97.902 932.02 95.558 933.95 94.491C941.409 90.365 950.556 86.972 959.533 86.781C973.56 86.482 987.27 93.235 993.05 104.727C995.08 108.766 995.68 113.038 996.08 117.349L996.15 118.158L996.26 119.372C996.27 119.507 996.28 119.642 996.29 119.777L996.36 120.587L996.43 121.397C1000.84 118.281 1003.94 113.695 1008.24 110.358C1018.3 102.552 1032.07 99.086 1045.14 102.6C1056.95 105.775 1067.21 112.844 1073.25 122.252C1074.83 124.713 1079.24 130.728 1076.05 133.179C1073.56 135.099 1070.4 133.603 1067.77 132.807C1065.78 132.205 1063.72 131.822 1061.66 131.469L1060.53 131.277C1060.16 131.214 1059.78 131.15 1059.41 131.085C1052.26 129.841 1043.94 129.97 1036.77 131.063C1032.14 131.77 1027.61 133.2 1023 133.792V134.647C1035.62 134.738 1047.83 140.984 1054.06 150.463C1056.64 154.389 1057.92 158.884 1058.91 163.286C1060.14 168.726 1059.28 174.653 1057.56 179.956C1056.99 181.734 1055.95 184.747 1053.49 185.157C1051.76 185.446 1050.29 183.95 1049.3 182.941C1046.71 180.297 1044.24 177.784 1041.2 175.5C1033.51 169.724 1025.37 164.396 1017.1 159.259C1012.7 156.531 1007.89 152.984 1002.83 151.317C1004.25 154.292 1005.65 157.057 1006.13 160.294C1007.55 169.815 1002.96 178.777 996.06 185.94C993.96 188.126 991.7 190.328 989.05 192.026C987.95 192.73 986.57 193.65 985.12 193.451C980.55 192.826 980.01 186.859 979.31 183.803C976.94 173.45 977.89 163.167 981.18 153.027C978.26 154.314 976.14 157.129 974.3 159.439C970.26 164.521 966.76 169.896 964.24 175.681C954.232 198.729 954.328 225.723 967.3 247.911C968.75 250.388 970.95 250.056 973.8 250.056C974.23 250.056 974.66 250.054 975.09 250.05L976.39 250.039C978.98 250.015 981.57 250.005 984.13 250.302C985.46 250.456 987.31 250.319 988.36 251.168C989.62 252.187 988.95 253.932 988.66 255.185C987.85 258.688 987.58 261.871 987.58 265.444C992.96 264.72 994.45 257.23 996.36 253.475C998.53 249.222 1000.73 244.964 1002.73 240.652C1003.71 238.533 1005.03 236.163 1004.68 233.813C1004.3 231.172 1002.1 228.372 1000.56 226.119C997.66 221.856 994.36 217.47 992.23 212.869C990.52 209.191 992.11 204.594 996.92 203.28C999.58 202.555 1002.41 203.977 1004.14 205.642C1007.77 209.133 1010.11 214.328 1012.74 218.425L1033.26 250.483C1035 253.198 1036.75 255.91 1038.54 258.605C1039.23 259.656 1039.94 261.28 1041.36 261.728C1042.63 262.127 1044.37 261.56 1045.63 261.34C1048.91 260.771 1052.18 260.156 1055.47 259.641C1059.41 259.023 1065.42 259.139 1068.26 256.467C1064.11 255.326 1059.3 255.393 1054.98 255.651C1052.38 255.805 1049.5 256.611 1047.11 255.295C1043.56 253.337 1041.2 248.813 1039.03 245.781C1033.67 238.306 1028.62 230.719 1023.49 223.127L1022.66 221.918L1021.01 219.503C1020.19 218.295 1019.37 217.083 1018.58 215.861C1017.97 214.915 1017.06 213.669 1017.94 212.627C1018.86 211.532 1020.87 211.468 1022.68 211.465L1023.04 211.466C1023.76 211.466 1024.43 211.467 1024.97 211.405C1032.29 210.569 1039.72 209.877 1047.11 209.877C1046.53 208.141 1044.89 206.18 1045.41 204.322C1046.59 200.164 1053.48 198.864 1056.69 201.847C1058.84 203.849 1060.1 206.605 1061.5 209.022C1063.34 212.212 1065.45 215.295 1067.43 218.425C1070.89 223.906 1074.68 229.235 1078.24 234.668C1078.53 235.116 1078.84 235.562 1079.14 236.007L1079.6 236.675C1081.14 238.903 1082.68 241.146 1083.51 243.644C1071.14 243.153 1061.85 230.692 1056.45 222.272C1056.02 223.62 1056.72 224.824 1057.28 226.119C1058.44 228.81 1059.83 231.372 1061.58 233.813C1064.08 237.299 1066.94 240.888 1070.72 243.418C1077.43 247.908 1086.27 247.933 1094.34 247.453C1099.51 247.145 1105.98 245.102 1111.06 246.488C1116.14 247.872 1118.19 252.733 1115.17 256.467C1112.91 259.264 1109.9 260.32 1106.14 260.742C1108.8 265.678 1112.27 270.26 1114.79 275.275C1115.84 277.364 1116.93 280.566 1119.45 281.668C1121.12 282.402 1123.52 281.719 1125.33 281.686C1123.52 277.517 1120.11 273.979 1118.44 269.718C1123.54 269.92 1128.46 272.225 1133.2 273.697C1142.53 276.591 1151.74 279.755 1160.94 282.947L1165.18 284.422C1168.97 285.736 1172.77 287.037 1176.5 288.466C1177.86 288.989 1178.87 289.688 1180.66 290.206L1201 299.253C1185.88 318.798 1166.14 335.49 1143.47 348.579C1118.52 362.986 1089.34 371.804 1059.65 374.926C1021.86 378.901 981 373.093 947.032 357.983C883.256 329.616 839.899 272.525 839.041 209.96C838.876 197.897 839.093 185.763 841.845 173.818C846.329 154.364 854.146 135.559 865.887 118.489C878.587 100.023 894.991 83.728 914.635 70.59C937.672 55.183 964.45 44.101 992.8 38.463ZM955.105 319.23C946.323 320.047 937.06 321.433 929.522 325.713C931.219 326.067 933.164 325.715 934.934 325.713C939.186 325.707 943.478 325.568 947.725 325.729C958.358 326.134 969.44 327.61 979.7 330.052C992.85 333.179 1004.43 339.333 1017.1 343.483C1030.46 347.861 1043.76 349.222 1057.93 349.222C1065.07 349.222 1072.16 349.203 1079.09 347.512C1075.47 345.842 1070.3 346.156 1066.29 345.46C1057.61 343.951 1049.07 342.108 1040.71 339.522C1034.56 337.619 1028.64 335.27 1022.74 332.871L1018.95 331.325C1013.48 329.095 1007.99 326.894 1002.34 325.039C987.46 320.164 970.97 317.754 955.105 319.23ZM968.39 286.816C950.985 286.816 933.383 289.475 917.714 296.325C913.918 297.985 910.31 299.962 906.891 302.154C905.849 302.822 904.001 303.68 903.616 304.842C903.226 306.02 904.622 307.007 905.415 307.76C909.331 305.949 913.052 304.033 917.222 302.658C944.195 293.77 976.89 295.633 1003.81 303.783C1017.24 307.847 1029.6 313.925 1042.68 318.692C1057.3 324.023 1072.24 327.48 1087.94 329.253C1106.47 331.343 1127.59 329.649 1144.52 322.397C1150.47 319.849 1158.73 315.967 1161.25 310.325C1158.14 310.56 1155.34 311.715 1152.39 312.512C1147.7 313.778 1142.95 314.851 1138.12 315.69C1121.78 318.53 1104.4 319.116 1087.94 316.538C1072.43 314.109 1058.02 309.229 1043.67 304.096L1041.84 303.439C1040.62 303.001 1039.4 302.561 1038.18 302.122L1036.35 301.463C1029.02 298.831 1021.66 296.229 1014.14 293.952C999.53 289.527 983.87 286.816 968.39 286.816ZM1079.58 267.422C1069.11 269.789 1058.33 271.933 1047.6 273.138C1049.01 277.306 1052.46 281.361 1054.98 285.106C1055.96 286.554 1057 288.492 1058.93 289.121C1061.11 289.83 1063.75 288.679 1065.8 288.098C1064.85 285.838 1063.25 283.805 1061.94 281.686C1061.4 280.813 1060.56 279.778 1061.01 278.741C1061.85 276.781 1065.34 276.896 1067.28 276.555C1072.38 275.658 1077.43 274.537 1082.53 273.651C1084.41 273.324 1087.03 272.438 1088.92 272.985C1090.33 273.395 1091.19 274.406 1091.99 275.461L1092.35 275.936C1092.84 276.569 1093.33 277.188 1093.95 277.671C1096.01 279.287 1099.1 279.535 1101.72 279.977C1100.12 276.856 1097.46 274.126 1095.76 271C1094.77 269.182 1093.95 266.508 1091.79 265.457C1088.8 264.01 1082.63 266.732 1079.58 267.422ZM1013.65 246.636C1013.16 252.055 1011.24 256.464 1008.24 261.169C1011.68 261.547 1015.19 261.682 1018.57 262.408C1021.1 262.953 1023.44 263.992 1025.95 264.589C1024.61 261.401 1022.12 258.557 1020.19 255.613C1018.24 252.641 1016.49 249.029 1013.65 246.636Z" />
											<path className="fill-[#3F3112] dark:fill-white" d="M98.9 338.11C96.447 348.843 92.613 357.123 87.4 362.95C82.493 368.777 74.367 371.69 63.02 371.69C53.5133 371.69 46.46 370.003 41.86 366.63C37.5667 363.563 35.42 358.197 35.42 350.53C35.42 347.157 35.88 343.937 36.8 340.87L92.92 118.23C92.613 118.23 82.647 119.303 63.02 121.45C39.4067 123.29 24.6867 124.823 18.86 126.05C12.7267 123.903 7.9733 120.683 4.6 116.39C1.5333 111.79 0 106.423 0 100.29C0 95.383 1.6867 90.783 5.06 86.49C8.74 81.89 13.0333 78.517 17.94 76.37C33.2733 73.303 54.74 70.697 82.34 68.55C109.94 66.403 145.36 64.103 188.6 61.65C210.68 60.73 225.553 59.81 233.22 58.89C238.127 61.037 242.267 64.41 245.64 69.01C249.32 73.303 251.16 77.903 251.16 82.81C251.16 88.33 248.4 93.697 242.88 98.91C237.36 104.123 231.073 107.803 224.02 109.95L143.52 114.09C146.893 115.317 148.58 119.457 148.58 126.51C148.58 130.19 148.273 132.95 147.66 134.79C142.447 158.097 135.24 188.303 126.04 225.41C117.147 262.517 111.167 287.663 108.1 300.85C106.26 308.517 104.573 315.417 103.04 321.55C101.507 327.683 100.127 333.203 98.9 338.11ZM375.152 263.59C334.978 270.337 302.932 276.47 279.012 281.99C271.652 293.643 266.898 301.463 264.752 305.45C258.312 316.797 252.485 326.303 247.272 333.97C242.365 341.33 236.998 347.923 231.172 353.75C224.732 360.19 219.365 364.79 215.072 367.55C211.085 370.31 206.332 371.69 200.812 371.69C191.612 371.69 183.485 369.697 176.432 365.71C169.685 361.417 166.312 357.123 166.312 352.83C166.925 352.217 170.298 345.47 176.432 332.59C182.565 319.403 193.912 302.997 210.472 283.37C210.472 280.917 209.705 277.85 208.172 274.17C206.638 270.49 205.872 268.343 205.872 267.73C205.872 258.837 219.825 248.103 247.732 235.53C263.372 212.223 279.778 189.223 296.952 166.53C314.432 143.837 335.745 117.003 360.892 86.03C367.025 78.363 374.845 72.077 384.352 67.17C393.858 62.263 403.365 59.81 412.872 59.81C422.685 59.81 430.045 60.73 434.952 62.57C439.858 64.41 442.925 66.863 444.152 69.93C445.685 72.997 446.452 77.29 446.452 82.81C445.225 92.01 444.458 98.91 444.152 103.51C439.552 140.617 436.025 172.51 433.572 199.19C431.425 225.563 430.352 251.937 430.352 278.31C430.352 302.537 431.425 324.77 433.572 345.01C432.652 352.37 429.432 359.117 423.912 365.25C418.392 371.077 411.952 373.99 404.592 373.99C390.485 373.99 381.132 370.463 376.532 363.41C372.238 356.357 370.092 344.397 370.092 327.53C370.092 315.263 371.778 293.95 375.152 263.59ZM315.352 229.09C320.872 227.863 329.305 226.483 340.652 224.95L377.452 219.43C380.212 176.803 383.432 146.137 387.112 127.43C375.152 141.537 351.232 175.423 315.352 229.09ZM751.547 57.05C759.827 57.05 768.72 58.737 778.227 62.11C788.04 65.483 793.407 68.09 794.327 69.93C787.887 94.77 779.453 130.037 769.027 175.73C758.6 221.117 751.547 251.63 747.867 267.27C741.12 298.55 734.833 326.303 729.007 350.53C724.713 367.397 717.967 375.83 708.767 375.83C684.54 375.83 670.74 370.923 667.367 361.11L666.447 362.03L586.867 160.09L555.127 290.27L540.407 349.15C538.26 358.043 534.887 364.023 530.287 367.09C525.993 370.157 517.713 371.69 505.447 371.69C495.94 371.69 488.887 370.003 484.287 366.63C479.993 363.563 477.847 358.197 477.847 350.53C477.847 347.157 478.307 343.937 479.227 340.87L542.247 92.01C545.62 78.517 549.147 69.623 552.827 65.33C556.813 60.73 563.867 58.43 573.987 58.43C582.267 58.43 589.627 59.35 596.067 61.19C602.507 63.03 605.88 65.79 606.187 69.47V70.39L684.387 277.39L731.307 71.77C731.307 61.957 738.053 57.05 751.547 57.05Z"  />
											<path className="fill-[#3F3112] dark:fill-white" d="M1510.44 59C1521.79 61.147 1529.15 62.987 1532.52 64.52C1536.2 65.747 1538.65 67.74 1539.88 70.5C1533.44 95.34 1525.01 130.607 1514.58 176.3C1504.15 221.687 1497.1 252.2 1493.42 267.84C1486.67 299.12 1480.39 326.873 1474.56 351.1C1470.27 367.967 1463.52 376.4 1454.32 376.4C1430.09 376.4 1416.29 371.493 1412.92 361.68L1412 362.6L1337.02 162.04L1308.5 277.96C1302.98 299.12 1297 323.04 1290.56 349.72C1288.41 358.613 1285.04 364.593 1280.44 367.66C1276.15 370.727 1267.87 372.26 1255.6 372.26C1246.09 372.26 1239.04 370.573 1234.44 367.2C1230.15 364.133 1228 358.767 1228 351.1C1228 347.727 1228.46 344.507 1229.38 341.44L1292.4 92.58C1295.77 79.087 1299.3 70.193 1302.98 65.9C1306.97 61.3 1314.02 59 1324.14 59C1332.42 59 1339.78 59.92 1346.22 61.76C1352.66 63.6 1356.03 66.36 1356.34 70.04V71.42L1430.4 276.58C1450.33 180.287 1463.06 123.707 1468.58 106.84C1472.87 93.96 1478.7 83.227 1486.06 74.64C1493.42 66.053 1501.55 60.84 1510.44 59Z" />
										</svg>
									</div>
									<div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-muted-foreground sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
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
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${activeCard === 0 ? "opacity-100" : "opacity-0"
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
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${activeCard === 1 ? "opacity-100" : "opacity-0"
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
													className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${activeCard === 2 ? "opacity-100" : "opacity-0"
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
			className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${isActive
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
