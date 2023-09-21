import mongoose, {Schema} from 'mongoose';
import IBacklog from "../interfaces/backlog";

const BacklogSchema: Schema = new Schema(
    {
        task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        worker: { type: [Schema.Types.ObjectId], ref: "Worker", required: false },
        progress: { type: Number, required: true },
        sprintNo: { type: Number, required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IBacklog>('Backlog', BacklogSchema);