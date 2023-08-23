import { NextFunction, Request, Response } from "express";
import client from "../database/redis.db";

export default  async function otpLimit(req:Request,res:Response,next:NextFunction){

    try{
        let value;
        if(req.body.email){
            value= req.body.email;
        } else{
            value= req.body.ph_no;
        }
        const key = `${value}__otp`;
        const exists = await client.exists(key);
        if (!exists) {
            next();
        } else {
            const ttl = await client.ttl(key);
            console.log(`${key} expires in ${ttl} seconds`);
            return res.status(401).send(`you create new otp on this ${value} after ${ttl} second`)
        }
    }catch(err:any){
        res.status(400).send("provide proper detail")
    }
}