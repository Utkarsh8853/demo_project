import express from "express";
import { adminAccess} from "../middleware/auth.middleware";
import { adminController } from "../controllers/admin.controller";

export const adminRouter = express.Router();

adminRouter.post('/category', adminAccess, adminController.addCategory);
adminRouter.put('/category', adminAccess, adminController.updateCategoryName);
adminRouter.delete('/category', adminAccess, adminController.removeCategory);

adminRouter.put('/seller', adminAccess, adminController.verifySeller);
adminRouter.get('/seller', adminAccess, adminController.viewAllSeller);
adminRouter.delete('/seller', adminAccess, adminController.removeSeller);

adminRouter.get('/buyer', adminAccess, adminController.viewAllBuyer);
