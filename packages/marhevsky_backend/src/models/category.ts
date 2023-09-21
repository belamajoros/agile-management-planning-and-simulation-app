import mongoose, {Schema} from 'mongoose';
import ICategory from "../interfaces/category";

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true, unique: false },
        creator: { type: Schema.Types.ObjectId , required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICategory>('Category', CategorySchema);