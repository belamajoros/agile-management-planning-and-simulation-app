import mongoose, { Schema } from 'mongoose';
import IUser from "../interfaces/user";

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: false, unique: false },
        email: { type: String, required: false, unique: true },
        password: { type: String, required: false },
        projects: { type: [Schema.Types.ObjectId], ref: "Project", required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);