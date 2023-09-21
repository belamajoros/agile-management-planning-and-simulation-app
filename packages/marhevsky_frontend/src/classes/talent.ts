import ITalent from "../interfaces/talent";

export default class Talent implements ITalent{
    name?: string;
    description?: string;
    buff_value?: number;
    category?: string;
    creator?: string;


    constructor(buff_value?: number, category?: string, description?: string, name?: string, creator?: string) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.buff_value = buff_value;
        this.creator = creator;
    }

}