import { Schema, model, Document} from 'mongoose';

// Category schema
interface Category extends Document {
  name: string;
}
  
const categorySchema = new Schema<Category>({
    name: {
    type: String,
    required: true,
  }
},{ timestamps: true });
export default model<Category>('category', categorySchema);
