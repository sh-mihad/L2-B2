import type { NextFunction, Request, Response } from "express";

const globalErrorMiddleware = (err:any,req:Request,res:Response,next:NextFunction)=>{
     res.status(500).json({
        success:false,
        message:err.message || "Internal server error!!",
        data:null
     })
}


export default globalErrorMiddleware;