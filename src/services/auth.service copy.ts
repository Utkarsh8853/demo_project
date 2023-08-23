import buyerModel from "../database/models/mongoDB/buyers.model";
import bcrypt from 'bcrypt';
import Session from "../database/models/postgresSQL/session.model";
import jwt from 'jsonwebtoken';
import client from "../database/redis.db";
import { googleConfig, jwtConfig, nodemailerConfig, twilioConfig } from "../../envConfig";
import twilio from 'twilio';
import amqp from 'amqplib/callback_api';
import sequelize from "../database/postgres.db";
import Buyer from "../database/models/postgresSQL/buyer.model";
import sellersModel from "../database/models/mongoDB/sellers.model";
import Seller from "../database/models/postgresSQL/seller.model";
import nodemailer from "nodemailer"

const twilioClient = twilio(twilioConfig.TWILIO_ACCOUNT_SID, twilioConfig.TWILIO_AUTH_TOKEN);

export  const checkRedirectUri = async (name:string)=>{
  if(name === "/buyer"){
    return googleConfig.CLIENT_REDIRECT_BUYER_URI;
  } else if(name === "/seller"){
    return googleConfig.CLIENT_REDIRECT_SELLER_URI;
  } 
}

export  const checkModel = async (name:string)=>{
  if(name === "/buyer"){
    return buyerModel;
  } else if(name === "/seller"){
    return sellersModel;
  } else if(name === "/seller"){
    return sellersModel;
  }
  
}

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, channel) => {
      if (err) throw err;
      const queue = 'user_queue';
      channel.assertQueue(queue, { durable: false });
      const changeStream = buyerModel.watch();
      changeStream.on('change', (data) => {
        data["key"] = "buyer";
        const message = JSON.stringify(data);
        console.log("/////////////////////////////////////////////////");
        console.log(message);
        console.log("/////////////////////////////////////////////////");
        channel.sendToQueue(queue, Buffer.from(message));
      });
    });
});

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, channel) => {
      if (err) throw err;
      const queue = 'user_queue';
      channel.assertQueue(queue, { durable: false });
      const changeStream = sellersModel.watch();
      changeStream.on('change', (data) => {
        data["key"] = "seller";
        const message = JSON.stringify(data);
        console.log("/////////////////////////////////////////////////");
        console.log(message);
        console.log("/////////////////////////////////////////////////");
        channel.sendToQueue(queue, Buffer.from(message));
      });
    });
});

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, channel) => {
      if (err) throw err;
      const queue = 'user_queue';
      channel.assertQueue(queue, { durable: false });
      channel.consume(queue, async (message :any) => {
        const data = JSON.parse(message.content.toString());
        console.log("/////////////////////////////////////////////////");
        console.log('data',data);
        console.log("/////////////////////////////////////////////////");
        console.log('data11',data.key);
        console.log("/////////////////////////////////////////////////");
        // console.log('data1',data.updateDescription.updatedFields);
        // console.log("/////////////////////////////////////////////////");
        let model
        if(data.key === 'buyer'){
          model= Buyer
        }
        else{
          model= Seller
        }
        switch (data.operationType) {
          case 'insert':
            await insertUser(model,data.fullDocument);
            break;
          case 'update':
            await updateUser(model,data.documentKey._id, data.updateDescription.updatedFields);
            break;
          case 'delete':
            await deleteUser(model,data.documentKey._id);
            break;
        }
      }, { noAck: true });
    });
});

async function insertUser(model:any,user: any) {
  try {
      await sequelize.query('BEGIN');
      console.log("=======================================");
      
      const result = await model.create({id:user._id,name: user.name, email:user.email, password:user.password, ph_no:user.ph_no});
      //await sequelize.query(`INSERT INTO buyers (id, name, email, password, ph_no) VALUES ('${id}', '${user.name}', '${user.email}', '${user.password}', '${user.ph_no}')`,{type: QueryTypes.INSERT});
      console.log("=========================",result);
      await sequelize.query('COMMIT');
      console.log(`Inserted user with ID ${user._id}`);
  } catch (e) {
      await sequelize.query('ROLLBACK');
      throw e;
  }
}

async function updateUser(model:any,id: string, fields: any) {
  try {
    await sequelize.query('BEGIN');
    console.log("jkhgfd",fields);
    
    const result = await model.update({name:fields.name,email:fields.email,password:fields.password,ph_no:fields.ph_no},{where: {id:id}})
    // await Address.update({house_no: fields.house_no,street_no:fields.street_no, area:fields.area,city:fields.city,state:fields.state,zip_code:fields.zip_code},{where: {id:id}});
  //   await sequelize.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id', [fields.name, fields.email, fields.password, id]);
    console.log("=========================",result);
    await sequelize.query('COMMIT');
    console.log(`Updated user with ID ${id}`);
  } catch (e) {
    await sequelize.query('ROLLBACK');
    throw e;
  }
}

async function deleteUser(model:any,id: string) {
  try {
    await sequelize.query('BEGIN');
    const result = await model.destroy({where:{id:id}})
    console.log("/////////////////////////////////////////////////");
    console.log('result',result);
    console.log("/////////////////////////////////////////////////");
    
    await sequelize.query('COMMIT');
    console.log(`Deleted user with ID ${id}`);
  } catch (e) {
    await sequelize.query('ROLLBACK');
    throw e;
  }
}  

