import express from "express";
import { adminAuthController } from "../controllers/admin_auth.controller";
import {auth} from "../middleware/auth.middleware";
import { forgetPasswordValidate, newUserValidate, setPasswordValidate, userLoginValidate } from "../middleware/joiValidate.middleware";

export const adminAuthRouter = express.Router();






adminAuthRouter.post('/numberSignin',adminAuthController.twilioSignin );
adminAuthRouter.post('/otpVerify',adminAuthController.otpVerification );
adminAuthRouter.get('/googleSignin', adminAuthController.signin);
adminAuthRouter.get('/callback',adminAuthController.signinCallback );
adminAuthRouter.post('/login',userLoginValidate,adminAuthController.login);
adminAuthRouter.get('/logout',auth, adminAuthController.logout );
adminAuthRouter.get('/forgetPassword', forgetPasswordValidate,adminAuthController.forgetPassword);
adminAuthRouter.put('/setPassword', setPasswordValidate,adminAuthController.setNewPassword);