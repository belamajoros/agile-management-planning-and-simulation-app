import IProject from "../interfaces/project";
import TokenUtilService from "../utils/token-util";

var globalUrl = "http://localhost:1337/project/";

export async function getAllProjects(): Promise<Array<IProject>> {
	const response = await fetch(globalUrl + "get/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function getProjectById(id: string): Promise<IProject> {
	const response = await fetch(globalUrl + "get/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function getProjectByCreatorId(
	creatorId: string
): Promise<Array<IProject>> {
	const response = await fetch(globalUrl + "get/creator/" + creatorId, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});
	return await response.json();
}

export async function createProject(project: IProject): Promise<IProject> {
	const data = {
		name: project.name,
		description: project.description,
		creator: project.creator,
		tasks: project.tasks,
		team: project.team,
		backlogs: project.backlogs,
		template: project.template,
		collaborators: project.collaborators,
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
export async function updateProject(
	id: string,
	data: {
		name?: string;
		description?: string;
		creator?: string;
		tasks?: string[];
		team?: string[];
		backlogs?: string[];
		collaborators?: string[];
	}
): Promise<IProject> {
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

export async function deleteProject(id: string): Promise<Response> {
	const response = await fetch(globalUrl + "delete/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TokenUtilService.parseTokenFromStorage()}`,
		},
	});

	return await response.json();
}