export  const verifyUserExist = async (modelName:any,email: string)=>{
  const checkUser = await modelName.findOne({email:email})
  return checkUser;
}

export  const userEntrybyGoogle = async (modelName:any,name: string, email: string)=>{
  const createUser:any = await modelName.create({name: name, email:email,});
  console.log(createUser);
  const session_id = await sessionCreation(createUser._id.toString());
  const token = tokenGenration(modelName,createUser._id.toString(),session_id)
  redisSessionCreation(createUser._id.toString(),session_id);
  return token;
}

export  const userLoginbyThirdParty = async (baseUrl:string,user_id:string)=>{
  const session_id = await sessionCreation(user_id);
  const token = tokenGenration(baseUrl,user_id,session_id);
  redisSessionCreation(user_id,session_id);
  return token;
}

export  const userEntrybyPh_no = async (modelName:any,name: string, ph_no: string)=>{
  const createUser:any = await modelName.create({name: name, ph_no: ph_no});
  console.log(createUser);
  const session_id = await sessionCreation(createUser._id.toString());
  const token = tokenGenration(modelName,createUser._id.toString(),session_id)
  redisSessionCreation(createUser._id.toString(),session_id);
  await client.del(`${ph_no}__otp`)
  return token;
}

export  const userSigninByPh_no = async (ph_no:string)=>{
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  await twilioClient.messages.create({
    body: `Your verification code for E-commerce is: ${verificationCode} and it vaild only for 5 minutes`,
    from: twilioConfig.TWILIO_MSG_NO,
    to: `+91${ph_no}`
  });
  const hashOtp = await bcrypt.hash(verificationCode.toString(),3);
  redisOtpStore(ph_no,hashOtp)
}

export  const redisOtpStore = async (value: string,otp: string)=>{
  let otp_payload={
    id: value,
    otp: otp
  }
  await client.setex(`${value}__otp`,300,JSON.stringify(otp_payload))
}

export  const otpVerification = async (value: string,otp: string)=>{
  const bcryptOtp= await client.get(`${value}__otp`)as string; 
  const checkOtp =await bcrypt.compare(otp, JSON.parse(bcryptOtp).otp)
  return checkOtp;
}

export  const userEntry = async (modelName:any,name: string, email: string, password: string)=>{
  const hashPwd = await bcrypt.hash(password,3);
  const createUser = await modelName.create({name: name, email:email, password:hashPwd});
  return createUser;
}

export  const verifyUserPh_no = async (modelName:any,ph_no: string)=>{
  const checkPh_no = await modelName.findOne({ph_no: ph_no})
  return checkPh_no;
}

export  const matchPwd = async (password: string, bcryptPwd:string)=>{
  const checkPwd =bcrypt.compare(password, bcryptPwd)
  return checkPwd;
}

export  const sessionCreation = async (user_id: string)=>{
  let session_payload={
    user_id: user_id.toString(),
    device_id:"1234",
    device_type:"google chrome",
    isActive: true
  } 
  await Session.create(session_payload)
  const lastSessionId: number= await Session.max('id'); 
  return lastSessionId;
}

export  const tokenGenration = (baseUrl:string,user_id: string,session_id: number)=>{
  const token: string = jwt.sign({id:user_id,baseUrl:baseUrl,session_id: session_id},jwtConfig.JWT_TOKEN_CODE,{expiresIn: '24h'});
  return token;
}

export  const redisSessionCreation = async (user_id: string,session_id: number)=>{
  let session_payload={
    user_id: user_id,
    device_id:"1234",
    device_type:"google chrome",
    isActive: true
  }
  const a =await client.setex(`${user_id}_${session_id}`,24*60*60,JSON.stringify(session_payload))
    
}

export  const userLogout = async(user_id: string,session_id: number)=>{
  const result = await Session.update({isActive: false,},{where: {id:session_id}});
  await client.del(`${user_id}_${session_id}`)
  return result;
}

export  const forgetPwdToken = async(email: string)=>{
  let OTP = Math.floor(100000 + Math.random() * 9000);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: nodemailerConfig.NODEMAILER_EMAIL,
        pass: nodemailerConfig.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: nodemailerConfig.NODEMAILER_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `Password reset code for E-commerce is: ${OTP} and it vaild only for 5 minutes `,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
      return 'Error in sending email';
    } else {
      console.log('Email sent: ' + info.response);
      const hashOtp = await bcrypt.hash(OTP.toString(),3);
      redisOtpStore(email,hashOtp)
      return 'reset password otp is sent to your email';
    }
  });
}

export  const setPwd = async(modelName:any,email:string,otp: string,newPassword: string)=>{
  const isVerify:boolean = await otpVerification(email,otp);
  if(isVerify){
    const hashPwd = await bcrypt.hash(newPassword,3);
    await modelName.updateOne({ email: email }, { $set: { password: hashPwd } });
    return "Password reset"
  } else {
    return "incorrect otp"
  }
}


