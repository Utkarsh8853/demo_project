import { Schema, model, Document, Types} from 'mongoose';

// Product schema
interface Review {
  buyer_id: Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<Review>({
  buyer_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
},{ timestamps: true })

interface Product extends Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category_id: string;
    seller_id: string;
    avg_rating: string;
    review : string[];
}
  
const productSchema = new Schema<Product>({

  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  seller_id: {
    type: String,
    required: true,
  },
  avg_rating: {
    type: String,
    default: '0',
    required: true,
  },
  review: [reviewSchema],
},{ timestamps: true });

export default model<Product>('product', productSchema);
