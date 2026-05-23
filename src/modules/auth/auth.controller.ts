import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const signupUser = await authService.signupUser(payload);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: signupUser,
    });
  } catch (error:any) {
    console.log("error from auth controller",error);
     res.status(500).json({
      success: false,
      message: error.message||"Internal server error",
      data: null,
    });
  }
};
const login = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const signupUser = await authService.loginUser(payload);
    res.status(201).json({
      success: true,
      message: "User login successful",
      data: signupUser,
    });
  } catch (error:any) {
     res.status(500).json({
      success: false,
      message: error.message||"Internal server error",
      data: null,
    });
  }
};

export const authController = {
  signup,
  login
};
