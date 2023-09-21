import { getBacklogById } from "../api/backlogApi";
import { getProjectById, updateProject } from "../api/projectApi";
import { getTaskById } from "../api/taskApi";
import { getWorkerById } from "../api/workerApi";
import IBacklog from "../interfaces/backlog";
import ITask from "../interfaces/task";
import IWorker from "../interfaces/worker";


export async function addBacklogsToProject(projectId: string, backlogs: Array<string>) {
    //funkcia pre pridanie pola backlogov do projektu
    const project = await getProjectById(projectId);

    if (project.backlogs) {
        let oldBacklogs: Array<string> = project.backlogs;
        for (const backlogId of backlogs) {
            if (!oldBacklogs.includes(backlogId)) {
                oldBacklogs.push(backlogId);
            } else {
                let message = "You already have Backlog " + backlogId + " in project " + projectId + "!"
                console.log(message);
                return "ALREADY_EXIST"
            }
        }
        const data =
            {
                backlogs: oldBacklogs
            }

        return await updateProject(projectId, data);
    }
    return "";
}

export async function addTasksToProject(projectId: string, tasks: Array<string>) {
    //funkcia pre pridanie pola taskov do projektu
    const project = await getProjectById(projectId);

    if (project.tasks) {
        let oldTasks: Array<string> = project.tasks;
        for (const taskId of tasks) {
            if (!oldTasks.includes(taskId)) {
                oldTasks.push(taskId);
            } else {
                let message = "You already have task " + taskId + " in project " + projectId + "!"
                console.log(message);
                return "ALREADY_EXIST"
            }
        }
        const data =
            {
                tasks: oldTasks
            }
         return await updateProject(projectId, data);
    }
    return "";
}

export async function addWorkersToProject(projectId: string, workers: Array<string>) {
    //funkcia pre pridanie pola workerov do projektu
    const project = await getProjectById(projectId);

    if (project.team) {
        let oldWorkers: Array<string> = project.team;
        for (const workerId of workers) {
            if (!oldWorkers.includes(workerId)) {
                oldWorkers.push(workerId);
            } else {
                let message = "You already have worker " + workerId + " in project " + projectId + "!"
                console.log(message);
                return "ALREADY_EXIST"
            }
        }
        const data =
            {
                team: oldWorkers
            }

        return await updateProject(projectId, data);
    }
    return "";
}

export async function getProjectBacklogs(projectId: string): Promise<Array<IBacklog>> {
    // funkcia pre ziskanie vsetkych backlogov na projekte

    const project = await getProjectById(projectId);

    let projectBacklogs: Array<IBacklog> = [];
    if (project.backlogs) {
        for (const backlogId of project.backlogs) {
            await getBacklogById(backlogId).then((backlog) => {
                projectBacklogs.push(backlog);
            }).catch((e) => {
                console.log(e)
            });
        }
    }
    return projectBacklogs;
}

export async function getProjectTasks(projectId: string): Promise<Array<ITask>> {
    // funkcia pre ziskanie vsetkych úloh na projekte

    const project = await getProjectById(projectId);

    let projectTasks: Array<ITask> = [];
    if (project.tasks) {
        for (const taskId of project.tasks) {
            await getTaskById(taskId).then((task) => {
                projectTasks.push(task);
            }).catch((e) => {
                console.log(e)
            });
        }
    }
    return projectTasks;
}

export async function getProjectWorkers(projectId: string): Promise<Array<IWorker>> {
    // funkcia pre ziskanie vsetkych pracovnikov na projekte
    const project = await getProjectById(projectId);

    let projectWorkers: Array<IWorker> = [];
    if (project.team) {
        for (const workerId of project.team) {
            await getWorkerById(workerId).then((worker) => {
                projectWorkers.push(worker);
            }).catch((e) => {
                console.log(e)
            });
        }
    }
    return projectWorkers;
}

export async function removeAllBacklogsFromProject(projectId: string) {
    //funkcia pre odstranenie pola backlogov z projektu
    const project = await getProjectById(projectId)
    console.log(projectId)
    console.log(project)
    if (project.backlogs) {
        const data =
            {
                backlogs: []
            }

        return await updateProject(projectId, data);
    }
    return "";
}
