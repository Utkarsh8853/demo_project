import express from "express";
import { dashboardController } from "../controllers/user-dashboard.controller";
import {auth} from "../middleware/auth.middleware";
import { addAddressValidation, setPasswordValidate, updateAddressValidation, updateProfileValidate } from "../middleware/joiValidate.middleware";

export const dashboardRouter = express.Router();

dashboardRouter.put('/profile', updateProfileValidate, auth, dashboardController.updateProfile);
dashboardRouter.get('/profile', auth, dashboardController.viewProfile);
dashboardRouter.delete('/profile', auth, dashboardController.deleteAccount);

dashboardRouter.post('/address', addAddressValidation, auth, dashboardController.addAddress);
dashboardRouter.put('/address', updateAddressValidation, auth, dashboardController.updateAddress);
dashboardRouter.get('/address', auth, dashboardController.allAddress);
dashboardRouter.delete('/address', auth, dashboardController.deleteAddress);

dashboardRouter.put('/password', setPasswordValidate, auth, dashboardController.updatePassword);


