import mongoose, {Schema} from 'mongoose';
import IWorker from "../interfaces/worker";

const WorkerSchema: Schema = new Schema(
    {
        name: { type: String, required: true},
        description: { type: String, required: true },
        talents: { type: [Schema.Types.ObjectId], ref: "Talent", required: false },
        creator: { type: Schema.Types.ObjectId, ref:"User", required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IWorker>('Worker', WorkerSchema);