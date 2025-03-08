import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction){
    const token = req.header("Authorization")?.split(' ')[1];
    if(!token){
        res.status(401).json({message: "Access Denied"});
        return;
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
        (req as any).user = decoded;
        next();
    } catch(err){
        res.status(400).json({message: "Invalid Token"});
    }
}

export function authorizeAdmin(req: Request, res: Response, next: NextFunction){
    const user = (req as any).user.role;
    
    if (!user) {
        res.status(401).json({ message: "Unauthorized: No user found" });
        return; 
    }

    if(user !== "admin"){
        res.status(403).json({message: "Forbidden: Admins only"});
        return; 
    }
    next();
}