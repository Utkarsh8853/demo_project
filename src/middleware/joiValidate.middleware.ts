import {Request,Response} from "express";
import Joi from "joi";

//Fucntion for user validation
export const newUserValidate=(req:Request,res:Response,next: () => void)=>{
    const userSchema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        password:Joi.string().min(8).required()
    });
    const result=userSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const userLoginValidate=(req:Request,res:Response,next: () => void)=>{
    
    const userSchema=Joi.object({
        email:Joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        password:Joi.string().min(8).required()
    });
    const result=userSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const forgetPasswordValidate=(req:Request,res:Response,next: () => void)=>{
    const userSchema=Joi.object({
        email:Joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    });
    const result=userSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const setPasswordValidate=(req:Request,res:Response,next: () => void)=>{
    const userSchema=Joi.object({
        newPassword:Joi.string().min(8).required()
    });
    const result=userSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}


//Fucntion for user-dashboard validation
export const updateProfileValidate=(req:Request,res:Response,next: () => void)=>{
    const userSchema=Joi.object({
        name:Joi.string().optional(),
        username:Joi.string().optional(),
        email:Joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).optional(),
        gender:Joi.string().equal(...['male','female','other']).optional(),
        ph_no:Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).optional(),
    });
    const result=userSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const addAddressValidation=(req:Request,res:Response,next: () => void)=>{
    
    const addressSchema=Joi.object({
        house_no:Joi.string().required(),
        street_no:Joi.string().required(),
        area:Joi.string().required(),
        city:Joi.string().required(),
        state:Joi.string().required(),
        zip_code:Joi.number().required()
    });
    const result=addressSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const updateAddressValidation=(req:Request,res:Response,next: () => void)=>{
    
    const addressSchema=Joi.object({
        house_no:Joi.string().optional(),
        street_no:Joi.string().optional(),
        area:Joi.string().optional(),
        city:Joi.string().optional(),
        state:Joi.string().optional(),
        zip_code:Joi.number().optional(),
        _id:Joi.string().optional()
    });
    const result=addressSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}


//Fucntion for product validation
export const addProductValidator=(req:Request,res:Response,next: () => void)=>{
    const productSchema=Joi.object({
        name:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        category_id:Joi.string().required(),
        quantity:Joi.number().required()
    });
    const result=productSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const biddingValidator=(req:Request,res:Response,next: () => void)=>{
    const productSchema=Joi.object({
        product_id:Joi.number().required(),
        new_bidding_price:Joi.number().required()
    });
    const result=productSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}

export const updateProductValidator=(req:Request,res:Response,next: () => void)=>{
    const productSchema=Joi.object({
        name:Joi.string().optional(),
        description:Joi.string().optional(),
        base_price:Joi.number().optional(),
        category_id:Joi.number().optional(),
        address_id:Joi.number().optional()
    });
    const result=productSchema.validate(req.body)
    if(result.error)
    {
        res.status(400).send(result.error);
    }
    else
    {
        next();
    }
}
