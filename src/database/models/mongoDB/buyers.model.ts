import { Schema, model, Document} from 'mongoose';

// Buyer schema
interface Address {
  house_no: string;
  street_no: string;
  area: string;
  city: string;
  state: string;
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

interface Buyer extends Document {
  name: string;
  email: string;
  password: string;
  ph_no: string;
  address: string[];
}
  
const buyerSchema = new Schema<Buyer>({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  ph_no: {
    type: String,
  },
  address: [addressSchema],
},{ timestamps: true });

export default model<Buyer>('buyers', buyerSchema);
