import {Document, Schema} from 'mongoose';

export default interface IBacklog extends Document {
    task: Schema.Types.ObjectId;
    worker: Array<Schema.Types.ObjectId>;
    progress: number;
    sprintNo: number;
}