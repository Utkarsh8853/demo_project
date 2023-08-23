import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { authRouter } from './src/routes/auth.route';
import { dashboardRouter } from './src/routes/user-dashboard.route';
import { productRouter } from './src/routes/product.route';
import { serverConfig } from './envConfig';
import connect from './src/database/mongo.db';
import { adminAuthRouter } from './src/routes/admin_auth.route';
import { categoryRouter } from './src/routes/delivery.route';



console.log(" there")

connect

const app:Express = express();
app.use(express.json());
app.use(bodyParser.urlencoded( {extended: true} ));

const port = serverConfig.PORT ; 
const hostname = serverConfig.HOST;

app.use("/seller", authRouter);
app.use("/buyer", authRouter);
app.use("/admin", adminAuthRouter);
app.use("/user", dashboardRouter);
app.use("/", productRouter);
app.use("/", categoryRouter);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
