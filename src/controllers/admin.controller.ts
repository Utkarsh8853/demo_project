import { Request,Response } from "express";
import { adminService } from "../services/admin.service";

class AdminController {

    async addCategory (req:Request, res:Response) {
        try {
            const {category_name} = req.body;
            const categoryExist = await adminService.findCategoryByName(category_name);
            if(categoryExist){
                return res.status(400).send(`Category already exist`);
            }
            await adminService.createCategory(category_name);
            return res.status(200).send(`Category added`);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async updateCategoryName (req:Request, res:Response) {
        try {
            const {category_id,category_name} = req.body;
            const categoryExist = await adminService.findCategory(category_id)
            if(!categoryExist) {
                return res.status(200).json({message: "Wrong category id"});
            }
            const categoryExistByName = adminService.findCategoryByName(category_name);
            if(!categoryExistByName) {
                return res.status(200).json({message: "Category name already exist"});
            }
            await  adminService.updateCategory(category_name,category_id);
            return res.status(200).send(`Category name is updated`);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async removeCategory(req:Request, res:Response) {
        try {
            const {category_id} = req.body;
            const categoryExist = await adminService.findCategory(category_id)
            if(!categoryExist) {
                return res.status(200).json({message: "Wrong category id"});
            }
            await adminService.deleteCategory(category_id);
            return res.status(200).send(`${categoryExist.name} category deleted `);
        } catch(err) {
            console.error(err);
            res.status(400).send("incorrect otp")
        }
    }

    async verifySeller (req:Request, res:Response) {
        try {
            const {seller_id} = req.body;
            const sellerInfo = await adminService.getSeller(seller_id);
            if(!sellerInfo){
                return res.status(400).send(`Seller not exist`);
            }
            await adminService.updateSellerStatus(seller_id);
            return res.status(200).send(`Seller is approved to add product`);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async viewAllSeller (req:Request, res:Response) {
        try {
            const result = adminService.findAllSellers;
            return res.status(200).send(result);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async viewAllBuyer (req:Request, res:Response) {
        try {
            const result = adminService.findAllBuyers;
            return res.status(200).send(result);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async removeSeller (req:Request, res:Response) {
        try {
            const {seller_id} = req.body;
            const sellerInfo = await adminService.getSeller(seller_id);
            if(!sellerInfo){
                return res.status(400).send(`Seller not exist`);
            }
            await adminService.removeAccount(seller_id)
            return res.status(400).send(`Server problem`);

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }
}

export const adminController = new AdminController();