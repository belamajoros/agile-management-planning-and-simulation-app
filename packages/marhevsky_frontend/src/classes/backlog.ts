import IBacklog from "../interfaces/backlog";

export default class Backlog implements IBacklog{
    progress?: number;
    task?: string;
    worker?: Array<string>;
    sprintNo?: number;

    constructor(progress?: number, task?: string, worker?: Array<string>, sprintNo?: number) {
        this.progress = progress;
        this.task = task;
        this.worker = worker;
        this.sprintNo = sprintNo;
    }

}