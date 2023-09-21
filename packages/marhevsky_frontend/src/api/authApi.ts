import IUser from "../interfaces/user";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/auth/";

export async function registerUser(user: IUser): Promise<Response> {
	let url = globalUrl + "register";

	const data = {
		email: user.email,
		username: user.username,
		password: user.password,
	};
	const response = await fetch(globalUrl + "register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return response;
}

export async function createUserWithId(
	id: string,
	email: string
): Promise<Response> {
	const response = await fetch(globalUrl + "createUserWithId", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
		body: JSON.stringify({ id: id, email: email }),
	});

	return response;
}

interface ILoginResponse {
	message: string;
	token?: string;
}
export async function loginUser(
	email: string,
	password: string
): Promise<ILoginResponse> {
	const data = {
		email: email,
		password: password,
	};
	let url = globalUrl + "login";
	const response = await fetch(globalUrl + "login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return await response.json();
}
