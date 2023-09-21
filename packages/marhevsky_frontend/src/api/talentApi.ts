import ITalent from "../interfaces/talent";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/talent/";

export async function getAllTalents(): Promise<Array<ITalent>> {
	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function getTalentById(id: string): Promise<ITalent> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function createTalent(talent: ITalent): Promise<ITalent> {
	const data = {
		name: talent.name,
		buff_value: talent.buff_value,
		description: talent.description,
		category: talent.category,
		creator: talent.creator,
	};
	const response = await fetch(globalUrl + "post", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
		body: JSON.stringify(data),
	});

	return await response.json();
}
export async function updateTalent(id: string, data: any): Promise<ITalent> {
	/*const data =
        {
            name : talent.name,
            buff_value : talent.buff_value,
            description : talent.description,
            category : talent.category
        };*/
	const response = await fetch(globalUrl + "update/" + id, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
		body: JSON.stringify(data),
	});

	return await response.json();
}

export async function deleteTalent(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
