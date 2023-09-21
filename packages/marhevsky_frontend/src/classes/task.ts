import ITask from "../interfaces/task";

export default class Task implements ITask{
    category?: string;
    creator?: string;
    description?: string;
    estimation?: number;
    priority?: number;
    title?: string;

    constructor(category?: string, creator?: string, title?: string, description?: string, estimation?: number, priority?: number) {
        this.category = category;
        this.description = description;
        this.creator = creator;
        this.priority = priority;
        this.estimation = estimation;
        this.title = title;
    }

}