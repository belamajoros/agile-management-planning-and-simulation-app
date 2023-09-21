import ICategory from "../interfaces/category";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/category/";

export async function getAllCategories(): Promise<Array<ICategory>> {
	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}

export async function getCategoryById(id: string): Promise<ICategory> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function createCategory(category: ICategory): Promise<ICategory> {
	const data = {
		name: category.name,
		description: category.description,
		creator: category.creator,
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
export async function updateCategory(
	id: string,
	data: any
): Promise<ICategory> {
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

export async function deleteCategory(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
