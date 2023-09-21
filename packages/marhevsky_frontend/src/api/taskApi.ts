import ITask from "../interfaces/task";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/task/";

export async function getAllTasks(): Promise<Array<ITask>> {
	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function getTaskById(id: string): Promise<ITask> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function createTask(task: ITask): Promise<ITask> {
	const data = {
		title: task.title,
		description: task.description,
		priority: task.priority,
		estimation: task.estimation,
		category: task.category,
		creator: task.creator,
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
export async function updateTask(id: string, data: any): Promise<ITask> {
	/*const data =
        {
            title: task.title,
            description : task.description,
            priority : task.priority,
            estimation : task.estimation,
            category : task.category,
            creator : task.creator,
            secret : task.secret
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

export async function deleteTask(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
