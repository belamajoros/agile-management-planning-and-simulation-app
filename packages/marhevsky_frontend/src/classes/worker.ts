import IWorker from "../interfaces/worker";

export default class Worker implements IWorker{
    description?: string;
    name?: string;
    talents?: Array<string>;
    creator?: string

    constructor(description?: string, name?: string, talents?: Array<string>, creator?: string) {
        this.name = name;
        this.description = description;
        this.talents = talents;
        this.creator = creator;
    }

}