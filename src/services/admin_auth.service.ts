import bcrypt from 'bcrypt';
import Session from "../database/models/postgresSQL/session.model";
import jwt from 'jsonwebtoken';
import client from "../database/redis.db";
import { jwtConfig, nodemailerConfig, twilioConfig } from "../../envConfig";
import twilio from 'twilio';
import Admin from "../database/models/postgresSQL/admin.model";
import nodemailer from "nodemailer"

const twilioClient = twilio(twilioConfig.TWILIO_ACCOUNT_SID, twilioConfig.TWILIO_AUTH_TOKEN);

class AdminAuthService {
    
    async userLoginbyThirdParty (user_id:number) { 
        const session_id = await adminAuthService.sessionCreation(user_id);
        const token = adminAuthService.tokenGenration(user_id,session_id);
        await adminAuthService.redisSessionCreation(user_id,session_id);
        return token;
    }

    async userSigninByPh_no (ph_no:string) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        await twilioClient.messages.create({
        body: `Your verification code for E-commerce is: ${verificationCode} and it vaild only for 5 minutes`,
        from: twilioConfig.TWILIO_MSG_NO,
        to: `+91${ph_no}`
        });
        const hashOtp = await bcrypt.hash(verificationCode.toString(),3);
        await adminAuthService.redisOtpStore(ph_no,hashOtp)
    }
    
    async redisOtpStore (value: string,otp: string) {
        let otp_payload={
            id: value,
            otp: otp
        }
    await client.setex(`${value}__otp`,300,JSON.stringify(otp_payload))
    }
    
    async otpVerification (value: string,otp: string) {
        const bcryptOtp= await client.get(`${value}__otp`)as string; 
        const checkOtp =await bcrypt.compare(otp, JSON.parse(bcryptOtp).otp)
        return checkOtp;
    }

    async verifyUserPh_no (ph_no: string) {
        const checkPh_no = await Admin.findOne({where:{ph_no: ph_no}})
        return checkPh_no;
    }

    async verifyUsersEmail (email: string) {
        const checkEmail = await Admin.findOne({where:{email: email}})
        return checkEmail;
    }

    async matchPwd (password: string, bcryptPwd:string) {
        const checkPwd =bcrypt.compare(password, bcryptPwd)
        return checkPwd;
    }

    async sessionCreation (user_id: number) {
        let session_payload={
            user_id: user_id,
            device_id:"1234",
            device_type:"google chrome",
            isActive: true
        } 
        await Session.create(session_payload)
        const lastSessionId: number= await Session.max('id'); 
        return lastSessionId;
    }

    async tokenGenration (user_id: number,session_id: number) {
        const token: string = jwt.sign({id:user_id,baseUrl:"/admin",session_id: session_id},jwtConfig.JWT_TOKEN_CODE,{expiresIn: '24h'});
        return token;
    }

    async redisSessionCreation (user_id: number,session_id: number) {
        let session_payload={
            user_id: user_id,
            device_id:"1234",
            device_type:"google chrome",
            isActive: true
        }
        const a =await client.setex(`${user_id}_${session_id}`,24*60*60,JSON.stringify(session_payload))    
    }

    async userLogout (user_id: number,session_id: number) {
        const result = await Session.update({isActive: false,},{where: {id:session_id}});
        await client.del(`${user_id}_${session_id}`)
        return result;
    }

    async forgetPwdToken (email: string) {
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
    
        transporter.sendMail(mailOptions, async(error, info)=>{
            if (error) {
                console.log(error);
                return 'Error in sending email';
            } else {
                console.log('Email sent: ' + info.response);
                const hashOtp = await bcrypt.hash(OTP.toString(),3);
                await adminAuthService.redisOtpStore(email,hashOtp)
                return 'reset password otp is sent to your email';
            }
        });
    }

    async setPwd (email:string,otp: string,newPassword: string) {
        const isVerify:boolean = await adminAuthService.otpVerification(email,otp);
        if(isVerify){
            const hashPwd = await bcrypt.hash(newPassword,3);
            await Admin.update({password: hashPwd,},{where: {email:email}});
            return "Password reset"
        } else {
            return "incorrect otp"
        }
    }
}

export const adminAuthService = new AdminAuthService();