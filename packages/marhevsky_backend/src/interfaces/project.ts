import { Document, Schema } from 'mongoose';

export default interface IProject extends Document {
    name: string;
    description: string;
    template: Boolean;
    tasks: Array<Schema.Types.ObjectId>;
    team: Array<Schema.Types.ObjectId>;
    backlogs: Array<Schema.Types.ObjectId>;
    creator: Schema.Types.ObjectId;
    collaborators: Array<Schema.Types.ObjectId>;
}