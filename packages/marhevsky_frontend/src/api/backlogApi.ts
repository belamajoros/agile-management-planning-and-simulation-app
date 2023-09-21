import IBacklog from "../interfaces/backlog";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/backlog/";

export async function getAllBacklogs(): Promise<Array<IBacklog>> {
	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function getBacklogById(id: string): Promise<IBacklog> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function createBacklog(backlog: IBacklog): Promise<IBacklog> {
	const data = {
		task: backlog.task,
		worker: backlog.worker,
		progress: backlog.progress,
		sprintNo: backlog.sprintNo,
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
export async function updateBacklog(id: string, data: any): Promise<IBacklog> {
	/*const data =
        {
            task : backlog.task,
            worker : backlog.worker,
            progress : backlog.progress,
            active : backlog.active,
            sprintNo: backlog.sprintNo
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

export async function deleteBacklog(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
