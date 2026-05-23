import { hash } from "bcrypt";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
const signupUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  console.log("stingPss",password.toString());
  try {
    const hashPassword =await hash(password.toString(),10) //slat need to move .env
    const query = `
  INSERT INTO users (name, email, password, role)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

    const result = await pool.query(query, [name, email, hashPassword, role]);
    const finalResult: any = result.rows[0];
    const { password: userPassword, ...allValues } = finalResult;
    return allValues;
  } catch (error) {
    console.log("error",error);
    throw error;
  }
};

const loginUser = async(payload:{email:string,password:string})=>{
  console.log("login api");
}


export const authService = {
  signupUser,
  loginUser
};
