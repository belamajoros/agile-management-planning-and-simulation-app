import mongoose, { Schema } from 'mongoose';
import IProject from "../interfaces/project";

const ProjectSchema: Schema = new Schema(
    {
        name: { type: String, required: true},
        description: { type: String, required: true },
        template: { type: Boolean, required: true},
        tasks: { type: [Schema.Types.ObjectId], ref:"Task", required: false },
        team: { type: [Schema.Types.ObjectId], ref:"Worker", required: false },
        backlogs: {type: [Schema.Types.ObjectId], ref:"Backlog", required: false},
        creator: { type: Schema.Types.ObjectId , required: true },
        collaborators: { type: [Schema.Types.ObjectId], required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IProject>('Project', ProjectSchema);