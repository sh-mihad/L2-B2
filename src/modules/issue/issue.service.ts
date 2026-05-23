import type { Request } from "express";
import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssue = async (req: Request, payload: IIssue) => {
  const { description, title, type } = payload;
  const user = req.user;
  try {
    const result = await pool.query(
      `
            INSERT INTO issues(title,description,type,reporter_id)
            VALUES($1,$2,$3,$4)
            RETURNING * 
            `,
      [title, description, type, user?.id],
    );
    return result.rows[0]
  } catch (error) {
    throw error
  }
};


export const userService ={
    createIssue
}