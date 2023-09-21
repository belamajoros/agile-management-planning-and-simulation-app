import {Document, Schema} from 'mongoose';

export default interface ITask extends Document {
    title: string;
    description: string;
    priority: number;
    estimation: number;
    category: Schema.Types.ObjectId;
    creator: Schema.Types.ObjectId;
}