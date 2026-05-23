import { type NextFunction, type Request, type Response } from "express";

export const userRoleMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        if(req.user && (req.user.role !== "contributor"||req.user.role !== "maintainer")){
            res.status(403).json({
           success:false,
           message:"Only Contributor or Maintainer will create issue"
         })
        }else{
         res.status(403).json({
           success:false,
           message:"Forbidden user"
         })
        }
    } catch (error) {
        next(error)
    }
}
