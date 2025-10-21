import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import {
	Filters,
	type Filter,
	type FilterFieldConfig,
} from "@/components/ui/filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/testing")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TableComponent1 />;
}

export interface TableData {
	id: string;
	name: string;
	email: string;
	location: string;
	flag: string;
	status: string;
	balance: number;
	department: string;
	role: string;
	joinDate: string;
	lastActive: string;
	performance: string;
	note: string;
}
export const tableData: TableData[] = [
	{
		id: "1",
		name: "Alex Thompson",
		email: "a.tompson@company.com",
		location: "San Francisco, US",
		flag: "🇺🇸",
		status: "Inactive",
		balance: 1750,
		department: "Engineering",
		role: "Senior Developer",
		joinDate: "2023-03-15",
		lastActive: "2025-01-06",
		performance: "Excellent",
		note: "Key team member in our San Francisco office, leading several major client projects and mentoring junior developers. Consistently exceeds performance targets and maintains excellent client relationships. Recently completed advanced certification in project management and cloud architecture. Scheduled for quarterly performance review and promotion discussion.",
	},
	{
		id: "2",
		name: "Sarah Chen",
		email: "sarah.c@company.com",
		location: "Singapore",
		flag: "🇸🇬",
		status: "Active",
		balance: 600,
		department: "Product",
		role: "Product Manager",
		joinDate: "2023-06-22",
		lastActive: "2025-01-11",
		performance: "Outstanding",
		note: "Demonstrates exceptional leadership in product strategy and team coordination across APAC region. Successfully launched three major product features in Q4 2024 that increased user engagement by 45%. Currently leading the development of our new mobile platform while mentoring junior product managers and coordinating with global teams.",
	},
	{
		id: "3",
		name: "James Wilson",
		email: "j.wilson@company.com",
		location: "London, UK",
		flag: "🇬🇧",
		status: "Inactive",
		balance: 650,
		department: "Marketing",
		role: "Marketing Director",
		joinDate: "2023-09-01",
		lastActive: "2024-12-15",
		performance: "Good",
		note: "Effective in managing marketing campaigns across European markets. Currently working on Q1 2025 marketing strategy and collaborating with the sales team to drive business growth. Developing strong relationships with key stakeholders and implementing innovative marketing initiatives.",
	},
	{
		id: "4",
		name: "Maria Garcia",
		email: "m.garcia@company.com",
		location: "Madrid, Spain",
		flag: "🇪🇸",
		status: "Active",
		balance: 0,
		department: "Design",
		role: "UI/UX Designer",
		joinDate: "2024-01-10",
		lastActive: "2025-01-10",
		performance: "Very Good",
		note: "Collaborating with the development team to improve user experience and leading the design of our new mobile application. Developing strong relationships with key stakeholders and implementing innovative design solutions.",
	},
	{
		id: "5",
		name: "Lars Nielsen",
		email: "l.nielsen@company.com",
		location: "Stockholm, SE",
		flag: "🇸🇪",
		status: "Active",
		balance: 1000,
		department: "Engineering",
		role: "Frontend Developer",
		joinDate: "2023-11-15",
		lastActive: "2025-01-09",
		performance: "Excellent",
		note: "Leading the frontend development of our new user dashboard and collaborating with the design team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in React and Angular.",
	},
	{
		id: "6",
		name: "Eva Kowalski",
		email: "e.kowalski@company.com",
		location: "Seoul, KR",
		flag: "🇰🇷",
		status: "Active",
		balance: 920,
		department: "Sales",
		role: "Sales Manager",
		joinDate: "2023-07-25",
		lastActive: "2025-01-08",
		performance: "Good",
		note: "Successfully expanded our client base in the APAC region and developed strong relationships with key stakeholders. Currently working on new market opportunities in South Korea and mentoring junior sales team members. Recently completed advanced training in sales strategy and negotiation techniques.",
	},
	{
		id: "7",
		name: "Emma Laurent",
		email: "e.laurent@company.com",
		location: "Berlin, DE",
		flag: "🇩🇪",
		status: "Active",
		balance: 1200,
		department: "HR",
		role: "HR Manager",
		joinDate: "2023-10-12",
		lastActive: "2025-01-07",
		performance: "Very Good",
		note: "Implementing new employee wellness programs and improving recruitment processes. Collaborating with the management team to improve company culture and employee engagement. Developing strong relationships with key stakeholders and implementing innovative HR initiatives.",
	},
	{
		id: "8",
		name: "Marco Rossi",
		email: "m.rossi@company.com",
		location: "Madrid, Spain",
		flag: "🇪🇸",
		status: "Active",
		balance: 2100,
		department: "Finance",
		role: "Financial Analyst",
		joinDate: "2023-08-20",
		lastActive: "2025-01-05",
		performance: "Excellent",
		note: "Providing valuable financial insights to support business growth and collaborating with the management team to improve financial planning processes. Successfully implemented cost-saving measures in Q4 2024. Developing strong relationships with key stakeholders and implementing innovative financial initiatives.",
	},
	{
		id: "9",
		name: "Yuki Tanaka",
		email: "y.tanaka@company.com",
		location: "Warsaw, PL",
		flag: "🇵🇱",
		status: "Active",
		balance: 450,
		department: "IT",
		role: "IT Specialist",
		joinDate: "2023-05-15",
		lastActive: "2025-01-04",
		performance: "Good",
		note: "Effective in resolving technical issues and improving system efficiency. Collaborating with the development team on new project initiatives and providing technical support to junior team members. Recently completed advanced training in cybersecurity and network administration.",
	},
	{
		id: "10",
		name: "Mike Allison",
		email: "m.allison@company.com",
		location: "San Francisco, US",
		flag: "🇺🇸",
		status: "Inactive",
		balance: 1250,
		department: "Engineering",
		role: "Backend Developer",
		joinDate: "2023-04-10",
		lastActive: "2024-12-20",
		performance: "Very Good",
		note: "Key contributor to our backend infrastructure development and collaborating with the frontend team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in Node.js and MongoDB.",
	},
	{
		id: "11",
		name: "Anna Visconti",
		email: "anna.visconti@company.com",
		location: "Rome, IT",
		flag: "🇮🇹",
		status: "Active",
		balance: 0,
		department: "Marketing",
		role: "Marketing Specialist",
		joinDate: "2024-02-20",
		lastActive: "2025-01-03",
		performance: "Good",
		note: "Supporting marketing campaigns across European markets and collaborating with the sales team to drive business growth. Developing strong relationships with key stakeholders and implementing innovative marketing strategies. Recently completed advanced training in social media marketing and content creation.",
	},
	{
		id: "12",
		name: "David Kim",
		email: "d.kim@company.com",
		location: "Paris, FR",
		flag: "🇫🇷",
		status: "Active",
		balance: 890,
		department: "Sales",
		role: "Sales Representative",
		joinDate: "2023-06-15",
		lastActive: "2025-01-02",
		performance: "Very Good",
		note: "Consistently meeting sales targets and expanding our client base in European markets. Strong relationship builder with clients and collaborating with the marketing team to drive business growth. Recently completed advanced training in sales strategy and negotiation techniques.",
	},
	{
		id: "13",
		name: "Lucia Sorna",
		email: "lucia.sorna@company.com",
		location: "Copenhagen, DK",
		flag: "🇩🇰",
		status: "Inactive",
		balance: 1890,
		department: "Finance",
		role: "Financial Manager",
		joinDate: "2023-03-20",
		lastActive: "2024-12-18",
		performance: "Excellent",
		note: "Providing strategic financial guidance to support business growth and collaborating with the management team to improve financial planning processes. Developing strong relationships with key stakeholders and implementing innovative financial initiatives. Recently completed advanced training in financial analysis and planning.",
	},
	{
		id: "14",
		name: "Samuel Carteron",
		email: "sa.carteron@company.com",
		location: "San Francisco, US",
		flag: "🇺🇸",
		status: "Inactive",
		balance: 1250,
		department: "Engineering",
		role: "DevOps Engineer",
		joinDate: "2023-04-25",
		lastActive: "2024-12-15",
		performance: "Very Good",
		note: "Leading our cloud infrastructure optimization project and collaborating with the development team to improve system efficiency. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in cloud computing and DevOps practices.",
	},
	{
		id: "15",
		name: "Alex Allan",
		email: "alex.allan@company.com",
		location: "São Paulo, BR",
		flag: "🇧🇷",
		status: "Active",
		balance: 2100,
		department: "Sales",
		role: "Sales Director",
		joinDate: "2023-07-10",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Outstanding performance in Latin American markets and exceeding annual sales targets by 35%. Strong leader and mentor to junior sales team members, providing guidance on sales strategies and market dynamics. Recently completed advanced training in sales leadership and management.",
	},
	{
		id: "16",
		name: "Olivia Brown",
		email: "o.brown@company.com",
		location: "Sydney, AU",
		flag: "🇦🇺",
		status: "Active",
		balance: 1600,
		department: "Marketing",
		role: "Marketing Coordinator",
		joinDate: "2023-09-15",
		lastActive: "2025-01-01",
		performance: "Good",
		note: "Supporting marketing campaigns across APAC markets and collaborating with the sales team to drive business growth. Developing strong relationships with key stakeholders and implementing innovative marketing strategies. Recently completed advanced training in digital marketing and social media management.",
	},
	{
		id: "17",
		name: "Hiroshi Yamamoto",
		email: "h.yamamoto@company.com",
		location: "Osaka, JP",
		flag: "🇯🇵",
		status: "Active",
		balance: 2200,
		department: "Engineering",
		role: "Software Engineer",
		joinDate: "2023-10-25",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Key developer for our Asian market localization project and collaborating with the design team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in software development and testing.",
	},
	{
		id: "18",
		name: "Sophie Dubois",
		email: "s.dubois@company.com",
		location: "Montreal, CA",
		flag: "🇨🇦",
		status: "Inactive",
		balance: 950,
		department: "HR",
		role: "HR Specialist",
		joinDate: "2023-05-20",
		lastActive: "2024-12-12",
		performance: "Very Good",
		note: "Supporting employee onboarding and training programs and collaborating with the management team to improve company culture. Developing strong relationships with key stakeholders and implementing innovative HR initiatives. Recently completed advanced training in HR management and employee development.",
	},
	{
		id: "19",
		name: "Diego Mendoza",
		email: "d.mendoza@company.com",
		location: "Mexico City, MX",
		flag: "🇲🇽",
		status: "Active",
		balance: 1800,
		department: "Sales",
		role: "Sales Representative",
		joinDate: "2023-08-15",
		lastActive: "2025-01-01",
		performance: "Good",
		note: "Consistently meeting sales targets and expanding our client base in Latin American markets. Strong relationship builder with clients and collaborating with the marketing team to drive business growth. Recently completed advanced training in sales strategy and negotiation techniques.",
	},
	{
		id: "20",
		name: "Lena Müller",
		email: "l.mueller@company.com",
		location: "Vienna, AT",
		flag: "🇦🇹",
		status: "Active",
		balance: 1350,
		department: "Marketing",
		role: "Marketing Specialist",
		joinDate: "2023-11-10",
		lastActive: "2025-01-01",
		performance: "Very Good",
		note: "Supporting marketing campaigns across European markets and collaborating with the sales team to drive business growth. Developing strong relationships with key stakeholders and implementing innovative marketing strategies. Recently completed advanced training in digital marketing and social media management.",
	},
	{
		id: "21",
		name: "Raj Patel",
		email: "r.patel@company.com",
		location: "Mumbai, IN",
		flag: "🇮🇳",
		status: "Active",
		balance: 2500,
		department: "Engineering",
		role: "Software Engineer",
		joinDate: "2023-12-15",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Key developer for our Indian market localization project and collaborating with the design team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in software development and testing.",
	},
	{
		id: "22",
		name: "Astrid Andersen",
		email: "a.andersen@company.com",
		location: "Oslo, NO",
		flag: "🇳🇴",
		status: "Inactive",
		balance: 1100,
		department: "Finance",
		role: "Financial Analyst",
		joinDate: "2023-06-20",
		lastActive: "2024-12-10",
		performance: "Good",
		note: "Providing financial analysis and insights to support business growth and collaborating with the management team to improve financial planning processes. Developing strong relationships with key stakeholders and implementing innovative financial initiatives. Recently completed advanced training in financial analysis and planning.",
	},
	{
		id: "23",
		name: "Fatima Al-Sayed",
		email: "f.alsayed@company.com",
		location: "Cairo, EG",
		flag: "🇪🇬",
		status: "Active",
		balance: 1950,
		department: "Sales",
		role: "Sales Manager",
		joinDate: "2023-09-10",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Outstanding performance in Middle Eastern markets and exceeding annual sales targets by 25%. Strong leader and mentor to junior sales team members, providing guidance on sales strategies and market dynamics. Recently completed advanced training in sales leadership and management.",
	},
	{
		id: "24",
		name: "Javier Fernández",
		email: "j.fernandez@company.com",
		location: "Buenos Aires, AR",
		flag: "🇦🇷",
		status: "Active",
		balance: 1700,
		department: "Marketing",
		role: "Marketing Coordinator",
		joinDate: "2023-10-20",
		lastActive: "2025-01-01",
		performance: "Good",
		note: "Supporting marketing campaigns across Latin American markets and collaborating with the sales team to drive business growth. Developing strong relationships with key stakeholders and implementing innovative marketing strategies. Recently completed advanced training in digital marketing and social media management.",
	},
	{
		id: "25",
		name: "Zoe Williams",
		email: "z.williams@company.com",
		location: "Auckland, NZ",
		flag: "🇳🇿",
		status: "Active",
		balance: 2300,
		department: "Engineering",
		role: "Software Engineer",
		joinDate: "2023-11-25",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Key developer for our Australian market localization project and collaborating with the design team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in software development and testing.",
	},
	{
		id: "26",
		name: "Nikolai Petrov",
		email: "n.petrov@company.com",
		location: "Moscow, RU",
		flag: "🇷🇺",
		status: "Active",
		balance: 3100,
		department: "Sales",
		role: "Sales Director",
		joinDate: "2023-12-10",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Outstanding performance in European markets and exceeding annual sales targets by 40%. Strong leader and mentor to junior sales team members, providing guidance on sales strategies and market dynamics. Recently completed advanced training in sales leadership and management.",
	},
	{
		id: "27",
		name: "Isabella Rossi",
		email: "i.rossi@company.com",
		location: "Milan, IT",
		flag: "🇮🇹",
		status: "Inactive",
		balance: 1850,
		department: "Finance",
		role: "Financial Manager",
		joinDate: "2023-07-20",
		lastActive: "2024-12-08",
		performance: "Very Good",
		note: "Providing strategic financial guidance to support business growth and collaborating with the management team to improve financial planning processes. Developing strong relationships with key stakeholders and implementing innovative financial initiatives. Recently completed advanced training in financial analysis and planning.",
	},
	{
		id: "28",
		name: "Cheng Wei",
		email: "c.wei@company.com",
		location: "Shanghai, CN",
		flag: "🇨🇳",
		status: "Active",
		balance: 2700,
		department: "Engineering",
		role: "Software Engineer",
		joinDate: "2023-11-15",
		lastActive: "2025-01-01",
		performance: "Excellent",
		note: "Key developer for our Asian market localization project and collaborating with the design team to improve user experience. Consistently delivers high-quality code and provides valuable feedback to junior developers. Recently completed advanced training in software development and testing.",
	},
	{
		id: "29",
		name: "Licia Patel",
		email: "l.patel@company.com",
		location: "Nairobi, KE",
		flag: "🇰🇪",
		status: "Active",
		balance: 1400,
		department: "Sales",
		role: "Sales Representative",
		joinDate: "2023-10-15",
		lastActive: "2025-01-01",
		performance: "Good",
		note: "Successfully expanding our presence in East African markets with a focus on enterprise clients. Has developed strong relationships with key stakeholders and implemented innovative sales strategies. Recently completed advanced negotiation training and is mentoring new team members in regional market dynamics and cultural sensitivity training.",
	},
	{
		id: "30",
		name: "Mateo Gonzalez",
		email: "m.gonzalez@company.com",
		location: "Bogotá, CO",
		flag: "🇨🇴",
		status: "Active",
		balance: 2050,
		department: "Marketing",
		role: "Marketing Specialist",
		joinDate: "2023-11-20",
		lastActive: "2025-01-01",
		performance: "Very Good",
		note: "Leading digital marketing initiatives across Latin America with innovative social media campaigns that increased engagement by 65%. Specializes in data-driven marketing strategies and cross-cultural campaign optimization. Currently expanding our marketing presence in emerging markets while mentoring junior team members in digital marketing best practices.",
	},
];
export default function TableComponent1() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [filters, setFilters] = useState<Filter[]>([]);
	const columns = useMemo<ColumnDef<TableData>[]>(
		() => [
			{
				accessorKey: "id",
				id: "id",
				header: ({ column }) => (
					<DataGridColumnHeader title="Id" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "name",
				id: "name",
				header: ({ column }) => (
					<DataGridColumnHeader title="Name" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "email",
				id: "email",
				header: ({ column }) => (
					<DataGridColumnHeader title="Email" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "location",
				id: "location",
				header: ({ column }) => (
					<DataGridColumnHeader title="Location" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "flag",
				id: "flag",
				header: ({ column }) => (
					<DataGridColumnHeader title="Flag" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "status",
				id: "status",
				header: ({ column }) => (
					<DataGridColumnHeader title="Status" column={column} />
				),
				cell: (info) => (
					<Badge variant="outline">{String(info.getValue())}</Badge>
				),
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "balance",
				id: "balance",
				header: ({ column }) => (
					<DataGridColumnHeader title="Balance" column={column} />
				),
				cell: (info) => (
					<span>{(info.getValue() as number).toLocaleString()}</span>
				),
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "department",
				id: "department",
				header: ({ column }) => (
					<DataGridColumnHeader title="Department" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "role",
				id: "role",
				header: ({ column }) => (
					<DataGridColumnHeader title="Role" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "joinDate",
				id: "joinDate",
				header: ({ column }) => (
					<DataGridColumnHeader title="Join Date" column={column} />
				),
				cell: (info) => {
					const date = info.getValue() as string;
					return <span>{date ? new Date(date).toLocaleDateString() : ""}</span>;
				},
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "lastActive",
				id: "lastActive",
				header: ({ column }) => (
					<DataGridColumnHeader title="Last Active" column={column} />
				),
				cell: (info) => {
					const date = info.getValue() as string;
					return <span>{date ? new Date(date).toLocaleDateString() : ""}</span>;
				},
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "performance",
				id: "performance",
				header: ({ column }) => (
					<DataGridColumnHeader title="Performance" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
			{
				accessorKey: "note",
				id: "note",
				header: ({ column }) => (
					<DataGridColumnHeader title="Note" column={column} />
				),
				cell: (info) => <span>{info.getValue() as string}</span>,
				size: 180,
				enableSorting: true,
				enableHiding: true,
				enableResizing: true,
				enablePinning: true,
			},
		],
		[],
	);
	const filterFields = useMemo<FilterFieldConfig[]>(
		() => [
			{
				key: "id",
				label: "Id",
				type: "text" as const,
				placeholder: "Filter by id...",
			},
			{
				key: "name",
				label: "Name",
				type: "text" as const,
				placeholder: "Filter by name...",
			},
			{
				key: "email",
				label: "Email",
				type: "text" as const,
				placeholder: "Filter by email...",
			},
			{
				key: "location",
				label: "Location",
				type: "text" as const,
				placeholder: "Filter by location...",
			},
			{
				key: "flag",
				label: "Flag",
				type: "text" as const,
				placeholder: "Filter by flag...",
			},
			{
				key: "status",
				label: "Status",
				type: "select" as const,
				placeholder: "Filter by status...",
				options: [
					{ label: "Active", value: "Active" },
					{ label: "Inactive", value: "Inactive" },
				],
				searchable: false,
				className: "w-[160px]",
			},
			{
				key: "balance",
				label: "Balance",
				type: "number" as const,
				placeholder: "Filter by balance...",
			},
			{
				key: "department",
				label: "Department",
				type: "select" as const,
				placeholder: "Filter by department...",
				options: [
					{
						label: "Engineering",
						value: "Engineering",
					},
					{
						label: "Product",
						value: "Product",
					},
					{
						label: "Marketing",
						value: "Marketing",
					},
					{
						label: "Design",
						value: "Design",
					},
					{
						label: "Sales",
						value: "Sales",
					},
					{
						label: "HR",
						value: "HR",
					},
					{
						label: "Finance",
						value: "Finance",
					},
					{
						label: "IT",
						value: "IT",
					},
				],
				searchable: false,
				className: "w-[160px]",
			},
			{
				key: "role",
				label: "Role",
				type: "text" as const,
				placeholder: "Filter by role...",
			},
			{
				key: "joinDate",
				label: "Join Date",
				type: "date" as const,
				placeholder: "Filter by join date...",
			},
			{
				key: "lastActive",
				label: "Last Active",
				type: "date" as const,
				placeholder: "Filter by last active...",
			},
			{
				key: "performance",
				label: "Performance",
				type: "select" as const,
				placeholder: "Filter by performance...",
				options: [
					{
						label: "Excellent",
						value: "Excellent",
					},
					{
						label: "Outstanding",
						value: "Outstanding",
					},
					{
						label: "Good",
						value: "Good",
					},
					{
						label: "Very Good",
						value: "Very Good",
					},
				],
				searchable: true,
				className: "w-[160px]",
			},
			{
				key: "note",
				label: "Note",
				type: "text" as const,
				placeholder: "Filter by note...",
			},
			{
				key: "name",
				label: "Name",
				type: "text" as const,
				placeholder: "Filter by name...",
			},
			{
				key: "email",
				label: "Email",
				type: "text" as const,
				placeholder: "Filter by email...",
			},
			{
				key: "location",
				label: "Location",
				type: "text" as const,
				placeholder: "Filter by location...",
			},
			{
				key: "flag",
				label: "Flag",
				type: "text" as const,
				placeholder: "Filter by flag...",
			},
			{
				key: "status",
				label: "Status",
				type: "select" as const,
				placeholder: "Filter by status...",
				options: [
					{ label: "Active", value: "Active" },
					{ label: "Inactive", value: "Inactive" },
				],
				searchable: false,
				className: "w-[160px]",
			},
			{
				key: "balance",
				label: "Balance",
				type: "number" as const,
				placeholder: "Filter by balance...",
			},
			{
				key: "department",
				label: "Department",
				type: "select" as const,
				placeholder: "Filter by department...",
				options: [
					{
						label: "Engineering",
						value: "Engineering",
					},
					{
						label: "Product",
						value: "Product",
					},
					{
						label: "Marketing",
						value: "Marketing",
					},
					{
						label: "Design",
						value: "Design",
					},
					{
						label: "Sales",
						value: "Sales",
					},
					{
						label: "HR",
						value: "HR",
					},
					{
						label: "Finance",
						value: "Finance",
					},
					{
						label: "IT",
						value: "IT",
					},
				],
				searchable: false,
				className: "w-[160px]",
			},
			{
				key: "role",
				label: "Role",
				type: "text" as const,
				placeholder: "Filter by role...",
			},
			{
				key: "joinDate",
				label: "Join Date",
				type: "date" as const,
				placeholder: "Filter by join date...",
			},
			{
				key: "lastActive",
				label: "Last Active",
				type: "date" as const,
				placeholder: "Filter by last active...",
			},
			{
				key: "performance",
				label: "Performance",
				type: "select" as const,
				placeholder: "Filter by performance...",
				options: [
					{
						label: "Excellent",
						value: "Excellent",
					},
					{
						label: "Outstanding",
						value: "Outstanding",
					},
					{
						label: "Good",
						value: "Good",
					},
					{
						label: "Very Good",
						value: "Very Good",
					},
				],
				searchable: true,
				className: "w-[160px]",
			},
			{
				key: "note",
				label: "Note",
				type: "text" as const,
				placeholder: "Filter by note...",
			},
		],
		[],
	);

	// Apply filters to data - only apply filters with non-empty values
	const filteredData = useMemo(() => {
		let filtered = [...tableData];

		// Filter out empty filters before applying
		const activeFilters = filters.filter((filter) => {
			const { values } = filter;

			// Check if filter has meaningful values
			if (!values || values.length === 0) return false;

			// For text/string values, check if they're not empty strings
			if (
				values.every(
					(value) => typeof value === "string" && value.trim() === "",
				)
			)
				return false;

			// For number values, check if they're not null/undefined
			if (values.every((value) => value === null || value === undefined))
				return false;

			// For arrays, check if they're not empty
			if (values.every((value) => Array.isArray(value) && value.length === 0))
				return false;

			return true;
		});

		activeFilters.forEach((filter) => {
			const { field, operator, values } = filter;

			filtered = filtered.filter((item) => {
				const fieldValue = item[field as keyof TableData];

				switch (operator) {
					case "is":
						return values.includes(fieldValue);
					case "is_not":
						return !values.includes(fieldValue);
					case "contains":
						return values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "not_contains":
						return !values.some((value) =>
							String(fieldValue)
								.toLowerCase()
								.includes(String(value).toLowerCase()),
						);
					case "equals":
						return fieldValue === values[0];
					case "not_equals":
						return fieldValue !== values[0];
					case "greater_than":
						return Number(fieldValue) > Number(values[0]);
					case "less_than":
						return Number(fieldValue) < Number(values[0]);
					case "greater_than_or_equal":
						return Number(fieldValue) >= Number(values[0]);
					case "less_than_or_equal":
						return Number(fieldValue) <= Number(values[0]);
					case "between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) >= min && Number(fieldValue) <= max;
						}
						return true;
					case "not_between":
						if (values.length >= 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return Number(fieldValue) < min || Number(fieldValue) > max;
						}
						return true;
					case "before":
						return new Date(String(fieldValue)) < new Date(String(values[0]));
					case "after":
						return new Date(String(fieldValue)) > new Date(String(values[0]));
					default:
						return true;
				}
			});
		});

		return filtered;
	}, [filters]);

	const handleFiltersChange = useCallback((filters: Filter[]) => {
		console.log("Filters updated:", filters);
		setFilters(filters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);
	const table = useReactTable({
		columns,
		data: filteredData,
		pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
		state: {
			pagination,
			sorting,
		},
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
	return (
		<DataGrid
			table={table}
			recordCount={filteredData?.length || 0}
			tableLayout={{
				dense: true,
				cellBorder: true,
				rowBorder: true,
				rowRounded: true,
				stripped: true,
				headerBorder: true,
				headerSticky: true,
				width: "fixed",
			}}
		>
			<div className="w-full space-y-2.5">
				<Filters
					filters={filters}
					fields={filterFields}
					variant="outline"
					onChange={handleFiltersChange}
				/>
				<DataGridContainer>
					<ScrollArea>
						<DataGridTable />
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</DataGridContainer>
				<DataGridPagination />
			</div>
		</DataGrid>
	);
}
