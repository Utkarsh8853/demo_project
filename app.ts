import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { authRouter } from './src/routes/auth.route';
import { dashboardRouter } from './src/routes/user-dashboard.route';
import { productRouter } from './src/routes/product.route';
import { serverConfig } from './envConfig';
import connect from './src/database/mongo.db';
import { adminAuthRouter } from './src/routes/admin_auth.route';
import { categoryRouter } from './src/routes/delivery.route';
import { chatbotRouter } from './src/routes/chatbot.route';



connect

const app:Express = express();
app.use(express.json());
app.use(bodyParser.urlencoded( {extended: true} ));

const port = serverConfig.PORT ; 
const hostname = serverConfig.HOST;

//
const history =[
  {
    "product_id": {
      "$oid": "64e33848cc29d81a6c328f6c"
    },
    "unit_price": 6000,
    "delivery_status": "delivered",
    "_id": {
      "$oid": "64e46560be4493737e9723bb"
    },
    "createdAt": {
      "$date": "2023-08-22T07:36:00.894Z"
    },
    "updatedAt": {
      "$date": "2023-08-22T07:44:25.403Z"
    },
    "address_id": "64ddd27a6b78ae1cd08a0fd7",
    "quantity": 2
  },
  {
    "product_id": {
      "$oid": "64e35ab2dc4d42c3135fa66f"
    },
    "unit_price": 6000,
    "delivery_status": "pending",
    "_id": {
      "$oid": "64e467592e8179bb6b031985"
    },
    "createdAt": {
      "$date": "2023-08-22T07:44:25.071Z"
    },
    "updatedAt": {
      "$date": "2023-08-22T07:44:25.403Z"
    },
    "address_id": "64ddd27a6b78ae1cd08a0fd7"
  }
]

function generatePayload(history: any[]): any[] {
  const payload = [];
  for (const entry of history) {
    const payloadEntry = {
      title: `Product ID: ${entry.product_id.$oid}`,
      message: `Product ID: ${entry.product_id.$oid}`,
      // message: `Delivery Status: ${entry.delivery_status}\nDelivery Status: ${entry.delivery_status}\nDelivery Status: ${entry.delivery_status}  `,
      replyMetadata: {
        message: `Delivery Status: ${entry.delivery_status}\nDelivery Status: ${entry.delivery_status}\nDelivery Status: ${entry.delivery_status}  `,
 
      }
      // Add other required fields from the history entry
    };
    payload.push(payloadEntry);
  }
  return payload;
}
// function generatePayload(history: any[]): any[] {
// const payload = [];
// for (const entry of history) {
//   const payloadEntry = {
//     "message": `${entry.product_id}`,
//     "title": `unit_price: ${entry.unit_price} delivery_status: ${entry.delivery_status} address_id: ${entry.address_id} quantity:${entry.quantity}`
//     // Add other required fields from the history entry
//   };
//   payload.push(payloadEntry);
// }
// return payload;
// }
const payload = generatePayload(history);
//








app.post('/a', (req,res)=>{
  console.log("hiii",req.headers.qwe);
  console.log("hiii",req.body.message);
  console.log("/////////////////////////////////////////////");
  console.log(payload);
  
  console.log("/////////////////////////////////////////////");
  
  res.send([{
    "message": "Kompose!"
}, {
    "message": "Select the suitable option",
    "metadata": {
    "contentType": "300",
        "templateId": "6",
        "payload": payload
    }
}])
});

app.use("/seller", authRouter);
app.use("/buyer", authRouter);
app.use("/admin", adminAuthRouter);
app.use("/user", dashboardRouter);
app.use("/", productRouter);
app.use("/", categoryRouter);
app.use("/chatbot", chatbotRouter);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
