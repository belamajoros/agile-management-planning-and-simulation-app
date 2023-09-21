import ICategory from "../interfaces/category";

export default class Category implements ICategory{
    description?: string;
    name?: string;
    creator?: string;

    constructor(description?: string, name?: string, creator?: string) {
        this.name = name;
        this.description = description;
        this.creator = creator;
    }
}