import { createBacklog, getBacklogById, updateBacklog } from "../api/backlogApi";
import { getTalentById } from "../api/talentApi";
import { getWorkerById } from "../api/workerApi";
import Backlog from "../classes/backlog";
import { BacklogCalculationProp } from "../components/simulation/sprintComponent";
import IBacklog from "../interfaces/backlog";
import ITalent from "../interfaces/talent";
import ITask from "../interfaces/task";
import IWorker from "../interfaces/worker";
import { addBacklogsToProject, getProjectBacklogs } from "./projectService";

export async function addWorkersToBacklog(backlogId: string, newWorkers: Array<string>) {
    //funkcia pre pridanie workerov do backogu
    const backlog = await getBacklogById(backlogId);

    if (backlog.worker) {
        let oldWorkers: Array<string> = backlog.worker;
        for (const workerId of newWorkers) {
            if (!oldWorkers.includes(workerId)) {
                oldWorkers.push(workerId);
            } else {
                console.log("You already have worker " + workerId + " in backlog " + backlogId + "!")
            }
        }
        const data =
            {
                worker: oldWorkers
            }

        updateBacklog(backlogId, data).then(r => console.log(r));
    }
}

export async function getBacklogWorkers(backlogId: string): Promise<Array<IWorker>> {
    //funkcia pre ziskanie workerov z backogu
    const backlog = await getBacklogById(backlogId);

    let backlogWorkers: Array<IWorker> = [];
    if (backlog.worker) {
        for (const workerId of backlog.worker) {
            await getWorkerById(workerId).then((worker) => {
                backlogWorkers.push(worker);
            }).catch((e) => {
                console.log(e)
            });
        }
    }
    return backlogWorkers;
}

export function calculateBacklogProgress(backlogCalculationProps: Array<BacklogCalculationProp>, talents: Map<string, Array<ITalent>>, workersCapacitiesMap: Map<string, number>) {
    //funkcia pre ziskanie progressu pre task
    const workerCalculationMap: Map<string, number> = new Map(workersCapacitiesMap);
    backlogCalculationProps.forEach(backlogCalculationProp => {
        const workersCount = backlogCalculationProp.backlog.worker!.length;
        const task = backlogCalculationProp.task;
        let workerTaskCapacity = task.estimation! - (task.estimation! * (backlogCalculationProp.backlog.progress! / 100)) / workersCount;
        let estimated = backlogCalculationProp.backlog.progress!;
        backlogCalculationProp.backlog.worker!.forEach((worker) => {
            if (talents.get(worker)) {
                talents!.get(worker)!.forEach((talent) => {
                    if (talent.category == task.category) {
                        workerTaskCapacity = workerTaskCapacity - (workerTaskCapacity * (talent.buff_value ? talent.buff_value : 0) / 100);
                    }
                })
            }
            const capacity = workerCalculationMap.get(worker) ? workerCalculationMap.get(worker) : 0
            estimated = estimated + ((capacity ? capacity : 1) * 100 / (workerTaskCapacity ? workerTaskCapacity : 1))
            if (estimated > 100) {
                estimated = 100;
            }
            let minusCapacity = workerCalculationMap.get(worker as string)! - workerTaskCapacity;
            if (minusCapacity < 0) {
                minusCapacity = 0
            }
            workerCalculationMap.set(worker, minusCapacity);
        })
        if (estimated > 100) {
            backlogCalculationProp.backlog.progress = 100;
        } else {
            backlogCalculationProp.backlog.progress = estimated;
        }
        backlogCalculationProp.backlog.progress = +backlogCalculationProp.backlog.progress.toFixed(2);
    });
    console.log(backlogCalculationProps);
}


export function calculateWorkerEstimation(backlogCalculationProp: BacklogCalculationProp, estimationPart: number, worker: IWorker, talents: Map<string, Array<ITalent>>): number {
    //funkcia pre ziskanie progressu pre task
    let workerTaskCapacity = estimationPart;
    let workerEstimationPart = workerTaskCapacity;
    const task = backlogCalculationProp.task;
    if (worker.talents) {
        talents!.get(worker._id as string)!.forEach((talent) => {
            if (talent.category == task.category) {
                if (talent.buff_value! < 0) {
                    workerEstimationPart = workerTaskCapacity + ((workerTaskCapacity * Math.abs(talent.buff_value!)) / 100)
                } else if (talent.buff_value! > 0) {
                    workerEstimationPart = workerTaskCapacity - ((workerTaskCapacity * Math.abs(talent.buff_value!)) / 100)
                } else {
                    workerEstimationPart = workerTaskCapacity;
                }
            }
        })
    }
    return workerEstimationPart;
}

export async function moveBacklogsToNextSprint(backlogs: Array<BacklogCalculationProp>, projectId: string): Promise<Array<BacklogCalculationProp>> {
    //funkcia pre presunutie nedokonceneho backlogu do dalsieho sprintu
    return new Promise((resolve) => {
        const copiedBacklogsList: Array<BacklogCalculationProp> = [];
        const newBacklogList: Array<string> = [];
        for (const backlog of backlogs) {
            if (backlog.backlog.progress! < 100) {
                const newSprintNo: number = backlog.backlog!.sprintNo! + 1;
                const newBacklog: IBacklog = JSON.parse(JSON.stringify(backlog.backlog));
                newBacklog.sprintNo = newSprintNo;
                newBacklog.worker = [];
                newBacklog._id = undefined;
                createBacklog(newBacklog).then(r => {
                    newBacklogList.push(r._id as string)
                    addBacklogsToProject(projectId, newBacklogList).then(res => {
                        copiedBacklogsList.push({task: backlog.task, backlog: r} as BacklogCalculationProp);
                    });
                });
            }
        }
        resolve(copiedBacklogsList);
    })
}



