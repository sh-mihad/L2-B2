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
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
const getAllIssues = async (
  sort: string | undefined = "newest",
  type: string | undefined,
  status: string | undefined,
) => {
  let orderBy = sort === "newest" ? "DESC" : "ASC";
  const filters: any = [];
  const values: any = [];
  if (type) {
    values.push(type);
    filters.push(`type=$${values.length}`);
  }
  if (status) {
    values.push(status);
    filters.push(`status=$${values.length}`);
  }

  const filterQuery =
    filters?.length > 0 ? ` WHERE ${filters.join(" AND ")}` : "";
  try {
    const issueResult = await pool.query(
      `
            SELECT * FROM issues 
           ${filterQuery}
             ORDER BY created_at ${orderBy} 
            `,
      values,
    );
    const reportersResult = await pool.query(
      `
    SELECT id,name,role FROM users
     WHERE id = ANY($1)
    `,
      [issueResult.rows.map((item: any) => item.reporter_id)],
    );

    const allIssues = issueResult.rows;
    const reporters = reportersResult.rows;
    const combinedData = allIssues.map((item) => {
      const { reporter_id, ...restValues } = item;
      return {
        ...restValues,
        // reporter:reporters.some((user:any)=>user.id === item.reporter_id)?
        reporter:
          reporters.find((reporter: any) => reporter.id === reporter_id) ??
          null,
      };
    });
    return combinedData || [];
  } catch (error) {
    throw error;
  }
};
const getSingleIssue = async (postId: string | number) => {
  try {
    const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
      postId,
    ]);
    if(!issueResult.rows[0] ){
      return null
    }
    const reportersResult = await pool.query(
      `
    SELECT id,name,role FROM users
     WHERE id =$1
    `,
      [issueResult.rows[0].reporter_id],
    );
    const { reporter_id, ...restValues } = issueResult.rows[0];
    return {
      ...restValues,
      reporter: reportersResult.rows[0],
    };
  } catch (error) {
    throw error;
  }
};
const updateIssue = async (req: Request, payload: IIssue, postId: string) => {
  const { description, title, type, status } = payload;

  const user = req.user;
  try {
    const getIssueResult = await pool.query(
      `
      SELECT * FROM issues WHERE id=$1
      `,
      [postId],
    );
    const singleIssue = getIssueResult.rows[0];
    if(!singleIssue){
      throw new Error("Issue not found!")
    }
    // check the status
    if (singleIssue.status !== "open") {
      throw new Error(
        "Only open status issue will update.This issue is not allowed for update!",
      );
    }
    // check user role
    if (user && user.role === "maintainer") {
      console.log("inside the user role maintainer");
      const result = await pool.query(
        `
            UPDATE issues
            SET 
              title=COALESCE($1,title),
              description=COALESCE($2,description),
              type=COALESCE($3,type),
              status=COALESCE($4,status)
            RETURNING * 
            `,
        [title, description, type, status],
      );
      return result.rows[0];
    }else if (user && user.role === "contributor" && singleIssue.reporter_id === user.id){
       const result = await pool.query(
        `
            UPDATE issues
            SET 
              title=COALESCE($1,title),
              description=COALESCE($2,description),
              type=COALESCE($3,type),
              status=COALESCE($4,status)
            RETURNING * 
            `,
        [title, description, type, status],
      );
      return result.rows[0];
    }else{
      throw new Error('You are not allowed for update this issue!')
    }
  } catch (error) {
    throw error;
  }
};
const deleteIssue = async (req: Request, postId: string) => {
  const user = req.user;
  try {
    const getIssueResult = await pool.query(
      `
      SELECT * FROM issues WHERE id=$1
      `,
      [postId],
    );
    const singleIssue = getIssueResult.rows[0];
    // check the status
    if (!singleIssue?.id) {
      throw new Error(
        "No issue found!",
      );
    }
    // check user role
    if (user && user.role === "maintainer") {
      const result = await pool.query(
        `
            DELETE FROM issues
            WHERE id=$1
            `,
        [postId],
      );
      return result.rows[0];
    }
    else{
      throw new Error('You are not allowed for delete this issue!')
    }
  } catch (error) {
    throw error;
  }
};
export const issueService = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};
