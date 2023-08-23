import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import client from "../database/redis.db";
import Session  from "../database/models/postgresSQL/session.model";
import { deliveryConfig, jwtConfig } from "../../envConfig";

export async function auth(req:Request,res:Response,next:NextFunction){
    const token: any = req.headers.authorization;
    if(!token) return res.status(401).send("ACCESS_DENIED");
    try{
        const decoded: any = jwt.verify(token,jwtConfig.JWT_TOKEN_CODE)
        console.log('token ', decoded);
        console.log('session_id' , decoded.session_id);
        const parser = await client.get(`${decoded.id}_${decoded.session_id}`) as string
        const findSession= JSON.parse(parser) || await Session.findOne({where: {id: decoded.session_id}});
        if(findSession.isActive===false){
            return res.status(400).send("Session out");
        }
        req.body.id = decoded.id
        req.body.baseUrl = decoded.baseUrl;
        req.body.session_id = decoded.session_id
        next();
    }catch(err:any){
        res.status(400).send("INVALID_TOKEN")
    }
}

export async function buyerAccess(req:Request,res:Response,next:NextFunction){
    const token: any = req.headers.authorization;
    if(!token) return res.status(401).send("ACCESS_DENIED");
    try{
        const decoded: any = jwt.verify(token,jwtConfig.JWT_TOKEN_CODE)
        console.log('token ', decoded);
        console.log('session_id' , decoded.session_id);
        const parser = await client.get(`${decoded.id}_${decoded.session_id}`) as string
        const findSession= JSON.parse(parser) || await Session.findOne({where: {id: decoded.session_id}});
        if(findSession.isActive===false){
            return res.status(400).send("Session out");
        }
        if(decoded.baseUrl !== "/buyer"){
            return res.status(400).send("You don't access this route");
        }
        req.body.id = decoded.id
        req.body.baseUrl= decoded.baseUrl
        req.body.session_id = decoded.session_id
        next();
        
    }catch(err:any){
        res.status(400).send("INVALID_TOKEN")
    }
}

export async function sellerAccess(req:Request,res:Response,next:NextFunction){
    const token: any = req.headers.authorization;
    if(!token) return res.status(401).send("ACCESS_DENIED");
    try{
        const decoded: any = jwt.verify(token,jwtConfig.JWT_TOKEN_CODE)
        console.log('token ', decoded);
        console.log('session_id' , decoded.session_id);
        const parser = await client.get(`${decoded.id}_${decoded.session_id}`) as string
        const findSession= JSON.parse(parser) || await Session.findOne({where: {id: decoded.session_id}});
        if(findSession.isActive===false){
            return res.status(400).send("Session out");
        }
        if(decoded.baseUrl !== "/seller"){
            return res.status(400).send("You don't access this route");
        }
        req.body.id = decoded.id
        req.body.baseUrl= decoded.baseUrl
        req.body.session_id = decoded.session_id
        next();
        
    }catch(err:any){
        res.status(400).send("INVALID_TOKEN")
    }
}

export async function adminAccess(req:Request,res:Response,next:NextFunction){
    const token: any = req.headers.authorization;
    if(!token) return res.status(401).send("ACCESS_DENIED");
    try{
        const decoded: any = jwt.verify(token,jwtConfig.JWT_TOKEN_CODE)
        console.log('token ', decoded);
        console.log('session_id' , decoded.session_id);
        const parser = await client.get(`${decoded.id}_${decoded.session_id}`) as string
        const findSession= JSON.parse(parser) || await Session.findOne({where: {id: decoded.session_id}});
        if(findSession.isActive===false){
            return res.status(400).send("Session out");
        }
        if(decoded.baseUrl !== "/admin"){
            return res.status(400).send("You don't access this route");
        }
        req.body.id = decoded.id
        req.body.baseUrl= decoded.baseUrl
        req.body.session_id = decoded.session_id
        next();
        
    }catch(err:any){
        res.status(400).send("INVALID_TOKEN")
    }
}

export async function delvieryAccess(req:Request,res:Response,next:NextFunction){
    const token: any = req.headers.authorization;
    if(!token) return res.status(401).send("ACCESS_DENIED");
    try{
        if(token === deliveryConfig.DELIVERY_ACCESS_CODE)
        next();
    } catch(err:any){
        res.status(400).send("INVALID_TOKEN")
    }
}