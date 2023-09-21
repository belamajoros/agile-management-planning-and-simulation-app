
export default interface IBacklog{
    _id?: string
    task?: string;
    worker?: Array<string>;
    progress?: number;
    sprintNo?: number;
}