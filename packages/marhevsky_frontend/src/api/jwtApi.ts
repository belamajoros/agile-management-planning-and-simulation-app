var globalUrl = "http://localhost:1337/jwt/";

interface JWTResponse {
	token?: string;
	error?: string;
}

export async function signJWT(userId: string): Promise<JWTResponse> {
	let url = globalUrl + "signJWT";
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user_id: userId }),
	});

	return await response.json();
}
