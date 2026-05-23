import express from "express";
import { pool } from "./db";
import globalErrorMiddleware from "./middleware/globaEerrorMiddleware";
import { authRouter } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the DevPulse  app");
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRoute);
app.use(globalErrorMiddleware)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);
      const users = result.rows
      res.status(200).json(users)
  } catch (error) {}
});

export default app;
