import express from "express";
import { authController } from "../controllers/auth.controller";
import {auth} from "../middleware/auth.middleware";
import { forgetPasswordValidate, newUserValidate, setPasswordValidate, userLoginValidate } from "../middleware/joiValidate.middleware";
import otpLimit from "../middleware/otp-limit.middleware";

export const authRouter = express.Router();

authRouter.post('/numberSignin', otpLimit, authController.twilioSignin );
authRouter.post('/otpVerify', authController.otpVerification );
authRouter.get('/googleSignin', authController.signin);
authRouter.get('/callback', authController.signinCallback );
authRouter.post('/signup',newUserValidate, authController.signup);
authRouter.post('/login',userLoginValidate, authController.login);
authRouter.get('/logout',auth, authController.logout );
authRouter.get('/forgetPassword', otpLimit, forgetPasswordValidate, authController.forgetPassword);
authRouter.put('/setPassword', setPasswordValidate, authController.setNewPassword);