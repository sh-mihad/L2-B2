import type { Request, Response } from "express";
import type { IIssue } from "./issue.interface";
import { userService } from "./issue.service";

const createIssue = async(req:Request,res:Response)=>{
    const payload:IIssue = req.body;
   try {
      const createIssue = await userService.createIssue(req,payload)
       res.status(201).json({
         success: true,
         message: "Issue created successfully",
         data: createIssue,
       });
     } catch (error:any) {
        res.status(500).json({
         success: false,
         message: error.message||"Internal server error",
         data: null,
       });
     }
}

export const issueController = {
    createIssue
}