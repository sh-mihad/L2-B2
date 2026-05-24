import type { Request, Response } from "express";
import type { IIssue } from "./issue.interface";
import { issueService } from "./issue.service";

const createIssue = async(req:Request,res:Response)=>{
    const payload:IIssue = req.body;
   try {
      const createIssue = await issueService.createIssue(req,payload)
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
const getAllIssues = async(req:Request,res:Response)=>{
    const {sort,status,type} = req.query
   
    try {
        const result = await issueService.getAllIssues(sort as string,status as string,type as string)
         res.status(200).json({
         success: true,
         data: result,
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
    createIssue,
    getAllIssues
}