import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_KEY } from "../constent";
import { pool } from "../db";
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized access!!" });
    }
    const decoded = jwt.verify(token as string,JWT_KEY) as JwtPayload;
    const verifyUser =await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[decoded.email])
    if(verifyUser.rowCount === 0){
         res
        .status(401)
        .json({ success: false, message: "Unauthorized access!!" });
    }
    req.user = verifyUser.rows[0]
    next()
  } catch (error) {
    next(error)
  }
};

export default authMiddleware;
