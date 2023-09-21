import {Schema} from "mongoose";

export default interface ITalent extends Document {
    name: string;
    description: string;
    buff_value: number;
    category: Schema.Types.ObjectId;
    creator: Schema.Types.ObjectId;
}