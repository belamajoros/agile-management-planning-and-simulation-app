import mongoose, {Schema} from 'mongoose';
import ITalent from "../interfaces/talent";

const TalentSchema: Schema = new Schema(
    {
        name: { type: String , required: true},
        buff_value: { type: Number , required: true },
        description: { type: String , required: true },
        category: { type: Schema.Types.ObjectId , ref:"Category", required: true },
        creator: { type: Schema.Types.ObjectId , required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITalent>('Talent', TalentSchema);