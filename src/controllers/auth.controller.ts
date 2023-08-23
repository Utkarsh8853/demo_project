import { Request,Response } from "express";
import { OAuth2Client } from 'google-auth-library'
import { googleConfig } from "../../envConfig";
import client from "../database/redis.db"
import { authService } from "../services/auth.service";

class AuthController {

    async signin(req:Request, res:Response) {
        try {
            const redirect_uri = await authService.checkRedirectUri(req.baseUrl);
            const connect = new OAuth2Client(googleConfig.CLIENT_ID,googleConfig.CLIENT_SECRET,redirect_uri);
            const url = connect.generateAuthUrl({
                access_type: 'offline',
                scope: ['email', 'profile'],
                redirect_uri: redirect_uri,
              });
              res.redirect(url);
        } catch(err) {
            console.error(err);
        }
    }

    async signinCallback(req:Request, res:Response) {
        try {
            const redirect_uri = await authService.checkRedirectUri(req.baseUrl);
            const connect = new OAuth2Client(googleConfig.CLIENT_ID,googleConfig.CLIENT_SECRET,redirect_uri);
            console.log("222",req.baseUrl)
            const modelName = await authService.checkModel(req.baseUrl)
            const { code } = req.query;
            const { tokens } = await connect.getToken(code as string);
            // console.log(tokens);
            const ticket:any = await connect.verifyIdToken({
                idToken: tokens.id_token as string,
                audience: googleConfig.CLIENT_ID,
            });
            // console.log(ticket);
            
            const { name, email} = ticket.getPayload();
            connect.revokeToken(tokens.access_token as string);
            console.log("/////////////",modelName);
            
            const verifyUser:any = await authService.verifyUserExist(modelName,email)            
            if (!verifyUser){
                const jwtToken = await authService.userEntrybyGoogle(modelName,name, email);
                console.log('Signup successfully',jwtToken);
                return res.status(200).send(`Here is new user.${name} whose email id is ${email} and his jwt token is  "${jwtToken}" `);
            }
            else if (verifyUser){
                const jwtToken = await authService.userLoginbyThirdParty(req.baseUrl.toString(),verifyUser._id);
                console.log('Signup successfully',jwtToken);
                return res.status(200).send(`Welcome ${name} your jwt token is  "${jwtToken}"`);
            }
        } catch(err) {
            console.error(err);
        }
    }

    async twilioSignin(req:Request, res:Response) {
        try {
            const { ph_no } = req.body;
            authService.userSigninByPh_no(ph_no)
            return res.status(200).send(`Verification code sent to ${ph_no}`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error sending verification code');
        }
    }

    async otpVerification(req:Request, res:Response) {
        try {
            const modelName = await authService.checkModel(req.baseUrl)
            const { ph_no, otp, name } = req.body;
            const storedOtp:boolean = await authService.otpVerification(ph_no,otp.toString());
            if (storedOtp) {
                const verifyUser:any = await authService.verifyUserPh_no(modelName,ph_no);
                if (!verifyUser){
                    if(!req.body.name){
                        return res.status(401).send("please send user name with otp and phone number")
                    }
                    const jwtToken = await authService.userEntrybyPh_no(modelName,name, ph_no);
                    console.log('Signup successfully',jwtToken);
                    return res.status(200).send(`Here is new user.${name} whose phone number is ${ph_no} and his jwt token is  "${jwtToken}" `);
                }
                else if (verifyUser){
                    const jwtToken = await authService.userLoginbyThirdParty(req.baseUrl.toString(),verifyUser.id);
                    console.log('Signup successfully',jwtToken);
                    await client.del(`${ph_no}__otp`)
                    return res.status(200).send(`Welcome ${name} your jwt token is  "${jwtToken}"`);
                }
                return res.status(200).send('Phone number verified');
            } else {
                res.status(400).send('Invalid verification code');
            }
          } catch (error) {
                console.error(error);
                res.status(500).send('Error verifying phone number');
          }
    }

    async signup(req:Request, res:Response) {
        try {
            const modelName = await authService.checkModel(req.baseUrl)
            const {name, email, password } = req.body;
            const verifyUser = await authService.verifyUserExist( modelName,email)
            if (!verifyUser){
                const result = await authService.userEntry(modelName,name, email, password);
                console.log('Signup successfully',result);
                return res.status(200).json({message: "OK"});
            }
            else if (verifyUser){
                return res.status(400).json({message: "Username or email already exist"});
            }
        } catch(err) {
            console.error(err);
            return res.status(400).json({message: "Server problem"});
        }
    }

    async login(req:Request, res:Response) {
        try {
            const modelName = await authService.checkModel(req.baseUrl)
            const { email, password } = req.body;
            const verifyUser:any = await authService.verifyUserExist(modelName,email);
            
            if(!verifyUser) {
                return res.status(200).json({message: "Wrong user"});
            }
            const pwdMatch = await authService.matchPwd(password, verifyUser.password as string);
            if(pwdMatch) {
                const sessionId = await authService.sessionCreation(verifyUser.id)
                console.log('Login result',verifyUser); 

                const token = authService.tokenGenration(req.baseUrl.toString(),verifyUser.id,sessionId);
                console.log('token ',token);

                const a =await authService.redisSessionCreation(verifyUser.id,sessionId)
                return res.send({message:"User Login Succesfully",token:token})
            }
            return res.status(400).json({message: "Incorrect Password"});
        } catch(err) {
            console.error(err);
        }
    }

    async logout(req:Request, res:Response) {
        try {
            const user_id = req.body.id;
            const session_id = req.body.session_id;
            const result = await authService.userLogout(user_id,session_id)
            console.log('Logout',result);
            return res.status(200).send('Logout');
        } catch(err) {
            console.error(err);
        }
    }

    async forgetPassword(req:Request, res:Response) {
        try {
            const modelName = await authService.checkModel(req.baseUrl)
            const {email} = req.body;
            const userEmail:any = await authService.verifyUserExist(modelName,email)
            if(!userEmail) {
                return res.status(200).json({message: "Wrong user"});
            }
            const response = await authService.forgetPwdToken(email)
            return res.status(200).send(`${response} ${email}`);

        } catch(err) {
            console.error(err);
        }
    }

    async setNewPassword(req:Request, res:Response) {
        try {
            const modelName = await authService.checkModel(req.baseUrl)
            const {email,otp,newPassword} = req.body;
            const result = await authService.setPwd(modelName,email,otp.toString(),newPassword)
            console.log(result);
            return res.status(200).send(result);
        } catch(err) {
            console.error(err);
            res.status(400).send("incorrect otp")
        }
    }
}

export const authController = new AuthController();