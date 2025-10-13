import { STATIC_DUMMY_DATA } from "./static-dummy-data";

export type Person = {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: "relationship" | "complicated" | "single";
	subRows?: Person[];
};

const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

const newPerson = (num: number): Person => {
	const statusOptions: Person["status"][] = [
		"relationship",
		"complicated",
		"single",
	];
	return {
		id: num,
		firstName: STATIC_DUMMY_DATA.string[
			num % STATIC_DUMMY_DATA.string.length
		] as string,
		lastName: STATIC_DUMMY_DATA.string[
			(num + 10) % STATIC_DUMMY_DATA.string.length
		] as string,
		age: STATIC_DUMMY_DATA.number[
			num % STATIC_DUMMY_DATA.number.length
		] as number,
		visits: STATIC_DUMMY_DATA.number[
			(num + 5) % STATIC_DUMMY_DATA.number.length
		] as number,
		progress: STATIC_DUMMY_DATA.number[
			(num + 15) % STATIC_DUMMY_DATA.number.length
		] as number,
		status: statusOptions[num % statusOptions.length]!,
	};
};

export function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): Person[] => {
		const len = lens[depth]!;
		return range(len).map((index): Person => {
			return {
				...newPerson(index),
				subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
			};
		});
	};

	return makeDataLevel();
}
