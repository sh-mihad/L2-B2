import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_KEY, SALT_ROUND } from "../../constent";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
const signupUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  try {
    const hashPassword =await hash(password.toString(),SALT_ROUND) 
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
  const {email,password} = payload;
  try {
    const userResult = await pool.query(`
          SELECT * FROM users WHERE email=$1
      `,[email])
    if(userResult?.rowCount === 0){
      throw new Error("Wrong credentials")
    }
    const user = userResult.rows[0];
    const isCorrectPassword = await compare(password, user.password);
    if(!isCorrectPassword){
      throw new Error("In correct password")
    }

    const token = jwt.sign(user,JWT_KEY,{ expiresIn: '5h'})
    const {password:userPassword,...restInfo}=user
    return {
     token,
     user:restInfo
    }
    
  } catch (error) {
    throw error
  }
}


export const authService = {
  signupUser,
  loginUser
};
