import { Schema, model, Document } from 'mongoose';

// Seller schema
interface Address {
  house_no: string;
  street_no: string;
  area: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

const addressSchema = new Schema<Address>({
  house_no: {
    type: String,
    required: true,
  },
  street_no: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
},{ timestamps: true })

export interface Seller extends Document {
  name: string;
  email: string;
  password: string;
  ph_no: string;
  address: string[];
  admin_approval: boolean;
}
  
const sellerSchema = new Schema<Seller>({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    allowNull: true,
  },
  password: {
    type: String,
    allowNull: true,
  },
  ph_no: {
    type: String,
    allowNull: true,
  },
  address: [addressSchema],
  admin_approval:{
    type: Boolean,
    default: false
  }
},{ timestamps: true });

export default model<Seller>('sellers', sellerSchema);
