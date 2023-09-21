import {Document, Schema} from 'mongoose';

export default interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    projects: Array<Schema.Types.ObjectId>;
}