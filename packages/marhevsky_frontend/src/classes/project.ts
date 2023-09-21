import IProject from "../interfaces/project";

export default class Project implements IProject{
    name?: string;
    description?: string;
    template?: boolean;
    tasks?: Array<string>;
    team?: Array<string>;
    backlogs?: Array<string>;
    creator?: string;
    collaborators?: Array<string>;

    constructor(backlogs?: Array<string>, creator?: string, description?: string, name?: string, tasks?: Array<string>, team?: Array<string>, template?: boolean, collaborators?: Array<string>) {
        this.backlogs = backlogs;
        this.creator = creator;
        this.description = description;
        this.name = name;
        this.tasks = tasks;
        this.team = team;
        this.template = template;
        this.collaborators = collaborators;
    }

}