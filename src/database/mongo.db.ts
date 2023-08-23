import mongoose from "mongoose";
import { mongoConfig } from "../../envConfig";
import buyerModel from '../database/models/mongoDB/buyers.model';
import sellersModel from '../database/models/mongoDB/sellers.model';
import {connectToAMQP} from "./amqp.connection";

const connect = mongoose.connect(mongoConfig.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

buyerModel.watch().on('change', (data) => {
  data["key"] = "buyer";
  connectToAMQP(data);
});

sellersModel.watch().on('change', (data) => {
  data["key"] = "seller";
  connectToAMQP(data);
});

export default connect;