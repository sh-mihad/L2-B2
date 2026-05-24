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

export const issueService = {
  createIssue,
  getAllIssues,
};
