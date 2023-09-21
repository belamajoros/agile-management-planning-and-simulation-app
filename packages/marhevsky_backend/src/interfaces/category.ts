import {Schema} from "mongoose";

export default interface ICategory extends Document {
    name: string;
    description: string;
    creator: Schema.Types.ObjectId;
}