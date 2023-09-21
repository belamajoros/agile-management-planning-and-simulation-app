
export default interface IProject{
    _id?: string
    name?: string;
    description?: string;
    template?: boolean;
    tasks?: Array<string>;
    team?: Array<string>;
    backlogs?: Array<string>;
    creator?: string;
    collaborators?: Array<string>;
}