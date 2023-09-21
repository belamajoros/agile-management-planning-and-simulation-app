import {Schema} from "mongoose";

export default interface IWorker extends Document {
    name : string;
    description: string;
    talents: Array<Schema.Types.ObjectId>;
    creator: Schema.Types.ObjectId;
}