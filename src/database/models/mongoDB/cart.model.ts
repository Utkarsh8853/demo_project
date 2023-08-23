import { Schema, model, Document, Types} from 'mongoose';

// Cart schema
interface Cart {
    product_id: Types.ObjectId;
    quantity: number;
    unit_price: number;
    total_cost: number;
  }
  
const cartSchema = new Schema<Cart>({
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    total_cost: {
        type: Number,
        required: true,
    },
},{ timestamps: true })
  
interface personalCart extends Document {
  buyer_id: Types.ObjectId;
  total_amount: number;
  cart: string
}
  
const personalCartSchema = new Schema<personalCart>({
    buyer_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    cart: [cartSchema]
},{ timestamps: true });
export default model<Cart>('cart', personalCartSchema);
