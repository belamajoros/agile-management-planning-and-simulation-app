import IUser from "../interfaces/user";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/user/";

export async function getAllUsers(): Promise<Array<IUser>> {
	let url = globalUrl + "get/all";

	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
export async function getUserById(id: string): Promise<IUser> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function updateUser(id: string, data: any): Promise<string> {
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

export async function deleteUser(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}

const result = document.getElementById("result");
