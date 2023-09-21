import mongoose, { Schema } from 'mongoose';
import ITask from "../interfaces/task";

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true},
        description: { type: String, required: true},
        priority: { type: Number, required: false },
        estimation: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref:"Category", required: true },
        creator: { type: Schema.Types.ObjectId, ref:"User", required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITask>('Task', TaskSchema);